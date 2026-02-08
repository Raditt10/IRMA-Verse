"use client";
import { Edit } from "lucide-react";

interface EditButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export default function EditButton({ 
  onClick, 
  label = "Edit",
  className = ""
}: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-xl bg-emerald-400 text-white font-black border-2 border-emerald-600 border-b-4 hover:bg-emerald-500 active:border-b-2 active:translate-y-[2px] transition-all flex items-center justify-center gap-2 group/btn ${className}`}
    >
      <Edit className="w-4 h-4" /> {label}
    </button>
  );
}
