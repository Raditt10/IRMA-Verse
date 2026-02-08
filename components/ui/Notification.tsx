"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface CartoonNotificationProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // ms, 0 = don't auto-close
  onClose?: () => void;
}

const CartoonNotification = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: CartoonNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
      accentColor: "bg-emerald-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-300",
      icon: XCircle,
      iconColor: "text-red-600",
      accentColor: "bg-red-500",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      icon: AlertCircle,
      iconColor: "text-amber-600",
      accentColor: "bg-amber-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-300",
      icon: Info,
      iconColor: "text-blue-600",
      accentColor: "bg-blue-500",
    },
  };

  const style = typeStyles[type];
  const Icon = style.icon;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm animate-in slide-in-from-right-10 fade-in-0">
      <div
        className={`
          ${style.bg} ${style.border}
          rounded-xl border-2 p-4 shadow-lg
          font-comic-sans
          relative overflow-hidden
        `}
      >
        {/* Cartoon top border accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${style.accentColor}`}></div>

        <div className="flex gap-3">
          <div className={`shrink-0 ${style.iconColor}`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">{title}</h3>
            <p className="text-xs opacity-90 mt-1">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onClose?.();
            }}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartoonNotification;
