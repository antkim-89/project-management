import { Button } from "@/components/base/Button";
import { useState } from "react";
import { User as UserIcon, Folder, AlertCircle, Trash2 } from "lucide-react";
import { BaseModal } from "@/components/base/BaseModal";
import { useProjects } from "@/hooks/api/useProjects";
import { useUsers } from "@/hooks/api/useUsers";
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/api/useTasks";
import type { Task } from "@/types/api";
import { cn } from "@/lib/utils";
import { CalendarPicker } from "@/components/base/CalendarPicker";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  task,
}: TaskDetailModalProps) {
  const isEditMode = !!task;

  // API hooks
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: users, isLoading: usersLoading } = useUsers();

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Form states
  const [title, setTitle] = useState(task ? task.title : "");
  const [description, setDescription] = useState(
    task ? task.description || "" : "",
  );
  const [projectId, setProjectId] = useState(
    task ? task.projectId : projects?.[0]?.id || "",
  );
  const [userId, setUserId] = useState<string | null>(
    task ? task.userId || null : null,
  );
  const [status, setStatus] = useState(task ? task.status : "TODO");
  const [dueDate, setDueDate] = useState(() => {
    if (task && task.dueDate) {
      const dateObj = new Date(task.dueDate);
      return dateObj.toISOString().split("T")[0];
    }
    // Set today's date + 3 days as default
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    return defaultDate.toISOString().split("T")[0];
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Automatically select first project if loaded and nothing selected
  if (!task && !projectId && projects && projects.length > 0) {
    setProjectId(projects[0].id);
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "업무 제목을 입력해주세요.";
    if (!projectId) newErrors.projectId = "프로젝트를 선택해주세요.";
    if (!dueDate) newErrors.dueDate = "마감일을 선택해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      title,
      description: description || null,
      status,
      projectId,
      userId: userId || null,
      dueDate: new Date(dueDate).toISOString(),
    };

    try {
      if (isEditMode && task) {
        await updateTaskMutation.mutateAsync({
          id: task.id,
          updatedFields: payload,
        });
      } else {
        await createTaskMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    if (window.confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
        onClose();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const footer = (
    <div className="flex items-center justify-between w-full">
      <div>
        {isEditMode && (
          <Button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-error hover:bg-error/10 active:scale-95 transition-all rounded-xl font-bold text-label-md"
            disabled={deleteTaskMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            삭제하기
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="glass"
          onClick={onClose}
          className=" px-5 h-10 rounded-xl"
        >
          취소
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          className=" px-6 h-10 rounded-xl"
          disabled={
            createTaskMutation.isPending || updateTaskMutation.isPending
          }
        >
          {isEditMode ? "저장 완료" : "추가하기"}
        </Button>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "할 일 상세 편집" : "새 할 일 추가"}
      footer={footer}
      size="md"
    >
      <div className="flex flex-col gap-6">
        {/* Title Input */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            업무 제목 <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 디자인 시스템 변경 기획"
            className={cn(
              "w-full bg-surface-container-low border text-on-surface rounded-xl px-4 py-3 outline-none transition-all text-body-md focus:border-primary",
              errors.title ? "border-error" : "border-outline-variant/30",
            )}
          />
          {errors.title && (
            <p className="text-error text-label-sm mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            상세 내용
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="업무 세부 내용이나 특이 사항을 적어주세요."
            rows={3}
            className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 outline-none transition-all text-body-md focus:border-primary resize-none"
          />
        </div>

        {/* 2-Column Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              연동 프로젝트 <span className="text-error">*</span>
            </label>
            <div className="relative flex items-center">
              <Folder className="absolute left-4 w-4 h-4 text-on-surface-variant" />
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl pl-11 pr-4 py-3 outline-none transition-all text-body-md focus:border-primary appearance-none cursor-pointer"
                disabled={projectsLoading}
              >
                {projectsLoading ? (
                  <option>로딩 중...</option>
                ) : (
                  projects?.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title}
                    </option>
                  ))
                )}
              </select>
            </div>
            {errors.projectId && (
              <p className="text-error text-label-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.projectId}
              </p>
            )}
          </div>

          {/* Assignee dropdown */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              담당자 지정
            </label>
            <div className="relative flex items-center">
              <UserIcon className="absolute left-4 w-4 h-4 text-on-surface-variant" />
              <select
                value={userId || ""}
                onChange={(e) => setUserId(e.target.value || null)}
                className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl pl-11 pr-4 py-3 outline-none transition-all text-body-md focus:border-primary appearance-none cursor-pointer"
                disabled={usersLoading}
              >
                <option value="">미지정</option>
                {usersLoading ? (
                  <option>로딩 중...</option>
                ) : (
                  users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Due Date & Status Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Due date picker */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              마감일 (Due Date) <span className="text-error">*</span>
            </label>
            <CalendarPicker
              value={dueDate}
              onChange={(date) => setDueDate(date)}
              error={errors.dueDate}
            />
            {errors.dueDate && (
              <p className="text-error text-label-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.dueDate}
              </p>
            )}
          </div>

          {/* Status selector */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              진행 상태
            </label>
            <div className="flex bg-surface-container-low border border-outline-variant/30 rounded-xl p-1 w-full justify-between gap-1">
              {[
                {
                  label: "할 일",
                  value: "TODO",
                  color: "text-on-surface-variant",
                },
                {
                  label: "진행 중",
                  value: "IN_PROGRESS",
                  color: "text-secondary",
                },
                { label: "완료", value: "DONE", color: "text-primary" },
              ].map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  onClick={() => setStatus(item.value)}
                  className={cn(
                    "flex-1 py-2 text-label-md font-bold rounded-lg transition-all active:scale-95",
                    status === item.value
                      ? "bg-surface-container-highest text-on-surface shadow-md"
                      : "text-on-surface-variant/75 hover:text-on-surface",
                  )}
                >
                  <span className={cn(status === item.value && item.color)}>
                    {item.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
