import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface BasePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  position?: "bottomRight" | "bottomLeft";
  className?: string;
}

export function BasePopover({
  isOpen,
  onClose,
  triggerRef,
  children,
  position = "bottomRight",
  className = "",
}: BasePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverRect, setPopoverRect] = useState<{
    top: number;
    left: number;
    width: number;
    right: number;
  } | null>(null);

  // Use the custom hook for outside clicks
  useClickOutside(popoverRef, onClose, triggerRef);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopoverRect({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
        right: rect.right,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScrollOrResize = () => {
        updatePosition();
      };
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  const dynamicStyle: React.CSSProperties = {
    position: "fixed",
    top: popoverRect ? `${popoverRect.top}px` : undefined,
  };

  if (popoverRect) {
    if (position === "bottomLeft") {
      dynamicStyle.left = `${popoverRect.left}px`;
    } else {
      dynamicStyle.right = `${window.innerWidth - popoverRect.right}px`;
    }
  }

  return createPortal(
    <div
      ref={popoverRef}
      style={dynamicStyle}
      className={cn(
        "z-[200] mt-2 bg-surface-container border border-outline-variant rounded-xl shadow-2xl animate-slide-in-top min-w-[200px]",
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}
