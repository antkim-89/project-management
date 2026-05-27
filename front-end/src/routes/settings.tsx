import React, { useState } from "react";
import { Button } from "@/components/base/Button";
import { createFileRoute } from "@tanstack/react-router";
import { User, Bell, Lock, Globe, Palette, LayoutGrid, Code2, Trash2, Plus, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { GlassCard } from "@/components/base/GlassCard";
import { useProjectCategories, useCreateProjectCategory, useDeleteProjectCategory } from "@/hooks/api/useProjectCategories";
import { useSkills, useCreateSkill, useDeleteSkill } from "@/hooks/api/useSkills";
import { useEquipmentSettings, useUpdateEquipmentSetting } from "@/hooks/api/useEquipment";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function SettingItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <GlassCard className="flex items-center p-4 group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
        {icon}
      </div>
      <div className="flex-1 ml-4">
        <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-label-md text-on-surface-variant">{description}</p>
      </div>
      <Button variant="glass" className=" px-4">
        Edit
      </Button>
    </GlassCard>
  );
}

function WorkspaceSettings() {
  const { data: categories, isLoading: isCatsLoading } = useProjectCategories();
  const createCategory = useCreateProjectCategory();
  const deleteCategory = useDeleteProjectCategory();
  const [newCategoryName, setNewCategoryName] = useState("");

  const { data: skills, isLoading: isSkillsLoading } = useSkills();
  const createSkill = useCreateSkill();
  const deleteSkill = useDeleteSkill();
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Frontend");

  // 장비 수명 설정 관련
  const { data: eqSettings, isLoading: isEqSettingsLoading } = useEquipmentSettings();
  const updateEqSetting = useUpdateEquipmentSetting();
  const [eqLifes, setEqLifes] = useState<Record<string, number>>({
    Laptop: 36,
    Monitor: 60,
    Mobile: 24,
    Package: 36,
  });

  React.useEffect(() => {
    if (eqSettings) {
      const newLifes = { ...eqLifes };
      eqSettings.forEach((s) => {
        newLifes[s.type] = s.usefulLife;
      });
      setEqLifes(newLifes);
    }
  }, [eqSettings]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await createCategory.mutateAsync(newCategoryName);
    setNewCategoryName("");
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillCategory.trim()) return;
    await createSkill.mutateAsync({ name: newSkillName, category: newSkillCategory });
    setNewSkillName("");
  };

  const handleUpdateUsefulLife = async (type: string, life: number) => {
    if (life <= 0) {
      alert("수명은 1개월 이상이어야 합니다.");
      return;
    }
    try {
      await updateEqSetting.mutateAsync({ type, usefulLife: life });
      alert(`${type} 수명 기준이 ${life}개월로 성공적으로 수정되었습니다.`);
    } catch (err) {
      alert("수명 기준 수정에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Project Categories Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface">Project Categories</h3>
            <p className="text-body-sm text-on-surface-variant">Manage the types of projects (e.g., DevOps, SI, Gateway)</p>
          </div>
        </div>

        <form onSubmit={handleCreateCategory} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New Category Name..."
            className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
          <Button type="submit" variant="primary" prefixIcon={<Plus className="w-4 h-4" />}>
            Add Category
          </Button>
        </form>

        {isCatsLoading ? (
          <div className="text-center py-4 text-on-surface-variant">Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories?.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant/50 group hover:border-outline transition-colors">
                <span className="font-medium text-on-surface">{cat.name}</span>
                <button
                  onClick={() => deleteCategory.mutate(cat.id)}
                  className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Tech Stacks Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface">Tech Stacks</h3>
            <p className="text-body-sm text-on-surface-variant">Manage available technology stacks and skillsets</p>
          </div>
        </div>

        <form onSubmit={handleCreateSkill} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Skill Name (e.g., React)"
            className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
            className="w-full sm:w-48 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="DevOps">DevOps</option>
            <option value="Database">Database</option>
            <option value="Design">Design</option>
            <option value="Other">Other</option>
          </select>
          <Button type="submit" variant="primary" prefixIcon={<Plus className="w-4 h-4" />}>
            Add Skill
          </Button>
        </form>

        {isSkillsLoading ? (
          <div className="text-center py-4 text-on-surface-variant">Loading skills...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {skills?.map((skill) => (
              <div key={skill.id} className="flex flex-col p-3 bg-surface-container rounded-lg border border-outline-variant/50 group hover:border-outline transition-colors relative">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mb-1">{skill.category}</span>
                <span className="font-bold text-on-surface">{skill.name}</span>
                <button
                  onClick={() => deleteSkill.mutate(skill.id)}
                  className="absolute top-3 right-3 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Equipment Useful Life Settings Section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface">Equipment Useful Life Settings</h3>
            <p className="text-body-sm text-on-surface-variant">Manage the useful life (in months) of equipment types for dynamic health score calculation</p>
          </div>
        </div>

        {isEqSettingsLoading ? (
          <div className="text-center py-4 text-on-surface-variant">Loading settings...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Laptop", "Monitor", "Mobile", "Package"].map((type) => (
              <div key={type} className="flex flex-col p-4 bg-surface-container rounded-lg border border-outline-variant/50 gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-on-surface text-body-md uppercase">{type}</span>
                  <span className="text-label-sm text-on-surface-variant font-mono">
                    Current: {eqSettings?.find((s) => s.type === type)?.usefulLife ?? (type === "Laptop" ? 36 : type === "Monitor" ? 60 : type === "Mobile" ? 24 : 36)} months
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={eqLifes[type] !== undefined ? eqLifes[type] : ""}
                    onChange={(e) => setEqLifes((prev) => ({ ...prev, [type]: Number(e.target.value) }))}
                    className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                  <Button
                    variant="glass"
                    onClick={() => handleUpdateUsefulLife(type, eqLifes[type])}
                    className="cursor-pointer font-bold text-label-sm px-4"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState<"general" | "workspace">("general");

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <Breadcrumbs items={[{ label: "Settings" }]} />
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-bold text-display-lg text-on-surface mb-1">
            Settings
          </h1>
          <p className="text-on-surface-variant text-body-md">
            Configure your personal and workspace preferences.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-outline-variant">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-3 font-bold text-body-md border-b-2 transition-colors ${
            activeTab === "general"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("workspace")}
          className={`px-4 py-3 font-bold text-body-md border-b-2 transition-colors ${
            activeTab === "workspace"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Workspace Setup
        </button>
      </div>

      {activeTab === "general" ? (
        <div className="flex flex-col gap-4 max-w-3xl animate-fade-in">
          {SettingItem({
            icon: <User />,
            title: "Profile",
            description: "Update your personal information and avatar.",
          })}
          {SettingItem({
            icon: <Palette />,
            title: "Appearance",
            description: "Customize the look and feel of your workspace.",
          })}
          {SettingItem({
            icon: <Bell />,
            title: "Notifications",
            description: "Choose how and when you want to be notified.",
          })}
          {SettingItem({
            icon: <Lock />,
            title: "Security",
            description: "Manage your password and account security.",
          })}
          {SettingItem({
            icon: <Globe />,
            title: "Language",
            description: "Change the display language for the interface.",
          })}
        </div>
      ) : (
        <WorkspaceSettings />
      )}
    </div>
  );
}
