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
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { useState, useMemo } from "react";
import {
  useEquipment,
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
} from "@/hooks/api/useEquipment";
import { useUsers } from "@/hooks/api/useUsers";
import { BaseModal } from "@/components/base/BaseModal";
import { Select } from "@/components/base/Select";

export const Route = createFileRoute("/assets")({
  component: Assets,
});

function Assets() {
  const { data: equipment, isLoading, error } = useEquipment();
  const { data: users } = useUsers();

  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();
  const deleteMutation = useDeleteEquipment();

  // 모달 제어 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // 신규 등록 폼 상태
  const [addForm, setAddForm] = useState({
    type: "Laptop",
    modelName: "",
    serialNumber: "",
    userId: "",
    purchaseDate: todayStr,
  });

  // 장비 관리(수정) 폼 상태
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [manageForm, setManageForm] = useState({
    type: "Laptop",
    modelName: "",
    serialNumber: "",
    userId: "",
    status: "Available",
    purchaseDate: todayStr,
  });

  const mappedAssets = useMemo(() => {
    return (
      equipment?.map((e) => ({
        id: e.id,
        name: e.modelName,
        sn: e.serialNumber,
        type: e.type,
        user: e.user?.name || "Unassigned",
        userId: e.userId || "",
        userInitial: e.user?.name?.substring(0, 2).toUpperCase() || "NA",
        health: e.health,
        purchaseDate: e.purchaseDate,
        status: e.status,
        icon:
          e.type === "Laptop" ? Laptop : e.type === "Monitor" ? Monitor : Package,
        urgent: e.status === "Needs Repair",
      })) || []
    );
  }, [equipment]);

  // 동적 통계 계산
  const stats = useMemo(() => {
    const total = mappedAssets.length;
    const needsRepair = mappedAssets.filter((a) => a.status === "Needs Repair").length;
    const maintenance = mappedAssets.filter((a) => a.status === "Maintenance").length;

    // 평균 헬스 스코어
    const avgHealth = total > 0
      ? Math.round(mappedAssets.reduce((sum, a) => sum + a.health, 0) / total)
      : 100;

    return {
      needsRepair,
      maintenance,
      avgHealth,
    };
  }, [mappedAssets]);

  const handleOpenManageModal = (asset: any) => {
    setSelectedAssetId(asset.id);
    setManageForm({
      type: asset.type,
      modelName: asset.name,
      serialNumber: asset.sn,
      userId: asset.userId,
      status: asset.status,
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split("T")[0] : todayStr,
    });
    setIsManageModalOpen(true);
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.modelName || !addForm.serialNumber) {
      alert("모델명과 시리얼 번호를 입력해 주세요.");
      return;
    }
    try {
      await createMutation.mutateAsync({
        type: addForm.type,
        modelName: addForm.modelName,
        serialNumber: addForm.serialNumber,
        userId: addForm.userId || null,
        purchaseDate: addForm.purchaseDate,
      });
      setIsAddModalOpen(false);
      setAddForm({
        type: "Laptop",
        modelName: "",
        serialNumber: "",
        userId: "",
        purchaseDate: todayStr,
      });
    } catch (err) {
      alert("장비 등록에 실패했습니다.");
    }
  };

  const handleUpdateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedAssetId,
        updatedFields: {
          type: manageForm.type,
          modelName: manageForm.modelName,
          serialNumber: manageForm.serialNumber,
          userId: manageForm.userId || null,
          status: manageForm.status,
          purchaseDate: manageForm.purchaseDate,
        },
      });
      setIsManageModalOpen(false);
    } catch (err) {
      alert("장비 수정에 실패했습니다.");
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAssetId) return;
    if (!confirm("정말로 이 장비를 영구 파기(삭제)하시겠습니까?")) return;
    try {
      await deleteMutation.mutateAsync(selectedAssetId);
      setIsManageModalOpen(false);
    } catch (err) {
      alert("장비 삭제에 실패했습니다.");
    }
  };

  const userOptions = useMemo(() => {
    return [
      { value: "", label: "Unassigned (배정 없음)" },
      ...(users?.map((u) => ({ value: u.id, label: `${u.name} (${u.rank?.name || "Member"})` })) || [])
    ];
  }, [users]);

  const typeOptions = [
    { value: "Laptop", label: "Laptop (노트북)" },
    { value: "Monitor", label: "Monitor (모니터)" },
    { value: "Mobile", label: "Mobile (모바일)" },
    { value: "Package", label: "Package (기타 비품)" },
  ];

  const statusOptions = [
    { value: "Assigned", label: "Assigned (배정됨)" },
    { value: "Available", label: "Available (배정 가능)" },
    { value: "Maintenance", label: "Maintenance (정비 중)" },
    { value: "Needs Repair", label: "Needs Repair (수리 필요)" },
  ];

  const COURSES = [
    {
      title: "AWS Cloud Mastery",
      chapters: "12 Chapters",
      type: "Digital",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
    },
    {
      title: "Systemic Design",
      chapters: "5 Units Available",
      type: "Hardcopy",
      image:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80",
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
          <Button
            variant="primary"
            prefixIcon={<Plus size={14} />}
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer"
          >
            Add Asset
          </Button>
          <Button variant="glass" prefixIcon={<Filter size={14} />}>
            Filter View
          </Button>
          <Button variant="glass" prefixIcon={<Download size={14} />}>
            Export Inventory
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
                                ? "text-error animate-pulse"
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
                            asset.urgent ? "text-error font-bold" : "text-outline",
                          )}
                        >
                          {asset.health}% Health
                        </div>
                      </td>
                      <td>
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                            asset.status === "Needs Repair"
                              ? "bg-error/15 text-error border-error/25 animate-pulse"
                              : asset.status === "Maintenance"
                                ? "bg-primary/15 text-primary border-primary/25"
                                : asset.status === "Assigned"
                                  ? "bg-secondary/15 text-secondary border-secondary/25"
                                  : "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant",
                          )}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleOpenManageModal(asset)}
                          className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-1 rounded-md hover:bg-interaction-hover"
                        >
                          {asset.urgent ? (
                            <AlertTriangle size={18} className="text-error animate-bounce" />
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
                Needs Repair
              </div>
              <div className="text-2xl font-mono text-on-surface">
                {stats.needsRepair.toString().padStart(2, "0")}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] mt-2",
                stats.needsRepair > 0 ? "text-error animate-pulse" : "text-secondary"
              )}>
                <AlertTriangle size={14} />
                {stats.needsRepair > 0 ? "Action Required" : "All clean"}
              </div>
            </GlassCard>
            <GlassCard className="p-4 rounded-xl">
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">
                In Maintenance
              </div>
              <div className="text-2xl font-mono text-on-surface">
                {stats.maintenance.toString().padStart(2, "0")}
              </div>
              <div className="flex items-center gap-1 text-primary text-[10px] mt-2">
                <Activity size={14} />
                Under inspection
              </div>
            </GlassCard>
            <GlassCard className="p-4 rounded-xl">
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">
                Average Fleet Health
              </div>
              <div className="text-2xl font-mono text-on-surface">
                {stats.avgHealth}%
              </div>
              <div className="flex items-center gap-1 text-secondary text-[10px] mt-2">
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

      {/* 1. 신규 장비 추가 모달 */}
      <BaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Asset (비품 등록)"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="glass" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddAsset}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Registering..." : "Register Asset"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAddAsset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Asset Type (장비 유형)
            </label>
            <Select
              options={typeOptions}
              value={addForm.type}
              onChange={(val) => setAddForm((f) => ({ ...f, type: val }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Model Name (모델명)
            </label>
            <input
              type="text"
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="예: MacBook Pro 16 또는 LG Gram 15"
              value={addForm.modelName}
              onChange={(e) => setAddForm((f) => ({ ...f, modelName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Serial Number (시리얼 번호)
            </label>
            <input
              type="text"
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="고유 번호 입력"
              value={addForm.serialNumber}
              onChange={(e) => setAddForm((f) => ({ ...f, serialNumber: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Assign User (초기 직원 배정)
            </label>
            <Select
              options={userOptions}
              value={addForm.userId}
              onChange={(val) => setAddForm((f) => ({ ...f, userId: val }))}
              placeholder="배정할 직원을 고르세요 (선택)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Purchase Date (구입일)
            </label>
            <input
              type="date"
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={addForm.purchaseDate}
              onChange={(e) => setAddForm((f) => ({ ...f, purchaseDate: e.target.value }))}
            />
          </div>
        </form>
      </BaseModal>

      {/* 2. 장비 관리/수정 모달 */}
      <BaseModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Manage Asset (비품 관리)"
        size="md"
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="glass"
              className="text-error border-error/20 hover:bg-error/10"
              prefixIcon={<Trash2 size={14} />}
              onClick={handleDeleteAsset}
              disabled={deleteMutation.isPending}
            >
              Scrap Asset (폐기)
            </Button>
            <div className="flex gap-3">
              <Button variant="glass" onClick={() => setIsManageModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateAsset}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleUpdateAsset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Asset Type (장비 유형)
            </label>
            <Select
              options={typeOptions}
              value={manageForm.type}
              onChange={(val) => setManageForm((f) => ({ ...f, type: val }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Model Name (모델명)
            </label>
            <input
              type="text"
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={manageForm.modelName}
              onChange={(e) => setManageForm((f) => ({ ...f, modelName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Serial Number (시리얼 번호)
            </label>
            <input
              type="text"
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={manageForm.serialNumber}
              onChange={(e) => setManageForm((f) => ({ ...f, serialNumber: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Assign User (직원 배정 변경)
            </label>
            <Select
              options={userOptions}
              value={manageForm.userId}
              onChange={(val) => setManageForm((f) => ({ ...f, userId: val }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Hardware Status (하드웨어 상태)
            </label>
            <Select
              options={statusOptions}
              value={manageForm.status}
              onChange={(val) => setManageForm((f) => ({ ...f, status: val }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              Purchase Date (구입일)
            </label>
            <input
              type="date"
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={manageForm.purchaseDate}
              onChange={(e) => setManageForm((f) => ({ ...f, purchaseDate: e.target.value }))}
            />
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
