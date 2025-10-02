'use client';

import Image from 'next/image';
import { useMemo } from 'react';


const diceImages = [
  '/assets/dice_1.png',
  '/assets/dice_2.png',
  '/assets/dice_3.png',
  '/assets/dice_4.png',
  '/assets/dice_5.png',
  '/assets/dice_6.png'
];

interface ScoreCardProps {
  diceValues: number[];
  onScore: (category: string, score: number) => void;
}

// Named export so other files can reuse the same logic
export function getCombinedScore(diceValues: number[]) {
  // sum of all dice values; equivalent to summing category scores for 1..6
  return diceValues.reduce((sum, v) => sum + v, 0);
}

export default function ScoreCard({ diceValues, onScore }: ScoreCardProps) {
  // Calculate scores for each category
  const calculateScore = (category: string) => {
    switch (category) {
      case 'ones':
        return diceValues.filter(value => value === 1).reduce((sum, val) => sum + val, 0);
      case 'twos':
        return diceValues.filter(value => value === 2).reduce((sum, val) => sum + val, 0);
      case 'threes':
        return diceValues.filter(value => value === 3).reduce((sum, val) => sum + val, 0);
      case 'fours':
        return diceValues.filter(value => value === 4).reduce((sum, val) => sum + val, 0);
      case 'fives':
        return diceValues.filter(value => value === 5).reduce((sum, val) => sum + val, 0);
      case 'sixes':
        return diceValues.filter(value => value === 6).reduce((sum, val) => sum + val, 0);
      default:
        return 0;
    }
  };

  const categories = [
    { id: 'ones', label: 'Ettor', value: 1, image: diceImages[0] },
    { id: 'twos', label: 'tvåor', value: 2, image: diceImages[1] },
    { id: 'threes', label: 'Treor', value: 3, image: diceImages[2] },
    { id: 'fours', label: 'Fyror', value: 4, image: diceImages[3] },
    { id: 'fives', label: 'Femmor', value: 5, image: diceImages[4] },
    { id: 'sixes', label: 'Sexor', value: 6, image: diceImages[5] }
  ];

  // useMemo to avoid recalculating every render
  const totalScore = useMemo(() => getCombinedScore(diceValues), [diceValues]);

  // Check if the user has rolled (dice values are not the initial [1,2,3,4,5])
  const hasRolled = diceValues.some((value, idx) => value !== idx + 1);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Score Card</h2>
      
      <div className="space-y-3">
        {hasRolled && categories.map((category) => {
          const score = calculateScore(category.id);
          const diceCount = diceValues.filter(v => v === category.value).length;
          return (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onScore(category.id, score)}
            >
              <div className="flex items-center gap-3">
                <Image src={category.image} alt={category.label} width={32} height={32} />
                <span className="text-xl font-medium text-gray-800">{category.label}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {score > 0 ? score : '-'}
                </div>
                <div className="text-shadow-xs text-xs mt-0.5 text-gray-700">
                  {diceCount} Tärning
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Combined total score display at the bottom */}
      {hasRolled && (
        <div className="mt-6 text-center">
          <span className="text-lg font-semibold text-gray-700">
            Sammanlagt:{" "}
          </span>
          <span className="text-lg font-bold text-blue-600">{totalScore}</span>
        </div>
      )}
    </div>
  );
}