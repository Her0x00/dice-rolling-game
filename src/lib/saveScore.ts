export async function saveFinalScore(player: string, score: number) {
  try {
    const res = await fetch("/api/save-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player, score }),
    });

    if (!res.ok) {
      console.error("Failed to save score:", await res.json());
    } else {
      console.log("Score saved!");
    }
  } catch (err) {
    console.error("Error saving score:", err);
  }
}
