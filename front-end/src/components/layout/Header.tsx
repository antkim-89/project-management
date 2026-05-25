import { Button } from "@/components/base/Button";
import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Globe,
  LogOut,
  User as UserIcon,
  LogIn,
  Sun,
  Moon,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { UserDetailModal } from "@/components/modal/UserDetailModal";
import { BasePopover } from "@/components/base/BasePopover";

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userBtnRef = useRef<HTMLButtonElement>(null);

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "ko" : "en";
    i18n.changeLanguage(nextLang);
  };

  const handleUserClick = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsPopoverOpen(false);
  };

  return (
    <>
      <header className="h-16 bg-surface-container-low border-b border-outline-variant flex items-center justify-between px-6 shrink-0 relative z-[30]">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-on-surface tracking-tight">
              ProManage
            </span>
          </Link>
        </div>

        {/* Right: User, Language, Theme, Auth */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            className="flex items-center gap-2 px-3 h-10 rounded-lg text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-all active:scale-95 cursor-pointer"
            onClick={toggleTheme}
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <span className="uppercase text-[10px] font-bold tracking-widest">
              {theme}
            </span>
          </button>

          {/* Language Selector */}
          <button
            className="flex items-center gap-2 px-3 h-10 rounded-lg text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-all active:scale-95 cursor-pointer"
            onClick={toggleLanguage}
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase text-[10px] font-bold tracking-widest">
              {i18n.language.split("-")[0]}
            </span>
          </button>

          <div className="w-px h-6 bg-outline-variant/30 mx-2" />

          {/* Auth Group */}
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <>
                <button
                  ref={userBtnRef}
                  className="flex items-center gap-3 p-1.5 rounded-full hover:bg-interaction-hover transition-all cursor-pointer"
                  onClick={handleUserClick}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold shadow-md shadow-secondary/20">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-label-md font-bold text-on-surface mr-2 hidden md:block">
                    {user.name}
                  </span>
                </button>

                {/* BasePopover Integration */}
                <BasePopover
                  isOpen={isPopoverOpen}
                  onClose={() => setIsPopoverOpen(false)}
                  triggerRef={userBtnRef}
                  position="bottomRight"
                  className="w-64 p-0 overflow-hidden"
                >
                  <div className="p-6 bg-surface-container-high border-b border-outline-variant flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-2xl font-bold mb-3 shadow-lg shadow-secondary/20">
                      {user.name.charAt(0)}
                    </div>
                    <div className="font-bold text-on-surface">{user.name}</div>
                    <div className="text-body-sm text-on-surface-variant">
                      {user.email}
                    </div>
                  </div>
                  <div className="p-2 bg-surface-container">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-all group cursor-pointer"
                      onClick={handleOpenModal}
                    >
                      <UserIcon className="w-4 h-4" />
                      <span className="text-label-md font-bold">
                        Profile Detail
                      </span>
                      <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-interaction-hover hover:text-on-surface transition-all cursor-pointer">
                      <Settings className="w-4 h-4" />
                      <span className="text-label-md font-bold">
                        Account Settings
                      </span>
                    </button>
                    <div className="h-px bg-outline-variant/30 my-2" />
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-error hover:bg-error/10 transition-all cursor-pointer"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-label-md font-bold">
                        {t("common.logout")}
                      </span>
                    </button>
                  </div>
                </BasePopover>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={login}
                prefixIcon={<LogIn className="w-4 h-4" />}
              >
                {t("common.login")}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Detail Modal */}
      <UserDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
