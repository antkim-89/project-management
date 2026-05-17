import { useState } from 'react'

interface UseKanbanDragDropProps {
  onUpdateStatus: (taskId: string, newStatus: string) => Promise<void>
}

export function useKanbanDragDrop({ onUpdateStatus }: UseKanbanDragDropProps) {
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null)
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingTaskId(taskId)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', taskId)
    }
  }

  const handleDragEnd = () => {
    setDraggingTaskId(null)
    setActiveColumnId(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnter = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setActiveColumnId(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // HTML5 drag leave event often fires on child elements,
    // so we handle column entry/exit via dragEnter of the next column
    // or resetting active states on dragEnd / drop.
  }

  const handleDrop = async (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (!draggingTaskId) return

    try {
      await onUpdateStatus(draggingTaskId, columnId)
    } catch (error) {
      console.error('Failed to update task status on drop:', error)
    } finally {
      setDraggingTaskId(null)
      setActiveColumnId(null)
    }
  }

  return {
    draggingTaskId,
    activeColumnId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  }
}
