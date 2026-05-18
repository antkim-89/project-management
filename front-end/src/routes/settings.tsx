import { Button } from "@/components/base/Button";
import { createFileRoute } from "@tanstack/react-router";
import { User, Bell, Lock, Globe, Palette } from "lucide-react";
import { Breadcrumbs } from "@/components/base/Breadcrumbs";
import { GlassCard } from "@/components/base/GlassCard";

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

function Settings() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-surface animate-fade-in">
      <Breadcrumbs items={[{ label: "Settings" }]} />
      <h1 className="font-bold text-display-lg text-on-surface mb-1">
        Settings
      </h1>
      <p className="text-on-surface-variant text-body-md mb-8">
        Configure your personal and workspace preferences.
      </p>

      <div className="flex flex-col gap-4 max-w-3xl">
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
    </div>
  );
}
