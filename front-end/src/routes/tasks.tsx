import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, User, Clock, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react'
import { GlassCard } from '@/components/base/GlassCard'
import { TaskDetailModal } from '@/components/modal/layout/TaskDetailModal'
import { useTasks, useUpdateTask } from '@/hooks/api/useTasks'
import type { Task } from '@/types/api'
import { cn } from '@/lib/utils'
import { useKanbanDragDrop } from '@/hooks/useKanbanDragDrop'

export const Route = createFileRoute('/tasks')({
  component: Tasks,
})

function Tasks() {
  const { data: tasks, isLoading, error } = useTasks()
  const updateTaskMutation = useUpdateTask()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        updatedFields: { status: newStatus as 'TODO' | 'IN_PROGRESS' | 'DONE' },
      })
    } catch (err) {
      console.error('Failed to update task status on drop:', err)
    }
  }

  const {
    draggingTaskId,
    activeColumnId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDrop,
  } = useKanbanDragDrop({ onUpdateStatus: handleUpdateStatus })

  const handleAddTaskClick = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  // Quick action to move task status
  const handleMoveStatus = async (task: Task, direction: 'next' | 'prev', e: React.MouseEvent) => {
    e.stopPropagation() // Prevent modal from opening
    const statuses = ['TODO', 'IN_PROGRESS', 'DONE']
    const currentIndex = statuses.indexOf(task.status)
    let nextIndex = currentIndex

    if (direction === 'next' && currentIndex < 2) {
      nextIndex = currentIndex + 1
    } else if (direction === 'prev' && currentIndex > 0) {
      nextIndex = currentIndex - 1
    }

    if (nextIndex !== currentIndex) {
      try {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          updatedFields: { status: statuses[nextIndex] },
        })
      } catch (err) {
        console.error('Failed to update task status:', err)
      }
    }
  }

  if (isLoading) return <div className="p-6 text-on-surface">Loading Tasks Kanban Board...</div>
  if (error) return <div className="p-6 text-error">Error loading tasks from server.</div>

  // Categorize tasks by status
  const todoTasks = tasks?.filter((t) => t.status === 'TODO') || []
  const inProgressTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS') || []
  const doneTasks = tasks?.filter((t) => t.status === 'DONE') || []

  // Check if date is overdue
  const isOverdue = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  const columns = [
    {
      id: 'TODO',
      title: '할 일',
      tasks: todoTasks,
      headerBg: 'bg-outline-variant/10 text-on-surface-variant border-outline-variant/20',
      badgeColor: 'bg-outline-variant/20 text-on-surface',
      columnColor: 'bg-surface-container-low/40',
    },
    {
      id: 'IN_PROGRESS',
      title: '진행 중',
      tasks: inProgressTasks,
      headerBg: 'bg-secondary/15 text-secondary border-secondary/20',
      badgeColor: 'bg-secondary/20 text-secondary',
      columnColor: 'bg-secondary/5',
    },
    {
      id: 'DONE',
      title: '완료',
      tasks: doneTasks,
      headerBg: 'bg-primary/15 text-primary border-primary/20',
      badgeColor: 'bg-primary/20 text-primary',
      columnColor: 'bg-primary/5',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in flex flex-col h-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 shrink-0">
        <div>
          <h1 className="font-bold text-display-lg text-on-surface mb-1">업무 관리</h1>
          <p className="text-on-surface-variant text-body-md">칸반보드를 통해 업무 상태를 직관적으로 파악하고 효율적으로 조율하세요.</p>
        </div>
        <button 
          onClick={handleAddTaskClick}
          className="btn-primary px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" /> 할 일 추가
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start min-h-0">
        {columns.map((column) => (
          <div 
            key={column.id} 
            className={cn(
              "rounded-2xl border border-outline-variant/20 flex flex-col max-h-[calc(100vh-14rem)] shadow-sm overflow-hidden",
              column.columnColor
            )}
          >
            {/* Column Header */}
            <div className={cn("px-4 py-3.5 border-b flex items-center justify-between font-bold", column.headerBg)}>
              <span className="text-title-md">{column.title}</span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-mono font-bold", column.badgeColor)}>
                {column.tasks.length}
              </span>
            </div>

            {/* Task Card List */}
            <div 
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
              className={cn(
                "flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[300px] transition-all duration-300 rounded-b-2xl",
                activeColumnId === column.id 
                  ? "bg-primary/5 border-2 border-dashed border-primary/30 -m-px rounded-b-2xl shadow-inner scale-[0.99] origin-top" 
                  : ""
              )}
            >
              {column.tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-on-surface-variant/40 border border-dashed border-outline-variant/20 rounded-xl">
                  <p className="text-label-md">이 컬럼에 업무가 없습니다.</p>
                </div>
              ) : (
                column.tasks.map((task) => {
                  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'
                  const isDraggingThis = draggingTaskId === task.id
                  return (
                    <GlassCard
                      key={task.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleTaskClick(task)}
                      className={cn(
                        "p-4 hover:shadow-lg border-outline-variant/30 hover:border-primary/30 transition-all duration-300 relative group flex flex-col gap-3.5 select-none",
                        isDraggingThis 
                          ? "opacity-30 border-dashed border-primary scale-[0.98] cursor-grabbing" 
                          : "cursor-grab active:cursor-grabbing"
                      )}
                    >
                      {/* Project Tag */}
                      <div className="flex items-center justify-between">
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded border border-primary/20 max-w-[150px] truncate">
                          {task.project?.title || '연동 없음'}
                        </span>
                        
                        {/* Status Quick Controller for better interactivity */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-surface-container-highest border border-outline-variant/45 rounded-lg overflow-hidden shrink-0">
                          {column.id !== 'TODO' && (
                            <button
                              onClick={(e) => handleMoveStatus(task, 'prev', e)}
                              title="이전 단계로 이동"
                              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-interaction-hover transition-colors"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {column.id !== 'DONE' && (
                            <button
                              onClick={(e) => handleMoveStatus(task, 'next', e)}
                              title="다음 단계로 이동"
                              className="p-1 text-on-surface-variant hover:text-on-surface hover:bg-interaction-hover transition-colors"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-bold text-body-md text-on-surface mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-on-surface-variant text-label-md line-clamp-2 font-light">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Footer: Due date & Assignee */}
                      <div className="flex items-center justify-between mt-1 pt-3 border-t border-outline-variant/10 text-label-md text-on-surface-variant font-light shrink-0">
                        {/* Due Date */}
                        <div className={cn(
                          "flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium",
                          overdue 
                            ? "bg-error/15 text-error border border-error/25 animate-pulse" 
                            : "bg-surface-container-highest/50 text-on-surface-variant"
                        )}>
                          {overdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                          <span>{formatDate(task.dueDate)}</span>
                        </div>

                        {/* Assignee */}
                        <div className="flex items-center gap-1.5">
                          {task.user ? (
                            <>
                              {task.user.avatarUrl ? (
                                <img
                                  src={task.user.avatarUrl}
                                  alt={task.user.name}
                                  className="w-5 h-5 rounded-full object-cover border border-outline-variant/20 shadow-sm"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-[9px] font-bold">
                                  {task.user.name.charAt(0)}
                                </div>
                              )}
                              <span className="text-xs font-medium text-on-surface">{task.user.name}</span>
                            </>
                          ) : (
                            <span className="text-xs italic text-on-surface-variant/40 flex items-center gap-1">
                              <User className="w-3 h-3" /> 미지정
                            </span>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  )
                })
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Edit / Create Modal */}
      {isModalOpen && (
        <TaskDetailModal 
          key={selectedTask?.id || 'new'}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
        />
      )}
    </div>
  )
}
