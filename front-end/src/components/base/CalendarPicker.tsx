import { useState, useRef } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useClickOutside } from '@/hooks/useClickOutside'
import { cn } from '@/lib/utils'

interface CalendarPickerProps {
  value: string // YYYY-MM-DD
  onChange: (date: string) => void
  error?: string
}

export function CalendarPicker({ value, onChange, error }: CalendarPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Parse initial selected date or default to today
  const selectedDate = value ? new Date(value) : null
  
  // Track currently viewed month/year in picker
  const [currentDate, setCurrentDate] = useState(() => {
    return selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date()
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Close calendar popover on click outside
  useClickOutside(containerRef, () => setIsOpen(false), triggerRef)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Helper to generate days in month
  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate()
  }

  // Helper to get first day index of the month (0 = Sunday, ..., 6 = Saturday)
  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayIndex = getFirstDayOfMonth(year, month)

  // Previous month days to fill empty spots before 1st
  const prevMonthDays = getDaysInMonth(year, month - 1)

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDateSelect = (day: number, isCurrentMonth: 'current' | 'prev' | 'next') => {
    let targetYear = year
    let targetMonth = month

    if (isCurrentMonth === 'prev') {
      targetMonth = month - 1
      if (targetMonth < 0) {
        targetMonth = 11
        targetYear -= 1
      }
    } else if (isCurrentMonth === 'next') {
      targetMonth = month + 1
      if (targetMonth > 11) {
        targetMonth = 0
        targetYear += 1
      }
    }

    const formattedDate = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(formattedDate)
    setIsOpen(false)
  }

  // Generate calendar grid array
  const calendarCells = []

  // Fill in empty cells with previous month's trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      type: 'prev' as const,
    })
  }

  // Fill in active month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      type: 'current' as const,
    })
  }

  // Fill remaining cells with next month's starting days to complete the 6-row layout (42 cells)
  const totalCells = 42
  const nextMonthFill = totalCells - calendarCells.length
  for (let i = 1; i <= nextMonthFill; i++) {
    calendarCells.push({
      day: i,
      type: 'next' as const,
    })
  }

  // Days of the week header
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']

  const isSelected = (day: number, type: 'current' | 'prev' | 'next') => {
    if (!selectedDate || type !== 'current') return false
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    )
  }

  const isToday = (day: number, type: 'current' | 'prev' | 'next') => {
    if (type !== 'current') return false
    const today = new Date()
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )
  }

  return (
    <div className="relative w-full">
      {/* Date Input Field Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center font-mono cursor-pointer w-full bg-surface-container-low border text-on-surface rounded-xl pl-11 pr-4 py-3 outline-none transition-all text-body-md select-none",
          isOpen ? "border-primary ring-1 ring-primary" : "border-outline-variant/30",
          error ? "border-error" : ""
        )}
      >
        <CalendarIcon className="absolute left-4 w-4 h-4 text-on-surface-variant pointer-events-none" />
        <span>{value || '날짜 선택'}</span>
      </div>

      {/* Calendar Popover */}
      {isOpen && (
        <div
          ref={containerRef}
          className="absolute z-9999 bottom-full mb-2 left-0 w-80 bg-surface-container-high/95 backdrop-blur-md border border-outline-variant/35 rounded-2xl p-4 shadow-2xl animate-fade-in flex flex-col gap-4 select-none"
        >
          {/* Header: Month & Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-interaction-hover text-on-surface transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h4 className="font-bold text-title-sm text-on-surface">
              {year}년 {month + 1}월
            </h4>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-interaction-hover text-on-surface transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-on-surface-variant mb-1">
            {weekDays.map((wd, index) => (
              <span 
                key={wd} 
                className={cn(
                  index === 0 ? "text-error" : "", 
                  index === 6 ? "text-primary" : ""
                )}
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-body-sm">
            {calendarCells.map((cell, index) => {
              const dayOfWeek = index % 7
              const active = isSelected(cell.day, cell.type)
              const today = isToday(cell.day, cell.type)
              const isOtherMonth = cell.type !== 'current'

              return (
                <button
                  key={`${cell.type}-${cell.day}-${index}`}
                  type="button"
                  onClick={() => handleDateSelect(cell.day, cell.type)}
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all relative active:scale-90 hover:scale-105",
                    isOtherMonth 
                      ? "text-on-surface-variant/20 hover:bg-interaction-hover/40" 
                      : "text-on-surface hover:bg-interaction-hover",
                    dayOfWeek === 0 && !isOtherMonth && !active ? "text-error" : "",
                    dayOfWeek === 6 && !isOtherMonth && !active ? "text-primary" : "",
                    today && !active ? "border border-primary text-primary" : "",
                    active ? "bg-primary text-on-primary hover:bg-primary/95 shadow-md shadow-primary/20 scale-105" : ""
                  )}
                >
                  {cell.day}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
