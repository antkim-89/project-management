import { useState } from 'react'
import { BaseModal } from '@/components/base/BaseModal'
import { useUsers } from '@/hooks/api/useUsers'
import { useProjectDetail } from '@/hooks/api/useProjects'
import api from '@/lib/axios'
import { useQueryClient } from '@tanstack/react-query'
import { 
  Search, 
  Check, 
  Briefcase, 
  Users,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User, SkillSet } from '@/types/api'

interface UserSkill {
  id: string;
  userId: string;
  skillSetId: string;
  skillSet?: SkillSet;
}

interface TeamMember extends User {
  skills?: UserSkill[];
}

interface ManageTeamModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

interface AllocationState {
  userId: string
  role: string
  isInitiallyAllocated: boolean
  initialRole?: string
}

export function ManageTeamModal({ isOpen, onClose, projectId }: ManageTeamModalProps) {
  const queryClient = useQueryClient()
  const { data: allUsers, isLoading: usersLoading } = useUsers()
  const { data: project, isLoading: projectLoading } = useProjectDetail(projectId)

  // Allocation local state
  const [allocations, setAllocations] = useState<Record<string, AllocationState>>({})
  const [prevAssignments, setPrevAssignments] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('ALL')
  const [isSaving, setIsSaving] = useState(false)

  // Sync state during render (React recommended way to avoid cascading renders in effects)
  if (project?.assignments && project.assignments !== prevAssignments) {
    setPrevAssignments(project.assignments)
    const initialMap: Record<string, AllocationState> = {}
    project.assignments.forEach((assignment: any) => {
      initialMap[assignment.userId] = {
        userId: assignment.userId,
        role: assignment.role,
        isInitiallyAllocated: true,
        initialRole: assignment.role
      }
    })
    setAllocations(initialMap)
  }

  // Filter users for resource list
  const filteredUsers = (allUsers as TeamMember[] | undefined)?.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.rank?.name || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSkill = selectedSkill === 'ALL' || 
                         u.skills?.some(s => s.skillSet?.name === selectedSkill)

    return matchesSearch && matchesSkill
  }) || []

  // Extract unique skills dynamically
  const uniqueSkills = Array.from(
    new Set(
      (allUsers || [])
        .flatMap(u => (u as TeamMember).skills || [])
        .map(s => s.skillSet?.name)
        .filter((name): name is string => !!name)
    )
  )

  const handleToggleAllocate = (user: TeamMember) => {
    const current = allocations[user.id]
    if (current) {
      // If currently selected, deselect it
      const nextAllocations = { ...allocations }
      delete nextAllocations[user.id]
      setAllocations(nextAllocations)
    } else {
      // If not selected, select it
      setAllocations({
        ...allocations,
        [user.id]: {
          userId: user.id,
          role: 'Developer', // Default role
          isInitiallyAllocated: false
        }
      })
    }
  }

  const handleRoleChange = (userId: string, role: string) => {
    if (allocations[userId]) {
      setAllocations({
        ...allocations,
        [userId]: {
          ...allocations[userId],
          role
        }
      })
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      if (!project) return
      const initialAssignments = project?.assignments || []
      
      // Determine what to add, delete, or update
      // 1. Deletions: in initialAssignments but not in allocations
      const toDelete = initialAssignments.filter((a: any) => !allocations[a.userId])
      for (const assign of toDelete) {
        await api.delete(`/assignments/project/${projectId}/user/${assign.userId}`)
      }

      // 2. Additions and Updates: in allocations
      for (const userId of Object.keys(allocations)) {
        const alloc = allocations[userId]
        const initial = initialAssignments.find((a: any) => a.userId === userId)

        if (!initial) {
          // New assignment addition
          await api.post('/assignments', {
            userId,
            projectId,
            role: alloc.role,
            contributionPercentage: 100,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate)
          })
        } else if (initial.role !== alloc.role) {
          // Role changed: delete and recreate to update role
          await api.delete(`/assignments/project/${projectId}/user/${userId}`)
          await api.post('/assignments', {
            userId,
            projectId,
            role: alloc.role,
            contributionPercentage: 100,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate)
          })
        }
      }

      // Invalidate queries to refresh the details immediately
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
      await queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
      
      onClose()
      window.location.reload()
    } catch (error) {
      console.error(error)
      alert('Failed to update project team.')
    } finally {
      setIsSaving(false)
    }
  }

  const footer = (
    <div className="flex gap-2">
      <button 
        onClick={onClose} 
        className="btn-glass px-4 h-10 cursor-pointer"
        disabled={isSaving}
      >
        Cancel
      </button>
      <button 
        onClick={handleSaveChanges} 
        className="btn-primary px-6 h-10 cursor-pointer"
        disabled={isSaving || projectLoading}
      >
        {isSaving ? 'Saving Changes...' : 'Save Team'}
      </button>
    </div>
  )

  const activeAllocCount = Object.keys(allocations).length

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage Team - ${project?.title || 'Loading...'}`}
      footer={footer}
      size="lg"
    >
      <div className="flex flex-col gap-6 max-h-[65vh] overflow-y-auto pr-1">
        {/* Helper Alert Strip */}
        <div className="flex items-start gap-2.5 p-3.5 bg-primary/5 border border-primary/20 rounded-xl text-primary text-body-sm leading-relaxed">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>
            Search company engineers and assign roles. Selected personnel will be allocated to this project. Deselected personnel will be removed from the team.
          </span>
        </div>

        {/* Resource Search Strip */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search resources by name or rank..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-on-surface text-label-md outline-none focus:border-primary transition-colors"
            />
          </div>
          <select 
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="bg-surface-container border border-outline-variant text-on-surface text-label-md rounded-lg px-3 py-2 outline-none focus:border-primary min-w-[150px]"
          >
            <option value="ALL">All Skills</option>
            {uniqueSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>

        {/* Allocation Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {usersLoading || projectLoading ? (
            <div className="col-span-2 text-center text-on-surface-variant py-8">Loading resources...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isAllocated = !!allocations[user.id]
              const currentAlloc = allocations[user.id]

              return (
                <div 
                  key={user.id}
                  onClick={() => handleToggleAllocate(user)}
                  className={cn(
                    "flex flex-col bg-surface-container border transition-all duration-300 rounded-xl p-4 shadow-sm cursor-pointer relative select-none",
                    isAllocated 
                      ? "border-primary shadow-lg shadow-primary/5 bg-primary/5" 
                      : "border-outline-variant hover:border-primary/40"
                  )}
                >
                  {/* User Profile info */}
                  <div className="flex gap-4">
                    <div className="relative">
                      <img 
                        src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover border border-outline-variant"
                      />
                      {isAllocated && (
                        <div className="absolute -top-1 -right-1 bg-primary text-on-primary w-5 h-5 rounded-full flex items-center justify-center border border-surface shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-on-surface text-label-lg truncate">{user.name}</h4>
                        <span className="text-[10px] font-bold font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                          ₩{(user.rank?.baseSalary || 0).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mt-0.5">{user.rank?.name}</p>
                    </div>
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant text-[9px] font-bold rounded">
                          {s.skillSet?.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-outline text-[9px]">No skills</span>
                    )}
                  </div>

                  {/* Allocated Project Role field (only if selected) */}
                  {isAllocated && (
                    <div 
                      className="mt-4 pt-3 border-t border-primary/20 flex flex-col gap-1.5"
                      onClick={(e) => e.stopPropagation()} // Prevent deselecting
                    >
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> Project Role
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Lead Developer, QA Engineer..."
                        value={currentAlloc?.role || ''}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="w-full bg-surface-container border border-primary/30 rounded px-2.5 py-1 text-on-surface text-label-md outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="col-span-2 text-center text-on-surface-variant py-8">
              No matching resources found.
            </div>
          )}
        </div>

        {/* Allocation Summary count */}
        {activeAllocCount > 0 && (
          <div className="flex items-center gap-2 p-3 bg-secondary/5 border border-secondary/20 rounded-lg text-secondary text-label-md font-bold mt-2">
            <Users className="w-5 h-5" />
            <span>Currently selecting {activeAllocCount} members for `{project?.title}`</span>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
