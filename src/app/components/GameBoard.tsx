'use client';

import { useState } from 'react';
import Dice from './Dice';
import ScoreCard from './ScoreCard';
import { saveFinalScore } from '@/lib/saveScore';

export default function GameBoard() {
  const [dice, setDice] = useState([
    { value: 1, locked: false },
    { value: 2, locked: false },
    { value: 3, locked: false },
    { value: 4, locked: false },
    { value: 5, locked: false }
  ]);

  const [rollsLeft, setRollsLeft] = useState(3);
  const [isRolling, setIsRolling] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showPopup, setShowPopup] = useState(false);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const [lastTotal, setLastTotal] = useState<number | null>(null);

  const hasRolled = dice.some((die, idx) => die.value !== idx + 1);
  const [isSaving, setIsSaving] = useState(false);


  const rollDice = () => {
    if (rollsLeft > 0) {
      setIsRolling(true);

      setTimeout(() => {
        setDice(prevDice =>
          prevDice.map(die =>
            die.locked ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 }
          )
        );

        setRollsLeft(prev => {
          const newRolls = prev - 1;
          if (newRolls === 0) {
            const diceValues = dice.map(d => d.value).reduce((s, v) => s + v, 0);
            const categoryTotal = Object.values(scores).reduce((s, v) => s + (v || 0), 0);
            setLastTotal(categoryTotal > 0 ? categoryTotal : diceValues);
            setShowPopup(true);
          }
          return newRolls;
        });

        setIsRolling(false);
      }, 1000);
    }
  };

  const toggleLock = (index: number) => {
    setDice(prevDice =>
      prevDice.map((die, i) =>
        i === index ? { ...die, locked: !die.locked } : die
      )
    );
  };

  const resetGame = () => {
    setDice([
      { value: 1, locked: false },
      { value: 2, locked: false },
      { value: 3, locked: false },
      { value: 4, locked: false },
      { value: 5, locked: false }
    ]);
    setRollsLeft(3);
    setIsRolling(false);
    setScores({});
    setShowPopup(false);
    setShowSavedPopup(false);
    setLastTotal(null);
  };

  const handleScore = (category: string, score: number) => {
    const newScores = { ...scores, [category]: score };
    setScores(newScores);
  };

  const handleSaveGame = async () => {
  if (isSaving || lastTotal === null || playerName.trim() === "") return;

  setIsSaving(true); // disable button immediately

  try {
    await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: playerName.trim(), score: lastTotal }),
    });

    setShowPopup(false);
    setShowSavedPopup(true);
  } catch (err) {
    console.error("Failed to save score:", err);
  } finally {
    setIsSaving(false); // re-enable button after request finishes
  }
};




  const diceValues = dice.map(die => die.value);
  const [playerName, setPlayerName] = useState("Player1");

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4 flex items-center justify-center">
      <div
        className={
          hasRolled
            ? "max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 w-full"
            : "flex justify-center items-center w-full max-w-4xl mx-auto"
        }
      >
        {/* Left Side - Dice and Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Dice Game
          </h1>

          {/* Dice Container */}
          <div className="flex justify-center gap-2 mb-4">
            {dice.map((die, index) => (
              <Dice
                key={index}
                value={die.value}
                locked={die.locked}
                rolling={isRolling && !die.locked}
                onClick={() => {
                  if (hasRolled) toggleLock(index);
                }}
                canLock={hasRolled}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="text-center space-y-4 flex flex-col items-center">
            <button
              onClick={rollDice}
              disabled={isRolling || rollsLeft === 0}
              className={`
                w-56 px-8 py-3 rounded-lg font-bold text-lg transition-all
                ${rollsLeft > 0 && !isRolling
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }
              `}
            >
              {isRolling ? 'Rolling...' : `Roll Dice (${rollsLeft} left)`}
            </button>
          </div>

          {/* Game Info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold flex justify-center text-gray-800 mb-2">Rolls remaining rolls: {rollsLeft}</h3>
          </div>
        </div>

        {hasRolled && (
          <ScoreCard 
            diceValues={diceValues}
            onScore={handleScore}
          />
        )}
      </div>
        
      {/* Popup Modal: No Rolls Left */}
      {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center space-y-4">
      <h2 className="text-xl font-bold text-gray-800">No Rolls Left!</h2>
      <p className="text-gray-600">Your combined score: <span className="font-bold text-blue-600">{lastTotal}</span></p>

      {/* Player name input */}
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-gray-800"
      />

      <div className="flex gap-4 justify-center mt-4">
        <button
  onClick={handleSaveGame}
  disabled={isSaving}
  className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold ${
    isSaving ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  {isSaving ? "Saving..." : "Save Game"}
</button>

        <button
          onClick={() => resetGame()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Restart
        </button>
      </div>
    </div>
  </div>
)}


      {/* Popup Modal: Saved Confirmation */}
      {showSavedPopup && (
        console.log("game saved", lastTotal),
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-72 text-center space-y-4">
            <h2 className="text-lg font-bold text-gray-800">Game Saved!</h2>
            <p className="text-gray-600">Your score was saved.</p>

            {/* NEW: show the saved score */}
            <p className="text-gray-700">
              Saved score: <span className="font-bold text-blue-600">{lastTotal ?? 0}</span>
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  resetGame();
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
