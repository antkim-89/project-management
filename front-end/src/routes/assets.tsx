import { Button } from "@/components/base/Button";
import { createFileRoute } from "@tanstack/react-router";
import {
  Filter,
  Download,
  Laptop,
  Monitor,
  MoreVertical,
  AlertTriangle,
  Activity,
  Award,
  ShoppingCart,
  Check,
  X,
  Clock,
  Package,
  TrendingDown,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";

export const Route = createFileRoute("/assets")({
  component: Assets,
});

import { useEquipment } from "@/hooks/api/useEquipment";

function Assets() {
  const { data: equipment, isLoading, error } = useEquipment();

  const mappedAssets =
    equipment?.map((e) => ({
      name: e.modelName,
      sn: e.serialNumber,
      user: e.user?.name || "Unassigned",
      userInitial: e.user?.name?.substring(0, 2).toUpperCase() || "NA",
      health: 100, // 임시 로직
      status: e.status,
      icon:
        e.type === "Laptop" ? Laptop : e.type === "Monitor" ? Monitor : Package,
      urgent: e.status === "Needs Repair",
    })) || [];

  const COURSES = [
    {
      title: "AWS Cloud Mastery",
      chapters: "12 Chapters",
      type: "Digital",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC0_S07uN2i-htDInxiKCwRpfeJSnvVpyAGsCXZMLiwCQQd_BoDOVNcOlghtLi-Ot5udKkplsaLgaEr7RD9L56CSsPVAHsiOMpku8oDuoc73YQyHeJTqwjQt6CyYSdZ_MUHjvakBRgsmg3yMlEiMP6bBWWZZMvn8S900Xbuw_wQ4HzVY3dDbIzU9DWBDZZTM8laP6Y72LRptA9Xnxe3DdBybBG220LRexD4ejGo1z7wbSSSpQl55sopd2gVKnPWROc6F4HlBbdwoDI",
    },
    {
      title: "Systemic Design",
      chapters: "5 Units Available",
      type: "Hardcopy",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA3wzCk0zmkGKQVlGEQJN1mTsliNEz-KUTIXsJSaC_XnRMppdXP5n3fq8qSX74ondayqkh8I-p3oOylhgv3LBE_2H1x5p9bFk8TBDz7kaD2OuRUtq0QfXoKBNMXM8GabNzm_BOVeBhR7ipGj9N10PggRxLZty3AI_atmhu_FjgrxyRb2h2c8CFRLUu46Lm7uRNRqyqnZsWKq0VEZGLlYyYJ5fCMHQSXvnTdP8zjNM1qb-wdADzFzAKhBoLRFx842uk7UCVMXkIafUE",
    },
  ];

  if (isLoading) return <div className="p-6">Loading assets...</div>;
  if (error) return <div className="p-6 text-error">Error loading assets</div>;

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto w-full animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Assets" }]} />
          <h2 className="text-display-lg font-bold text-on-surface tracking-tight">
            Resource Lifecycle
          </h2>
          <p className="text-on-surface-variant text-body-md mt-1">
            Manage global inventory and employee development programs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="glass" className="">
            <Filter size={14} /> Filter View
          </Button>
          <Button variant="glass" className="">
            <Download size={14} /> Export Inventory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Section: Inventory */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-headline-md font-bold flex items-center gap-2 text-on-surface">
              <Package size={18} className="text-primary" /> Asset Inventory
            </h3>
            <span className="font-mono text-label-sm text-on-surface-variant">
              {equipment?.length || 0} Active Units
            </span>
          </div>

          <div className="data-table-container">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Assigned User</th>
                    <th>Life Cycle</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedAssets.map((asset) => (
                    <tr
                      key={asset.sn}
                      className={cn(asset.urgent && "bg-error/5")}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <asset.icon
                            className={cn(
                              "w-5 h-5",
                              asset.urgent
                                ? "text-error"
                                : "text-on-surface-variant",
                            )}
                          />
                          <div>
                            <div className="font-bold text-on-surface text-label-md">
                              {asset.name}
                            </div>
                            <div className="text-label-caps font-mono text-outline uppercase">
                              SN: {asset.sn}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-label-caps border border-primary/30 text-primary font-bold">
                            {asset.userInitial}
                          </div>
                          <span className="text-sm">{asset.user}</span>
                        </div>
                      </td>
                      <td>
                        <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-1">
                          <div
                            className={cn(
                              "h-full transition-all duration-500",
                              asset.health < 20
                                ? "bg-error"
                                : asset.health < 50
                                  ? "bg-primary"
                                  : "bg-secondary",
                            )}
                            style={{ width: `${asset.health}%` }}
                          />
                        </div>
                        <div
                          className={cn(
                            "text-[10px] mt-1 font-mono",
                            asset.urgent ? "text-error" : "text-outline",
                          )}
                        >
                          {asset.health}% Health
                        </div>
                      </td>
                      <td>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                            asset.urgent
                              ? "bg-error/20 text-error border border-error/20"
                              : "bg-secondary/10 text-secondary",
                          )}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td>
                        <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                          {asset.urgent ? (
                            <AlertTriangle size={18} className="text-error" />
                          ) : (
                            <MoreVertical size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4 rounded-xl">
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">
                Replacement Budget
              </div>
              <div className="text-2xl font-mono text-on-surface">$12,450</div>
              <div className="flex items-center gap-1 text-secondary text-[10px] mt-2">
                <TrendingDown size={14} />
                -5% from last month
              </div>
            </GlassCard>
            <GlassCard className="p-4 rounded-xl">
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">
                Out of Warranty
              </div>
              <div className="text-2xl font-mono text-on-surface">08</div>
              <div className="flex items-center gap-1 text-error text-[10px] mt-2">
                <AlertTriangle size={14} />
                Requires auditing
              </div>
            </GlassCard>
            <GlassCard className="p-4 rounded-xl">
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">
                Average Age
              </div>
              <div className="text-2xl font-mono text-on-surface">
                2.4 <span className="text-sm font-normal">yrs</span>
              </div>
              <div className="flex items-center gap-1 text-primary text-[10px] mt-2">
                <Info size={14} />
                Healthy fleet status
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Section: Welfare */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-headline-md font-bold flex items-center gap-2 text-on-surface">
              <Activity size={18} className="text-secondary" /> Employee Welfare
            </h3>
            <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {COURSES.map((course) => (
              <GlassCard
                key={course.title}
                className="p-0 overflow-hidden cursor-pointer group"
              >
                <div className="h-24 w-full bg-surface-container-highest relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-50 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background to-transparent opacity-60" />
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-background/80 rounded-sm text-label-caps font-bold uppercase">
                    {course.type}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-label-md truncate text-on-surface">
                    {course.title}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant mb-3">
                    {course.chapters}
                  </p>
                  <button className="w-full py-1.5 border border-primary/30 text-primary text-label-sm font-bold rounded hover:bg-interaction-primary-hover transition-colors cursor-pointer">
                    {course.type === "Digital" ? "Request Access" : "Borrow"}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>

          <button className="h-12 w-full bg-secondary text-on-secondary font-bold text-label-md uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer">
            <ShoppingCart size={18} /> Request Purchase
          </button>

          <GlassCard className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                Pending Approvals
              </div>
              <span className="w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </div>

            <div className="flex items-start gap-3 p-2 rounded transition-colors cursor-pointer hover:bg-interaction-hover">
              <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary">
                <Laptop size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-label-md font-bold truncate text-on-surface">
                  MacBook Pro Upgrade
                </div>
                <div className="text-label-sm text-on-surface-variant">
                  Requested by Michael Chen
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1 rounded transition-colors hover:bg-interaction-hover text-secondary cursor-pointer">
                  <Check size={14} />
                </button>
                <button className="p-1 rounded transition-colors hover:bg-interaction-hover text-error cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 rounded transition-colors cursor-pointer hover:bg-interaction-hover">
              <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary">
                <Award size={14} className="text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-label-md font-bold truncate text-on-surface">
                  Advanced PM Training
                </div>
                <div className="text-label-sm text-on-surface-variant">
                  Requested by Sarah Jenkins
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1 rounded transition-colors hover:bg-interaction-hover text-secondary cursor-pointer">
                  <Check size={14} />
                </button>
                <button className="p-1 rounded transition-colors hover:bg-interaction-hover text-error cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 rounded-xl">
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">
              Well-being Calendar
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center w-12 h-14 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-[10px] font-bold text-primary">NOV</div>
                <div className="text-lg font-black text-primary leading-none">
                  18
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface">
                  Mental Health Workshop
                </div>
                <div className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-1">
                  <Clock size={12} />
                  14:00 - 15:30 • Zoom
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
