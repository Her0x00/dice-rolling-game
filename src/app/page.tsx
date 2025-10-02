"use client";

import { motion } from "motion/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4 flex flex-col items-center justify-center text-center">

      <motion.h1
        className="text-5xl font-bold text-white drop-shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Welcome to Yatzy!
      </motion.h1>

      {/* Description */}
      <motion.p
        className="mt-4 max-w-md text-mg text-left text-white/90 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Welcome to my Dice game! In this game you want to get the highest
        numbers possible. You can lock dice after rolling them. The goal is to
        score as much as you can!
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Link href="/game">
          <button className="mt-8 px-8 py-4 bg-blue-700 text-white rounded-2xl text-lg shadow-lg hover:bg-blue-800 transition-transform hover:scale-105">
            Start Game
          </button>
        </Link>
      </motion.div>

      {/* Example animated box */}
    </div>
  );
}
