"use client";
import { Eye, Edit, Trash2 } from "lucide-react";

interface DetailButtonProps {
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  label?: string;
  editLabel?: string;
  deleteLabel?: string;
  className?: string;
  role?: "instruktur" | "admin" | "member" | null;
}

export default function DetailButton({ 
  onClick, 
  onEdit,
  onDelete,
  label = "Lihat Detail",
  editLabel = "Edit",
  deleteLabel = "Hapus",
  className = "",
  role,
}: DetailButtonProps) {
  const isInstructor = role === "instruktur" || role === "admin";

  // Instruktur/Admin: tampil dua button (Detail + Edit) + icon delete
  if (isInstructor && onEdit && onClick) {
    return (
      <div className="flex gap-3">
        <button
          onClick={onClick}
          className={`flex-1 py-3 rounded-xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn ${className}`}
        >
          <Eye className="w-4 h-4" /> {label}
        </button>
        <button
          onClick={onEdit}
          className={`flex-1 py-3 rounded-xl bg-emerald-400 text-white font-black border-2 border-emerald-600 border-b-4 hover:bg-emerald-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn ${className}`}
        >
          <Edit className="w-4 h-4" /> {editLabel}
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className={`py-3 px-4 rounded-xl bg-red-500 text-white font-black border-2 border-red-600 border-b-4 hover:bg-red-600 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center group/btn ${className}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  // Member: tampil Detail button saja
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-xl bg-teal-400 text-white font-black border-2 border-teal-600 border-b-4 hover:bg-teal-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn ${className}`}
    >
      <Eye className="w-4 h-4" /> {label}
    </button>
  );
}
