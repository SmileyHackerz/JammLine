import React, { useEffect } from "react";
import {
  X,
  Bell,
  Check,
  Trash2,
  Info,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useApp } from "@monprojet/shared";

export default function NotificationsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { notifications, markAllNotificationsRead, markNotificationRead } =
    useApp();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-h-[80vh] md:max-w-md rounded-t-[32px] md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell size={20} className="text-teal-500" /> Notifications
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-20 text-center text-gray-400 italic">
              Aucune notification
            </div>
          ) : (
            notifications.map((n: any) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${!n.read ? "bg-teal-50 border-teal-100 shadow-sm" : "bg-white border-gray-100 opacity-60"}`}
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.type === "success" ? "bg-emerald-500" : n.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`}
                  />
                  <p
                    className={`text-sm leading-tight ${!n.read ? "text-gray-900 font-bold" : "text-gray-500"}`}
                  >
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={markAllNotificationsRead}
            className="w-full py-3 text-teal-600 font-bold text-sm hover:bg-teal-50 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} /> Tout marquer comme lu
          </button>
        </div>
      </div>
    </div>
  );
}
