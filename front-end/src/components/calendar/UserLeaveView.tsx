import React, { useState, useMemo } from "react";
import { Plane, Home, Calendar, Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";
import { LeaveStatCard } from "./LeaveStatCard";
import { Button } from "@/components/base/Button";
import { BaseModal } from "@/components/base/BaseModal";
import { Select } from "@/components/base/Select";
import { CalendarPicker } from "@/components/base/CalendarPicker";
import { useLeaveRequests, useCreateLeaveRequest } from "@/hooks/api/useLeaveRequests";
import { useUsers } from "@/hooks/api/useUsers";

interface LeaveRecord {
  id: string;
  userName: string;
  userRole: string;
  avatar: string;
  leaveType: "Annual" | "Sick" | "Personal" | "Remote";
  status: "Approved" | "Pending" | "On Leave";
  startDate: string;
  endDate: string;
  days: number;
  rawStartDate: Date;
  rawEndDate: Date;
}

export const UserLeaveView: React.FC = () => {
  const { data: requests, isLoading, error } = useLeaveRequests();
  const { data: users } = useUsers();
  const createMutation = useCreateLeaveRequest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    leaveType: "Annual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // 오늘 기준으로 10일간의 날짜 동적 생성
  const dates = useMemo(() => {
    const arr = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      arr.push({
        day: dayNames[d.getDay()],
        date: String(d.getDate()),
        isToday: i === 0,
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        fullDateStr: d.toISOString().split("T")[0],
        rawDate: d,
      });
    }
    return arr;
  }, []);

  const leaveRecords = useMemo<LeaveRecord[]>(() => {
    return (
      requests?.map((r) => {
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const typeVal = r.type;
        const leaveType = (
          ["Annual", "Sick", "Personal", "Remote"].includes(typeVal)
            ? typeVal
            : "Annual"
        ) as "Annual" | "Sick" | "Personal" | "Remote";

        const statusVal = r.status.toUpperCase();
        let finalStatus: "Approved" | "Pending" | "On Leave" = "Pending";
        if (statusVal === "APPROVED") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (today >= start && today <= end) {
            finalStatus = "On Leave";
          } else {
            finalStatus = "Approved";
          }
        } else if (statusVal === "PENDING") {
          finalStatus = "Pending";
        }

        return {
          id: r.id,
          userName: r.user?.name || "Unknown",
          userRole: r.user?.rank?.name || "Member",
          avatar: r.user?.avatarUrl || "",
          leaveType,
          status: finalStatus,
          startDate: r.startDate.split("T")[0],
          endDate: r.endDate.split("T")[0],
          days,
          rawStartDate: start,
          rawEndDate: end,
        };
      }) || []
    );
  }, [requests]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    let currentlyAway = 0;
    let upcomingNextWeek = 0;
    let pendingRequests = 0;

    requests?.forEach((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      const statusVal = r.status.toUpperCase();

      if (statusVal === "APPROVED") {
        if (today >= start && today <= end) {
          currentlyAway += 1;
        } else if (start > today && start <= nextWeek) {
          upcomingNextWeek += 1;
        }
      } else if (statusVal === "PENDING") {
        pendingRequests += 1;
      }
    });

    return {
      currentlyAway,
      upcomingNextWeek,
      pendingRequests,
    };
  }, [requests]);

  const getBarProps = (record: LeaveRecord) => {
    const start = record.rawStartDate;
    const end = record.rawEndDate;

    const timelineStart = dates[0].rawDate;
    const timelineEnd = dates[dates.length - 1].rawDate;

    if (end < timelineStart || start > timelineEnd) {
      return {
        left: 0,
        width: 0,
        visible: false,
      };
    }

    const effectiveStart = start < timelineStart ? timelineStart : start;
    const effectiveEnd = end > timelineEnd ? timelineEnd : end;

    const leftDays = Math.round(
      (effectiveStart.getTime() - timelineStart.getTime()) /
        (24 * 60 * 60 * 1000)
    );

    const activeDays =
      Math.round(
        (effectiveEnd.getTime() - effectiveStart.getTime()) /
          (24 * 60 * 60 * 1000)
      ) + 1;

    return {
      left: leftDays * 80,
      width: activeDays * 80 - 32,
      visible: true,
    };
  };

  const getLeaveColor = (type: string) => {
    switch (type) {
      case "Annual":
        return "bg-primary/20 text-primary border-primary/30";
      case "Sick":
        return "bg-error/20 text-error border-error/30";
      case "Remote":
        return "bg-secondary/20 text-secondary border-secondary/30";
      default:
        return "bg-on-surface-variant/20 text-on-surface-variant border-on-surface-variant/30";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "On Leave":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "Approved":
        return "bg-primary/10 text-primary border-primary/20";
      case "Pending":
        return "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant";
      default:
        return "";
    }
  };

  const handleCreateLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId || !form.startDate || !form.endDate || !form.leaveType) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        userId: form.userId,
        startDate: form.startDate,
        endDate: form.endDate,
        type: form.leaveType,
        reason: form.reason,
        status: "PENDING",
      });
      setIsModalOpen(false);
      setForm({
        userId: "",
        leaveType: "Annual",
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (err) {
      alert("휴가 신청에 실패했습니다.");
    }
  };

  const userOptions = useMemo(() => {
    return users?.map((u) => ({ value: u.id, label: `${u.name} (${u.rank?.name || "Member"})` })) || [];
  }, [users]);

  const leaveTypeOptions = [
    { value: "Annual", label: "Annual (연차)" },
    { value: "Sick", label: "Sick (병가)" },
    { value: "Personal", label: "Personal (개인 용무)" },
    { value: "Remote", label: "Remote (원격 근무)" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-on-surface-variant animate-fade-in">
        Loading leave data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-12 text-error animate-fade-in">
        Error loading leave requests.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
        <LeaveStatCard
          title="Currently Away"
          value={stats.currentlyAway}
          description="Out of active members"
          icon={Plane}
          variant="secondary"
        />
        <LeaveStatCard
          title="Upcoming Next Week"
          value={stats.upcomingNextWeek}
          description="Next 7 days approved"
          icon={Calendar}
        />
        <LeaveStatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          description="Action Required"
          icon={MoreHorizontal}
          variant="neutral"
        />
      </div>

      <GlassCard className="p-0 overflow-hidden flex flex-col min-h-[400px] animate-fade-in">
        <div className="flex border-b border-outline-variant/30 sticky top-0 bg-surface-container/60 backdrop-blur-md z-[10]">
          <div className="w-[300px] p-6 border-r border-outline-variant/30 flex items-center justify-between">
            <span className="text-label-caps font-bold text-on-surface-variant tracking-widest">
              Personnel Leave
            </span>
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10 p-1 rounded transition-colors w-8 h-8 flex items-center justify-center cursor-pointer"
              prefixIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div className="flex-1 flex overflow-x-auto">
            {dates.map((d, i) => (
              <div
                key={i}
                className={cn(
                  "min-w-[80px] h-[72px] flex flex-col items-center justify-center border-r border-outline-variant/10",
                  d.isToday && "bg-primary-container/10 relative",
                  d.isWeekend && "bg-surface-container-low",
                )}
              >
                {d.isToday && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                )}
                <span className="text-[10px] font-bold text-on-surface-variant tracking-wider">
                  {d.day}
                </span>
                <span
                  className={cn(
                    "text-lg font-mono font-bold mt-0.5",
                    d.isToday ? "text-primary" : "text-on-surface",
                  )}
                >
                  {d.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {leaveRecords.map((record) => {
            const barProps = getBarProps(record);
            if (!barProps.visible) return null;

            return (
              <div
                key={record.id}
                className="flex border-b border-outline-variant/10 hover:bg-interaction-hover transition-colors group"
              >
                <div className="w-[300px] p-6 border-r border-outline-variant/30 shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={record.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                      alt={record.userName}
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-on-surface truncate">
                        {record.userName}
                      </p>
                      <p className="text-[10px] text-on-surface-variant truncate uppercase tracking-widest font-bold">
                        {record.userRole}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded border",
                        getStatusStyles(record.status),
                      )}
                    >
                      {record.status}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex overflow-x-auto relative min-h-[100px] items-center p-4">
                  {/* Horizontal Bar */}
                  <div
                    className={cn(
                      "absolute h-12 rounded-xl border flex items-center px-4 transition-all duration-500 shadow-sm",
                      getLeaveColor(record.leaveType),
                    )}
                    style={{
                      left: `${barProps.left + 16}px`,
                      width: `${barProps.width}px`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {record.leaveType === "Annual" ? (
                        <Plane className="w-3 h-3" />
                      ) : (
                        <Home className="w-3 h-3" />
                      )}
                      <span className="text-[10px] font-bold tracking-widest uppercase truncate whitespace-nowrap">
                        {record.leaveType} • {record.days} DAYS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {leaveRecords.filter(r => getBarProps(r).visible).length === 0 && (
            <div className="p-12 text-center text-on-surface-variant/40">
              현재 10일간의 일정 영역 내에 휴가 중인 인원이 없습니다.
            </div>
          )}
        </div>
      </GlassCard>

      {/* New Leave Request Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Request Leave (휴가 신청)"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="glass" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateLeave}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateLeave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Employee (신청 직원)
            </label>
            <Select
              options={userOptions}
              value={form.userId}
              onChange={(val) => setForm(f => ({ ...f, userId: val }))}
              placeholder="직원을 선택하세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Leave Type (휴가 구분)
            </label>
            <Select
              options={leaveTypeOptions}
              value={form.leaveType}
              onChange={(val) => setForm(f => ({ ...f, leaveType: val }))}
              placeholder="휴가 구분을 선택하세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Duration (기간 선택)
            </label>
            <CalendarPicker
              mode="range"
              rangeValue={{ startDate: form.startDate, endDate: form.endDate }}
              onRangeChange={(range) =>
                setForm((f) => ({
                  ...f,
                  startDate: range.startDate,
                  endDate: range.endDate || range.startDate,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Reason (사유)
            </label>
            <textarea
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="휴가 사유를 입력해 주세요 (선택 사항)"
              value={form.reason}
              onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))}
            />
          </div>
        </form>
      </BaseModal>
    </div>
  );
};
