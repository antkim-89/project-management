import { Button } from "@/components/base/Button";
import { createFileRoute } from "@tanstack/react-router";
import {
  Filter,
  Laptop,
  Monitor,
  MoreVertical,
  AlertTriangle,
  Activity,
  Package,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/base/GlassCard";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { useState, useMemo, useRef } from "react";
import {
  useEquipment,
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
} from "@/hooks/api/useEquipment";
import { useUsers } from "@/hooks/api/useUsers";
import { BaseModal } from "@/components/base/BaseModal";
import { Select } from "@/components/base/Select";
import { BasePopover } from "@/components/base/BasePopover";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/assets")({
  component: Assets,
});

function Assets() {
  const { t } = useTranslation();
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
    status: "Available" as "Available" | "Assigned" | "Maintenance" | "Needs Repair",
    physicalStatus: "Normal" as "Normal" | "Maintenance" | "Needs Repair",
    purchaseDate: todayStr,
  });

  // 필터 관련 상태 추가
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const filterBtnRef = useRef<HTMLButtonElement>(null);

  const computedStatus = useMemo(() => {
    if (manageForm.physicalStatus === "Needs Repair") return "Needs Repair";
    if (manageForm.physicalStatus === "Maintenance") return "Maintenance";
    return manageForm.userId ? "Assigned" : "Available";
  }, [manageForm.physicalStatus, manageForm.userId]);

  const mappedAssets = useMemo(() => {
    return (
      equipment?.map((e) => ({
        id: e.id,
        name: e.modelName,
        sn: e.serialNumber,
        type: e.type,
        user: e.user?.name || t("assets.unassigned"),
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

  const filteredAssets = useMemo(() => {
    return mappedAssets.filter((asset) => {
      const typeMatch = filterType === "All" || asset.type === filterType;
      const statusMatch = filterStatus === "All" || asset.status === filterStatus;
      return typeMatch && statusMatch;
    });
  }, [mappedAssets, filterType, filterStatus]);

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
    const initialPhysicalStatus = (
      asset.status === "Needs Repair" || asset.status === "Maintenance"
        ? asset.status
        : "Normal"
    ) as "Normal" | "Maintenance" | "Needs Repair";

    setManageForm({
      type: asset.type,
      modelName: asset.name,
      serialNumber: asset.sn,
      userId: asset.userId,
      status: asset.status,
      physicalStatus: initialPhysicalStatus,
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split("T")[0] : todayStr,
    });
    setIsManageModalOpen(true);
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.modelName || !addForm.serialNumber) {
      alert(t("assets.alertInputModelSn"));
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
    } catch {
      alert(t("assets.alertFailAdd"));
    }
  };

  const handleUpdateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) return;

    // physicalStatus와 userId를 조합하여 최종 status 도출
    let calculatedStatus: "Available" | "Assigned" | "Maintenance" | "Needs Repair";
    if (manageForm.physicalStatus === "Normal") {
      calculatedStatus = manageForm.userId ? "Assigned" : "Available";
    } else {
      calculatedStatus = manageForm.physicalStatus;
    }

    try {
      await updateMutation.mutateAsync({
        id: selectedAssetId,
        updatedFields: {
          type: manageForm.type,
          modelName: manageForm.modelName,
          serialNumber: manageForm.serialNumber,
          userId: manageForm.userId || null,
          status: calculatedStatus,
          purchaseDate: manageForm.purchaseDate,
        },
      });
      setIsManageModalOpen(false);
    } catch {
      alert(t("assets.alertFailUpdate"));
    }
  };

  const handleDeleteAsset = async () => {
    if (!selectedAssetId) return;
    if (!confirm(t("assets.confirmDelete"))) return;
    try {
      await deleteMutation.mutateAsync(selectedAssetId);
      setIsManageModalOpen(false);
    } catch {
      alert(t("assets.alertFailDelete"));
    }
  };

  const userOptions = useMemo(() => {
    return [
      { value: "", label: t("assets.unassigned") },
      ...(users?.map((u) => ({ value: u.id, label: `${u.name} (${u.rank?.name || t("assets.member")})` })) || [])
    ];
  }, [users, t]);

  const typeOptions = [
    { value: "Laptop", label: t("assets.laptop") },
    { value: "Monitor", label: t("assets.monitor") },
    { value: "Mobile", label: t("assets.mobile") },
    { value: "Package", label: t("assets.package") },
  ];

  const statusOptions = [
    { value: "Assigned", label: t("assets.assigned") },
    { value: "Available", label: t("assets.available") },
    { value: "Maintenance", label: t("assets.maintenance") },
    { value: "Needs Repair", label: t("assets.needsRepair") },
  ];

  const physicalStatusOptions = [
    { value: "Normal", label: t("assets.normal") },
    { value: "Maintenance", label: t("assets.maintenance") },
    { value: "Needs Repair", label: t("assets.needsRepair") },
  ];



  if (isLoading) return <div className="p-6">{t("assets.loading")}</div>;
  if (error) return <div className="p-6 text-error">{t("assets.error")}</div>;

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto w-full animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: "Assets" }]} />
          <h2 className="text-display-lg font-bold text-on-surface tracking-tight">
            {t("assets.title")}
          </h2>
          <p className="text-on-surface-variant text-body-md mt-1">
            {t("assets.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            prefixIcon={<Plus size={14} />}
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer"
          >
            {t("assets.addAsset")}
          </Button>
          <div className="relative">
            <Button
              ref={filterBtnRef}
              variant="glass"
              prefixIcon={<Filter size={14} />}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="cursor-pointer relative"
            >
              {t("assets.filterView")}
              {(filterType !== "All" || filterStatus !== "All") && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full shadow-md" />
              )}
            </Button>
            <BasePopover
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              triggerRef={filterBtnRef}
              position="bottomRight"
              className="w-72 p-4 bg-surface-container border border-outline-variant/40 shadow-xl rounded-xl space-y-4 z-[40]"
            >
              <div className="space-y-2">
                <label className="text-label-caps font-bold text-on-surface-variant">
                  {t("assets.filterByType")}
                </label>
                <Select
                  options={[
                    { value: "All", label: t("assets.allTypes") },
                    ...typeOptions,
                  ]}
                  value={filterType}
                  onChange={(val) => setFilterType(val)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-label-caps font-bold text-on-surface-variant">
                  {t("assets.filterByStatus")}
                </label>
                <Select
                  options={[
                    { value: "All", label: t("assets.allStatuses") },
                    ...statusOptions,
                  ]}
                  value={filterStatus}
                  onChange={(val) => setFilterStatus(val)}
                />
              </div>

              {(filterType !== "All" || filterStatus !== "All") && (
                <Button
                  variant="glass"
                  className="w-full text-label-sm font-bold text-error border-error/20 hover:bg-error/10 cursor-pointer"
                  onClick={() => {
                    setFilterType("All");
                    setFilterStatus("All");
                    setIsFilterOpen(false);
                  }}
                >
                  {t("assets.resetFilters")}
                </Button>
              )}
            </BasePopover>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Section: Inventory */}
        <div className="col-span-12 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-headline-md font-bold flex items-center gap-2 text-on-surface">
              <Package size={18} className="text-primary" /> {t("assets.inventory")}
            </h3>
            <span className="font-mono text-label-sm text-on-surface-variant">
              {equipment?.length || 0} {t("assets.activeUnits")}
            </span>
          </div>

          <div className="data-table-container">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>{t("assets.name")}</th>
                    <th>{t("assets.user")}</th>
                    <th>{t("assets.lifeCycle")}</th>
                    <th>{t("assets.status")}</th>
                    <th>{t("common.action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
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
                              {t("assets.serialNumber")}: {asset.sn}
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
                          {asset.status === "Needs Repair"
                            ? t("assets.needsRepair")
                            : asset.status === "Maintenance"
                              ? t("assets.maintenance")
                              : asset.status === "Assigned"
                                ? t("assets.assigned")
                                : t("assets.available")}
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
                {t("assets.needsRepair")}
              </div>
              <div className="text-2xl font-mono text-on-surface">
                {stats.needsRepair.toString().padStart(2, "0")}
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] mt-2",
                stats.needsRepair > 0 ? "text-error animate-pulse" : "text-secondary"
              )}>
                <AlertTriangle size={14} />
                {stats.needsRepair > 0 ? t("assets.actionRequired") : t("assets.allClean")}
              </div>
            </GlassCard>
            <GlassCard className="p-4 rounded-xl">
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">
                {t("assets.maintenance")}
              </div>
              <div className="text-2xl font-mono text-on-surface">
                {stats.maintenance.toString().padStart(2, "0")}
              </div>
              <div className="flex items-center gap-1 text-primary text-[10px] mt-2">
                <Activity size={14} />
                {t("assets.underInspection")}
              </div>
            </GlassCard>
            <GlassCard className="p-4 rounded-xl">
              <div className="text-on-surface-variant text-xs mb-1 font-bold uppercase tracking-wider">
                {t("assets.avgHealth")}
              </div>
              <div className="text-2xl font-mono text-on-surface">
                {stats.avgHealth}%
              </div>
              <div className="flex items-center gap-1 text-secondary text-[10px] mt-2">
                <Info size={14} />
                {t("assets.healthText")}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* 1. 신규 장비 추가 모달 */}
      <BaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t("assets.addTitle")}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="glass" onClick={() => setIsAddModalOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleAddAsset}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? t("assets.registering") : t("assets.registerAsset")}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAddAsset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.assetType")}
            </label>
            <Select
              options={typeOptions}
              value={addForm.type}
              onChange={(val) => setAddForm((f) => ({ ...f, type: val }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.modelName")}
            </label>
            <input
              type="text"
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t("assets.placeholderModel")}
              value={addForm.modelName}
              onChange={(e) => setAddForm((f) => ({ ...f, modelName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.serialNumber")}
            </label>
            <input
              type="text"
              className="w-full bg-surface-container border border-outline-variant/40 text-on-surface rounded-xl px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t("assets.placeholderSn")}
              value={addForm.serialNumber}
              onChange={(e) => setAddForm((f) => ({ ...f, serialNumber: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.assignUser")}
            </label>
            <Select
              options={userOptions}
              value={addForm.userId}
              onChange={(val) => setAddForm((f) => ({ ...f, userId: val }))}
              placeholder={t("assets.placeholderAssign")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.purchaseDate")}
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
        title={t("assets.manageAsset")}
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
              {t("assets.scrapAsset")}
            </Button>
            <div className="flex gap-3">
              <Button variant="glass" onClick={() => setIsManageModalOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateAsset}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? t("assets.saving") : t("common.save")}
              </Button>
            </div>
          </div>
        }
      >
        <form onSubmit={handleUpdateAsset} className="space-y-6">
          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.assetType")}
            </label>
            <Select
              options={typeOptions}
              value={manageForm.type}
              onChange={(val) => setManageForm((f) => ({ ...f, type: val }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.modelName")}
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
              {t("assets.serialNumber")}
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
              {t("assets.assignUser")}
            </label>
            <Select
              options={userOptions}
              value={manageForm.userId}
              onChange={(val) => setManageForm((f) => ({ ...f, userId: val }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.hardwareStatus")} [{t("assets.autoDisplay")}]
            </label>
            <div className="flex items-center h-12">
              <span
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border",
                  computedStatus === "Needs Repair"
                    ? "bg-error/15 text-error border-error/25 animate-pulse"
                    : computedStatus === "Maintenance"
                      ? "bg-primary/15 text-primary border-primary/25"
                      : computedStatus === "Assigned"
                        ? "bg-secondary/15 text-secondary border-secondary/25"
                        : "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant",
                )}
              >
                {computedStatus === "Needs Repair"
                  ? t("assets.needsRepair")
                  : computedStatus === "Maintenance"
                    ? t("assets.maintenance")
                    : computedStatus === "Assigned"
                      ? t("assets.assigned")
                      : t("assets.available")}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.deviceStatus")}
            </label>
            <Select
              options={physicalStatusOptions}
              value={manageForm.physicalStatus}
              onChange={(val) => setManageForm((f) => ({ ...f, physicalStatus: val as any }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-caps font-bold text-on-surface-variant">
              {t("assets.purchaseDate")}
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
