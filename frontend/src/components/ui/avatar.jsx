import { Avatar as HeroAvatar, AvatarIcon } from "@heroui/react";
import React from "react";

export function AppAvatar({ src, alt = "Avatar", size = 112, className = "" }) {
  const dimension = typeof size === "number" ? `${size}px` : size;
  return (
    <div className={`flex items-center ${className}`.trim()}>
      <HeroAvatar
        src={src}
        imgProps={{ alt }}
        classNames={{
          base: "bg-linear-to-br from-[#FFB457] to-[#FF705B] border border-[#444444]",
          icon: "text-black/80",
          img: "object-cover",
        }}
        style={{ width: dimension, height: dimension }}
        icon={<AvatarIcon />}
      />
    </div>
  );
}
