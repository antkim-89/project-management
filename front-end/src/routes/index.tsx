import { Button } from "@/components/base/Button";
import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  Package,
  DollarSign,
  Calendar,
  Clock,
  MoreHorizontal,
  Sun,
  FolderKanban,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import {
  StatCard,
  MetricItem,
  MilestoneItem,
  TaskItem,
  ProgressItem,
  AreaChart,
  CircularProgressChart,
} from "@/components/dashboard";
import { useProjects } from "@/hooks/api/useProjects";
import { useUsers } from "@/hooks/api/useUsers";
import { useEquipment } from "@/hooks/api/useEquipment";
import { useLeaveRequests } from "@/hooks/api/useLeaveRequests";
import { useTasks } from "@/hooks/api/useTasks";
import { useMemo } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const { data: projects } = useProjects();
  const { data: users } = useUsers();
  const { data: equipment } = useEquipment();
  const { data: leaveRequests } = useLeaveRequests();
  const { data: tasks } = useTasks();

  const activeProjectsCount = projects?.length || 0;
  const totalPersonnel = users?.length || 0;
  const totalBudget = projects?.reduce((acc, p) => acc + p.budget, 0) || 0;
  const monthlyCost = totalBudget / 12;

  // 프로젝트별 진행률 상위 3개 계산
  const topProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects]
      .slice(0, 3)
      .map((p) => {
        const start = new Date(p.startDate).getTime();
        const end = new Date(p.endDate).getTime();
        const now = new Date().getTime();
        let progress = 0;
        if (end > start) {
          progress = Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
        } else if (now >= start) {
          progress = 100;
        }

        let color = "bg-primary";
        if (progress >= 80) {
          color = "bg-emerald-400";
        } else if (progress < 40) {
          color = "bg-rose-400";
        }

        return {
          name: p.title,
          percent: progress,
          color,
        };
      });
  }, [projects]);

  // 대기 중인 승인 요청 및 간편 할 일 목록 생성
  const quickTasks = useMemo(() => {
    const list: { id: string; icon: React.ReactNode; name: string; desc: string }[] = [];

    // 1. 대기 중인 휴가 신청
    const pendingLeaves = leaveRequests?.filter(r => r.status.toUpperCase() === "PENDING") || [];
    pendingLeaves.forEach((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      list.push({
        id: `leave-${r.id}`,
        icon: <Users className="w-5 h-5 text-emerald-400" />,
        name: `Leave Request: ${r.user?.name || "Unknown"}`,
        desc: `${r.type} Leave • ${days} Days • Pending Approval`,
      });
    });

    // 2. 미완료 태스크
    const activeTasks = tasks?.filter(t => t.status === "TODO" || t.status === "IN_PROGRESS") || [];
    activeTasks.slice(0, 3).forEach((t) => {
      list.push({
        id: `task-${t.id}`,
        icon: <FolderKanban className="w-5 h-5 text-primary" />,
        name: `Task: ${t.title}`,
        desc: `Project: ${t.project?.title || "None"} • Due: ${t.dueDate ? t.dueDate.split("T")[0] : "No date"}`,
      });
    });

    return list.slice(0, 4); // 최대 4개 노출
  }, [leaveRequests, tasks]);

  return (
    <div className="p-6 space-y-6 bg-background min-h-full overflow-y-auto animate-fade-in">
      <Breadcrumbs items={[]} />

      {/* Title & Quick Stats Hero */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-display-lg font-bold tracking-tight text-on-surface">
            {t("common.overview")}
          </h2>
          <p className="text-on-surface-variant text-body-md mt-1">
            Monitor key metrics and manage your platform operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            prefixIcon={<Calendar className="w-4 h-4" />}
            variant="outline"
            className="rounded text-label-md font-medium text-on-surface"
          >
            This Month
          </Button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main KPI Card */}
        <GlassCard className="col-span-full lg:col-span-8 p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent pointer-events-none" />
          <div>
            <h3 className="text-headline-lg font-bold text-on-surface mb-2">
              Welcome back
            </h3>
            <p className="text-on-surface-variant text-body-lg">
              Operational status is{" "}
              <span className="text-secondary font-bold">Stable</span>. You have{" "}
              {activeProjectsCount} active projects.
            </p>
          </div>
          <div className="flex items-end justify-between mt-8">
            <div className="space-y-1">
              <p className="text-4xl font-mono font-bold leading-none text-on-surface">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                <span className="text-lg opacity-50 ml-1 font-normal">PM</span>
              </p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-2">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-low/40 p-3 rounded border border-outline-variant/30">
              <div className="text-right">
                <p className="text-lg font-mono text-on-surface">24°C</p>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">
                  Sunny • Seoul
                </p>
              </div>
              <Sun className="text-primary w-8 h-8" />
            </div>
          </div>
        </GlassCard>

        {/* Circular Progress / Insights */}
        <GlassCard className="col-span-12 lg:col-span-4 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-bold">Insights</h4>
            <MoreHorizontal className="text-on-surface-variant cursor-pointer" />
          </div>
          <CircularProgressChart />
          <div className="mt-6 space-y-3">
            <MetricItem
              label="Task Completion"
              value="+12.4%"
              color="bg-primary"
            />
            <MetricItem
              label="Average Wait"
              value="32 min"
              color="bg-outline-variant"
            />
          </div>
        </GlassCard>

        {/* 4 Stats Grid */}
        <StatCard
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          label="Total Personnel"
          value={totalPersonnel.toString()}
          badge="Active"
          badgeColor="bg-emerald-400/10 text-emerald-400"
          borderColor="border-emerald-500"
        />

        <StatCard
          icon={<FolderKanban className="w-5 h-5 text-primary" />}
          label="Total Active Projects"
          value={activeProjectsCount.toString()}
          badge="Stable"
          badgeColor="bg-surface-container-highest text-on-surface-variant"
          borderColor="border-primary"
        />

        <StatCard
          icon={<Package className="w-5 h-5 text-rose-400" />}
          label="Equipment Replacements"
          value={(equipment?.length || 0).toString()}
          badge="In Use"
          badgeColor="bg-rose-400/10 text-rose-400"
          borderColor="border-rose-500"
        />

        <StatCard
          icon={<DollarSign className="w-5 h-5 text-purple-400" />}
          label="Monthly M/M Cost"
          value={`₩${(monthlyCost / 1000000).toFixed(1)}M`}
          badge="On Budget"
          badgeColor="bg-purple-400/10 text-purple-400"
          borderColor="border-purple-500"
        />

        {/* Main Area Chart - Manpower Availability */}
        <GlassCard className="col-span-12 lg:col-span-8 p-6 flex flex-col min-h-[340px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-lg font-bold">Manpower Availability</h4>
              <p className="text-sm text-on-surface-variant">
                Fluctuations across the current quarter
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full text-[10px] text-on-surface-variant font-bold">
                <span className="w-2 h-2 rounded-full bg-primary" /> Full-time
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full text-[10px] text-on-surface-variant font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />{" "}
                Contractors
              </div>
            </div>
          </div>
          <div className="flex-1 relative mt-4">
            <AreaChart />
          </div>
        </GlassCard>

        {/* Calendar / Milestones */}
        <GlassCard className="col-span-12 lg:col-span-4 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold">Milestones</h4>
            <div className="flex gap-2">
              <Clock className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-on-surface" />
            </div>
          </div>
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-on-surface-variant mb-4">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-center text-xs mb-6">
            {[...Array(35)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  "p-2",
                  i === 26
                    ? "bg-primary text-white rounded-full"
                    : i < 3 || i > 31
                      ? "opacity-20"
                      : "",
                )}
              >
                {(i % 31) + 1}
              </span>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Upcoming Today
            </p>
            <MilestoneItem
              name="Project Alpha Deployment"
              time="14:00"
              color="bg-emerald-400"
            />
            <MilestoneItem
              name="Q4 Resource Planning"
              time="16:30"
              color="bg-primary"
            />
          </div>
        </GlassCard>

        {/* Bottom Tasks and Lists Section */}
        <GlassCard className="col-span-12 lg:col-span-8 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-headline-md font-bold text-on-surface">
              Quick Tasks & Approvals
            </h4>
            <Button variant="outline" className="text-primary text-label-caps font-bold uppercase tracking-widest hover:underline">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {quickTasks.length === 0 ? (
              <div className="text-sm text-on-surface-variant/40 text-center py-8">
                No pending approvals or active tasks.
              </div>
            ) : (
              quickTasks.map((item) => (
                <TaskItem
                  key={item.id}
                  icon={item.icon}
                  name={item.name}
                  desc={item.desc}
                />
              ))
            )}
          </div>
        </GlassCard>

        {/* Project Efficiency Bento Cell */}
        <GlassCard className="col-span-12 lg:col-span-4 p-6 flex flex-col">
          <h4 className="text-lg font-bold mb-6">Project Cost Efficiency</h4>
          <div className="space-y-6">
            {topProjects.length === 0 ? (
              <div className="text-sm text-on-surface-variant/40 text-center py-6">
                No active projects.
              </div>
            ) : (
              topProjects.map((p, idx) => (
                <ProgressItem
                  key={idx}
                  name={p.name}
                  percent={p.percent}
                  color={p.color}
                />
              ))
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-outline-variant/30">
            <div className="text-center">
              <p className="text-label-caps text-on-surface-variant font-bold uppercase mb-1">
                Total Saving
              </p>
              <p className="text-headline-md font-bold font-mono text-emerald-400">
                +$12.4k
              </p>
            </div>
            <div className="text-center">
              <p className="text-label-caps text-on-surface-variant font-bold uppercase mb-1">
                Est. Completion
              </p>
              <p className="text-headline-md font-bold font-mono text-on-surface">
                Dec 2025
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
