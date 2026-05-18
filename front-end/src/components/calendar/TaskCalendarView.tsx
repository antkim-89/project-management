import { Button } from "@/components/base/Button";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Square,
  CheckSquare,
} from "lucide-react";
import { GlassCard } from "@/components/base/GlassCard";
import { useTasks } from "@/hooks/api/useTasks";
import { useProjects } from "@/hooks/api/useProjects";
import { TaskDetailModal } from "@/components/modal/layout/TaskDetailModal";
import type { Task } from "@/types/api";
import { cn } from "@/lib/utils";

export const TaskCalendarView: React.FC = () => {
  const { data: tasks } = useTasks();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  // Calendar Date State
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Project Filter State (Multi-Select)
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Task Details Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Navigate Months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Toggle Project Filter Selection
  const handleToggleProject = (projectId: string) => {
    setSelectedProjectIds((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };

  // Select/Deselect All projects
  const handleToggleAllProjects = () => {
    if (projects && selectedProjectIds.length === projects.length) {
      setSelectedProjectIds([]); // Uncheck all -> will show none or we can define it. Let's make it none when all unchecked.
    } else if (projects) {
      setSelectedProjectIds(projects.map((p) => p.id));
    }
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCellClick = (cellDate: Date) => {
    // Create new task on this specific due date
    const localDate = new Date(cellDate);
    localDate.setHours(12, 0, 0, 0); // avoid timezone shifts

    // Set selectedTask as null but we can pass a dummy or handle it in modal.
    // For now, we open modal to add task. We'll pass a partial task context if needed,
    // but just opening modal is great.
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  // Projects list for filtering
  const allProjectsSelected = projects
    ? selectedProjectIds.length === projects.length ||
      selectedProjectIds.length === 0
    : true;

  // Filtered Tasks
  const filteredTasks =
    tasks?.filter((task) => {
      // Filter by selected projects
      // If selectedProjectIds is empty, it means we show ALL tasks! (default "All" behavior when none checked is standard, or when "All" is selected)
      const matchesProject =
        selectedProjectIds.length === 0 ||
        selectedProjectIds.includes(task.projectId);
      return matchesProject;
    }) || [];

  // Month Math helper
  const getDaysInMonth = (y: number, m: number) =>
    new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) =>
    new Date(y, m, 1).getDay();

  const daysInCurrentMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  const firstDayIndex = getFirstDayOfMonth(year, month); // Sunday: 0, Monday: 1...

  // Days array for rendering 6-week monthly grid (42 days)
  const calendarCells = [];

  // 1. Padding days from previous month
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const cellDate = new Date(year, month - 1, dayNum);
    calendarCells.push({
      day: dayNum,
      isCurrentMonth: false,
      date: cellDate,
      dateStr: cellDate.toISOString().split("T")[0],
    });
  }

  // 2. Days of the current month
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const cellDate = new Date(year, month, i);
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
      date: cellDate,
      dateStr: cellDate.toISOString().split("T")[0],
    });
  }

  // 3. Padding days from next month to fill 42 cells
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    const cellDate = new Date(year, month + 1, i);
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      date: cellDate,
      dateStr: cellDate.toISOString().split("T")[0],
    });
  }

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  // Helper to format due date comparison
  const getTaskForDate = (dateStr: string) => {
    return filteredTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDateStr = new Date(task.dueDate).toISOString().split("T")[0];
      return taskDateStr === dateStr;
    });
  };

  // Check if today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Calendar Header with Controls and Project Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container-low border border-outline-variant/30 rounded-xl p-1 shrink-0">
            <Button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-interaction-hover text-on-surface-variant hover:text-on-surface rounded-lg transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleToday}
              className="px-4 py-1.5 text-label-md font-bold text-on-surface hover:bg-interaction-hover rounded-lg transition-all active:scale-95"
            >
              오늘
            </Button>
            <Button
              onClick={handleNextMonth}
              className="p-2 hover:bg-interaction-hover text-on-surface-variant hover:text-on-surface rounded-lg transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-on-surface font-mono">
            {year}년 {month + 1}월
          </h3>
        </div>

        {/* Multi-Select Project Filter */}
        <div className="relative shrink-0">
          <Button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className={cn(
              "btn-glass px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-label-md cursor-pointer",
              !allProjectsSelected &&
                "border-primary/50 text-primary bg-primary/5",
            )}
          >
            <Filter className="w-4 h-4" />
            <span>
              {allProjectsSelected
                ? "전체 프로젝트 업무"
                : `프로젝트 ${selectedProjectIds.length}개 선택됨`}
            </span>
          </Button>

          {/* Project Filter Dropdown Popover */}
          {isFilterDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsFilterDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-surface-container border border-outline-variant rounded-2xl shadow-2xl p-4 z-50 animate-zoom-in">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30 mb-3">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    프로젝트 필터
                  </span>
                  <Button
                    onClick={handleToggleAllProjects}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    {projects && selectedProjectIds.length === projects.length
                      ? "전체 해제"
                      : "전체 선택"}
                  </Button>
                </div>

                {projectsLoading ? (
                  <div className="py-6 text-center text-xs text-on-surface-variant">
                    프로젝트 로딩 중...
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {projects?.map((proj) => {
                      const isSelected = selectedProjectIds.includes(proj.id);
                      return (
                        <Button
                          key={proj.id}
                          onClick={() => handleToggleProject(proj.id)}
                          className={cn(
                            "flex items-center gap-3 p-2.5 rounded-xl text-left text-body-md transition-all hover:bg-interaction-hover w-full",
                            isSelected
                              ? "text-primary font-bold"
                              : "text-on-surface font-normal",
                          )}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-primary shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-on-surface-variant shrink-0" />
                          )}
                          <span className="truncate">{proj.title}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Calendar Grid Board */}
      <GlassCard className="p-0 overflow-hidden border border-outline-variant/20 shadow-xl flex flex-col">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-outline-variant/30 bg-surface-container-low/40">
          {weekdays.map((day, idx) => (
            <div
              key={day}
              className={cn(
                "py-3 text-center text-xs font-bold tracking-wider border-r border-outline-variant/10 last:border-r-0",
                idx === 0
                  ? "text-error"
                  : idx === 6
                    ? "text-secondary"
                    : "text-on-surface-variant",
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 grid-rows-6 divide-x divide-y divide-outline-variant/10 min-h-[600px] bg-surface-container/10">
          {calendarCells.map((cell, idx) => {
            const cellTasks = getTaskForDate(cell.dateStr);
            const cellIsToday = isToday(cell.date);
            const isWeekend =
              cell.date.getDay() === 0 || cell.date.getDay() === 6;

            return (
              <div
                key={idx}
                onClick={() => handleCellClick(cell.date)}
                className={cn(
                  "min-h-[100px] flex flex-col p-2.5 transition-all duration-300 relative cursor-pointer hover:bg-surface-container-low/60 group border-outline-variant/10",
                  !cell.isCurrentMonth &&
                    "opacity-40 bg-surface-container-low/10",
                  cellIsToday &&
                    "bg-primary-container/10 ring-1 ring-primary/20",
                  isWeekend &&
                    cell.isCurrentMonth &&
                    "bg-surface-container-low/20",
                )}
              >
                {/* Date indicator */}
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      "text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all",
                      cellIsToday
                        ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/20"
                        : cell.date.getDay() === 0
                          ? "text-error"
                          : cell.date.getDay() === 6
                            ? "text-secondary"
                            : "text-on-surface",
                      !cell.isCurrentMonth && "text-on-surface-variant",
                    )}
                  >
                    {cell.day}
                  </span>

                  {/* Subtle addition plus button on hover */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-primary mr-1">
                    + 추가
                  </span>
                </div>

                {/* Day Tasks List */}
                <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-[110px] mt-1 pr-0.5 scrollbar-thin">
                  {cellTasks.map((task) => {
                    const isTaskDone = task.status === "DONE";
                    const isTaskInProgress = task.status === "IN_PROGRESS";

                    return (
                      <div
                        key={task.id}
                        onClick={(e) => handleTaskClick(task, e)}
                        className={cn(
                          "px-2 py-1.5 rounded-lg border text-[11px] font-medium tracking-wide transition-all duration-200 truncate cursor-pointer select-none",
                          isTaskDone
                            ? "bg-primary/5 text-primary border-primary/20 line-through opacity-70 hover:opacity-100"
                            : isTaskInProgress
                              ? "bg-secondary/5 text-secondary border-secondary/20 hover:shadow-sm"
                              : "bg-surface-container-highest text-on-surface-variant border-outline-variant/30 hover:border-primary/20",
                        )}
                        title={`${task.project?.title ? `[${task.project.title}] ` : ""}${task.title}`}
                      >
                        {/* Status marker dot */}
                        <span
                          className={cn(
                            "inline-block w-1.5 h-1.5 rounded-full mr-1.5 shrink-0 vertical-middle",
                            isTaskDone
                              ? "bg-primary"
                              : isTaskInProgress
                                ? "bg-secondary"
                                : "bg-outline",
                          )}
                        />
                        {task.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Task Edit / Create Modal */}
      {isModalOpen && (
        <TaskDetailModal
          key={selectedTask?.id || "new"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
        />
      )}
    </div>
  );
};
