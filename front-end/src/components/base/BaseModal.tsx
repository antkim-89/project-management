import { Button } from "@/components/base/Button";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  hideHeader?: boolean;
}

export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
  hideHeader = false,
}: BaseModalProps) {
  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[calc(100vw-4rem)]",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full bg-surface-container border border-outline-variant rounded-[30px] shadow-2xl flex flex-col max-h-[calc(100vh-4rem)] animate-zoom-in",
          sizeClasses[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {!hideHeader && (title || onClose) && (
          <header className="flex items-center justify-between p-6 border-b border-outline-variant/30">
            {title ? (
              <h2 className="text-xl font-bold text-on-surface">{title}</h2>
            ) : (
              <div />
            )}
            {onClose && (
              <Button
                onClick={onClose}
                variant="glass"
                size="icon"
                prefixIcon={<X className="w-5 h-5" />}
              />
            )}
          </header>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <footer className="p-6 border-t border-outline-variant/30 flex items-center justify-end gap-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
