import React from "react";

interface LogoProps {
  size?: "small" | "normal" | "large";
  color?: string;
  className?: string; //
}

export default function Logo({ size = "normal" }: LogoProps) {
  // Adaptation des tailles pour le Web
  const sizeClasses = {
    small: {
      text: "text-xl",
      emoji: "text-base",
      gap: "gap-1",
    },
    normal: {
      text: "text-3xl",
      emoji: "text-xl",
      gap: "gap-2",
    },
    large: {
      text: "text-5xl",
      emoji: "text-3xl",
      gap: "gap-3",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.gap} select-none`}>
      <span
        className={`font-black tracking-tight text-[#14B8A6] ${currentSize.text}`}
      >
        JammLine
      </span>
      <span className={`${currentSize.emoji}`}>🏥</span>
    </div>
  );
}
