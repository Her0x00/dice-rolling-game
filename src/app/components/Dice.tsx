"use client";

import Image from "next/image";

const diceImages = [
  "/assets/dice_1.png",
  "/assets/dice_2.png",
  "/assets/dice_3.png",
  "/assets/dice_4.png",
  "/assets/dice_5.png",
  "/assets/dice_6.png"
];

interface DiceProps {
  value: number;
  locked: boolean;
  onClick: () => void;
  rolling?: boolean;
  canLock?: boolean;
}

export default function Dice({ value, locked, rolling, onClick, canLock = true }: DiceProps) {
  return (
    <div
      onClick={canLock ? onClick : undefined}
      className={`
        w-16 h-16 flex items-center justify-center rounded-xl border-4
        transition-all
        ${locked ? "border-yellow-400 shadow-yellow-300 shadow-lg" : "border-gray-300"}
        ${rolling ? "animate-spin" : ""}
        ${canLock ? "cursor-pointer" : "cursor-not-allowed opacity-35"}
        bg-white
        select-none
      `}
      style={{
        background: locked ? "#fffbe6" : "#fff",
      }}
    >
      <Image
        src={diceImages[value - 1]}
        alt={`Dice ${value}`}
        width={48}
        height={48}
        priority
      />
    </div>
  );
}