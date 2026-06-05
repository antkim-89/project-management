import { createFileRoute } from "@tanstack/react-router";
import {
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Video,
  MoreVertical,
} from "lucide-react";
import { GlassCard } from "@/components/base/GlassCard";

import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/files")({
  component: Files,
});

function FileCard({
  icon,
  name,
  size,
  items,
}: {
  icon: React.ReactNode;
  name: string;
  size: string;
  items: string;
}) {
  return (
    <GlassCard className="p-5 flex flex-col group cursor-pointer">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <button className="text-on-surface-variant hover:text-on-surface cursor-pointer">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
        {name}
      </h3>
      <div className="flex items-center justify-between mt-2 text-label-md text-on-surface-variant">
        <span>{items}</span>
        <span className="font-mono">{size}</span>
      </div>
    </GlassCard>
  );
}

function Files() {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-bold text-display-lg text-on-surface mb-1">
            {t("common.files")}
          </h1>
          <p className="text-on-surface-variant text-body-md">
            {t("files.subtitle")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FileCard({
          icon: <FolderOpen className="text-blue-400" />,
          name: t("files.designAssets"),
          size: "1.2 GB",
          items: t("files.fileCount", { count: 42 }),
        })}
        {FileCard({
          icon: <FileText className="text-emerald-400" />,
          name: t("files.documentation"),
          size: "45 MB",
          items: t("files.fileCount", { count: 12 }),
        })}
        {FileCard({
          icon: <ImageIcon className="text-purple-400" />,
          name: t("files.screenshots"),
          size: "230 MB",
          items: t("files.fileCount", { count: 85 }),
        })}
        {FileCard({
          icon: <Video className="text-rose-400" />,
          name: t("files.presentations"),
          size: "3.4 GB",
          items: t("files.fileCount", { count: 5 }),
        })}
      </div>
    </div>
  );
}
