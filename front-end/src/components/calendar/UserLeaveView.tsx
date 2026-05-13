import React from 'react'
import { MoreHorizontal, Plane, Home, Calendar, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/base/GlassCard'
import { LeaveStatCard } from './LeaveStatCard'

interface LeaveRecord {
  id: string
  userName: string
  userRole: string
  avatar: string
  leaveType: 'Annual' | 'Sick' | 'Personal' | 'Remote'
  status: 'Approved' | 'Pending' | 'On Leave'
  startDate: string
  endDate: string
  days: number
}

const LEAVE_RECORDS: LeaveRecord[] = [
  {
    id: 'L1',
    userName: 'Kenji Tanaka',
    userRole: 'Machine Learning Engineer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnR-z9ORACpNW-FCUSomRy4jJstxDwz153csMvfPZ_cqqck8QI5yot-y05E5gUQoDppNZYJfQHbzZweT9X42yuPwj_c03d72WpQx5vprbx0FliRh9o19hck4fURwEv2SjNwDKOQ7uJ-nnPEzEdgBFbMCWdCG5htLl8idxDOYuRxwCdisF0jlH8d1S_fHVJoF0NnPI10XOgY1_jtD3WgmFqjuxM8QJdCM0bML9eCnn_V9edy15sOgA84oXrYMMEaBYij2rUlpRlb3E',
    leaveType: 'Annual',
    status: 'On Leave',
    startDate: '2025-10-15',
    endDate: '2025-10-20',
    days: 5
  },
  {
    id: 'L2',
    userName: 'Elena Rodriguez',
    userRole: 'Lead Frontend Architect',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3qa9sUFtCA_RSSigw9rkk1tdqGNmvNrkuxrp3Rm3TVMpbDg3YvhjlqzKLT2VLcCSo4_BOBg-4ZbzgSHM56cia_KJNEs5DcUxPuvf-AEKaim4NIIOusJM4ZVdZqBG9nYV9_0_OMjrBcetfQC83MA4hHXBsvJL6X43kZsuLmBBHDcv3Cmhs39dUkiJaCIR9AXfspNLryVtjk2YMPX0DjLtwi43s-Z7mVqGosh7THM7G9aRIxL0QOdlHAGctiKN3bSQhrACLfTOPcJs',
    leaveType: 'Remote',
    status: 'Approved',
    startDate: '2025-10-16',
    endDate: '2025-10-16',
    days: 1
  },
  {
    id: 'L3',
    userName: 'Marcus Aurelius',
    userRole: 'Senior Principal Engineer',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_PFfiI-e4FRBUJWRPVcndiaIw7xONCsVs2F5JkQjTBL7uppiMo2YQ0m5a8mPx8RSFW_IXPAisPj5XYRqnNPpeBYSg4WnTsTxgkjwgmHx0nLl7fRVYXfY9eyi7YFlznmYU6c1fjZctHrF0fgjfwMAOHCHgmJJtpeU5snf-3AdHfUnPvmlM9JgpUqu6C4KUu8QGjZNrPJrVTFZy9MG4_ZqP6eOvXbPQnRqMeJ9I1AeTRwuC7D4BhL360hqiFW_Vpgw57GI3yRmqXAc',
    leaveType: 'Personal',
    status: 'Pending',
    startDate: '2025-10-22',
    endDate: '2025-10-24',
    days: 3
  }
]

export const UserLeaveView: React.FC = () => {
  const dates = [
    { day: 'MON', date: '15', isToday: true },
    { day: 'TUE', date: '16' },
    { day: 'WED', date: '17' },
    { day: 'THU', date: '18' },
    { day: 'FRI', date: '19' },
    { day: 'SAT', date: '20', isWeekend: true },
    { day: 'SUN', date: '21', isWeekend: true },
    { day: 'MON', date: '22' },
    { day: 'TUE', date: '23' },
    { day: 'WED', date: '24' },
  ]

  const getLeaveColor = (type: string) => {
    switch (type) {
      case 'Annual': return 'bg-primary/20 text-primary border-primary/30'
      case 'Sick': return 'bg-error/20 text-error border-error/30'
      case 'Remote': return 'bg-secondary/20 text-secondary border-secondary/30'
      default: return 'bg-on-surface-variant/20 text-on-surface-variant border-on-surface-variant/30'
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'On Leave': return 'bg-secondary/10 text-secondary border-secondary/20'
      case 'Approved': return 'bg-primary/10 text-primary border-primary/20'
      case 'Pending': return 'bg-on-surface-variant/10 text-on-surface-variant border-outline-variant'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LeaveStatCard 
          title="Currently Away" 
          value={12} 
          description="Out of 1,482" 
          icon={Plane}
          variant="secondary"
        />
        <LeaveStatCard 
          title="Upcoming Next Week" 
          value={24} 
          description="Peak Season" 
          icon={Calendar}
        />
        <LeaveStatCard 
          title="Pending Requests" 
          value={8} 
          description="Action Required" 
          icon={MoreHorizontal}
          variant="neutral"
        />
      </div>

      <GlassCard className="p-0 overflow-hidden flex flex-col min-h-[400px]">
        <div className="flex border-b border-outline-variant/30 sticky top-0 bg-surface-container/60 backdrop-blur-md z-20">
          <div className="w-[300px] p-6 border-r border-outline-variant/30 flex items-center justify-between">
            <span className="text-label-caps font-bold text-on-surface-variant tracking-widest">Personnel Leave</span>
            <button className="text-primary hover:bg-primary/10 p-1 rounded transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex overflow-x-auto">
            {dates.map((d, i) => (
              <div 
                key={i} 
                className={cn(
                  "min-w-[80px] h-[72px] flex flex-col items-center justify-center border-r border-outline-variant/10",
                  d.isToday && "bg-primary-container/10 relative",
                  d.isWeekend && "bg-surface-container-low"
                )}
              >
                {d.isToday && <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>}
                <span className="text-[10px] font-bold text-on-surface-variant tracking-wider">{d.day}</span>
                <span className={cn("text-lg font-mono font-bold mt-0.5", d.isToday ? "text-primary" : "text-on-surface")}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {LEAVE_RECORDS.map((record) => (
            <div key={record.id} className="flex border-b border-outline-variant/10 hover:bg-interaction-hover transition-colors group">
              <div className="w-[300px] p-6 border-r border-outline-variant/30 shrink-0">
                <div className="flex items-center gap-3">
                  <img src={record.avatar} alt={record.userName} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                  <div className="min-w-0">
                    <p className="font-bold text-on-surface truncate">{record.userName}</p>
                    <p className="text-[10px] text-on-surface-variant truncate uppercase tracking-widest font-bold">{record.userRole}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded border",
                    getStatusStyles(record.status)
                  )}>
                    {record.status}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 flex overflow-x-auto relative min-h-[100px] items-center p-4">
                {/* Horizontal Bar */}
                <div 
                  className={cn(
                    "absolute h-12 rounded-xl border flex items-center px-4 transition-all duration-500 shadow-sm",
                    getLeaveColor(record.leaveType)
                  )}
                  style={{ 
                    left: `${(dates.findIndex(d => d.date === record.startDate.split('-')[2]) * 80) + 16}px`, 
                    width: `${record.days * 80 - 32}px` 
                  }}
                >
                  <div className="flex items-center gap-2">
                    {record.leaveType === 'Annual' ? <Plane className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                    <span className="text-[10px] font-bold tracking-widest uppercase truncate whitespace-nowrap">
                      {record.leaveType} • {record.days} DAYS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
