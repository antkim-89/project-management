import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { GlassCard } from "@/components/base/GlassCard";

import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { t } = useTranslation();
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <div className="max-w-4xl">
        <Breadcrumbs items={[{ label: t("common.about") }]} />
        <h1 className="font-bold text-display-lg text-on-surface mb-6">
          {t("about.title")}
        </h1>

        <GlassCard className="p-8">
          <p className="text-on-surface-variant text-body-lg leading-relaxed mb-4">
            {t("about.description1")}
          </p>
          <p className="text-on-surface-variant text-body-lg leading-relaxed">
            {t("about.description2")}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
