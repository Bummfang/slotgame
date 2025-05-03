import React, { useState, useEffect } from "react";

// Panda-Thema Symbole
const symbols = ["🐼", "🍃", "🎋", "🥢", "🌿", "🍪", "🏆"];
const fallbackSymbols = ["Panda", "Leaf", "Bamboo", "Chopsticks", "Herb", "Cookie", "Trophy"];

// Gewinnkombinationen für das Panda-Thema
const winningCombinations: { [key: string]: number } = {
  "🐼🐼🐼": 100,
  "🍃🍃🍃": 50,
  "🎋🎋🎋": 40,
  "🥢🥢🥢": 30,
  "🌿🌿🌿": 25,
  "🍪🍪🍪": 20,
  "🏆🏆🏆": 200,
  "🐼🎋🍃": 60,
  "🍃🥢🍪": 15,
  "🎋🐼🥢": 50,
};

const getSymbol = (index: number, useFallback = false) => {
  return useFallback ? fallbackSymbols[index] : symbols[index];
};

const SlotMachine: React.FC = () => {
  const [slots, setSlots] = useState<string[]>(["", "", ""]);
  const [spinning, setSpinning] = useState(false);
  const [loopSymbols, setLoopSymbols] = useState<string[]>(["", "", ""]);
  const [,] = useState<NodeJS.Timeout[]>([]);
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(1);
  const [autoSpin, setAutoSpin] = useState(false);
  const [history, setHistory] = useState<string[]>([]); // Historie für alle Spiele
  const [winMessage, setWinMessage] = useState<string>("");
  const [winEffect, setWinEffect] = useState(false);

  const [showLegend, setShowLegend] = useState(false); // Zustand für Legende

  const spinReel = (index: number, delay: number) => {
    let counter = Math.floor(Math.random() * symbols.length);
    let frameId: number;

    const animateReel = () => {
      setLoopSymbols((prev) => {
        const updated = [...prev];
        updated[index] = getSymbol(counter % symbols.length);
        return updated;
      });
      counter++;
      frameId = requestAnimationFrame(animateReel);
    };

    frameId = requestAnimationFrame(animateReel);

    setTimeout(() => {
      cancelAnimationFrame(frameId);
      const finalSymbol = getSymbol(Math.floor(Math.random() * symbols.length));
      setSlots((prev) => {
        const updated = [...prev];
        updated[index] = finalSymbol;
        return updated;
      });
      setLoopSymbols((prev) => {
        const updated = [...prev];
        updated[index] = finalSymbol;
        return updated;
      });
    }, delay);
  };

  const startSpin = () => {
    if (balance < bet) {
      alert("Nicht genug Guthaben!");
      return;
    }

    setSpinning(true);
    setSlots(["", "", ""]);
    setLoopSymbols(["", "", ""]);

    setBalance((prev) => prev - bet);

    spinReel(0, 1000);
    spinReel(1, 1500);
    spinReel(2, 2000);

    setTimeout(() => {
      setSpinning(false);
    }, 2100);
  };

  const calculateWin = () => {
    const combination = slots.join("");
    const winAmount = winningCombinations[combination];

    const delay = winAmount ? 1200 : 500; // Wenn Gewinn, längere Pause

    setTimeout(() => {
      if (winAmount) {
        const totalWin = winAmount * bet;
        setBalance((prev) => prev + totalWin);
        setWinMessage(`Du hast gewonnen: $${totalWin}!`);
        setHistory((prev) => [
          `Wette: $${bet} | Gewinn: $${totalWin} | Kombination: ${slots.join(" | ")}`,
          ...prev,
        ]);
        setWinEffect(true); //  Animation aktivieren
        setTimeout(() => setWinEffect(false), 1200); // Animation nach 1.2s zurücksetzen
      } else {
        setWinMessage("Leider kein Gewinn.");
        setHistory((prev) => [
          `Wette: $${bet} | Kein Gewinn | Kombination: ${slots.join(" | ")}`,
          ...prev,
        ]);
      }
    }, delay); // Verzögerung nach Gewinn (länger bei Gewinn)
  };

  const changeBet = (amount: number) => {
    setBet(amount);
  };

  const toggleAutoSpin = () => {
    setAutoSpin((prev) => !prev);
  };

  const toggleLegend = () => {
    setShowLegend((prev) => !prev); // Toggle Legende
  };

  useEffect(() => {
    if (autoSpin && !spinning) {
      const delay = setTimeout(() => {
        startSpin();
      }, 1000);
      return () => clearTimeout(delay);
    }
  }, [autoSpin, spinning]);

  useEffect(() => {
    if (slots.every((s) => s !== "")) {
      calculateWin();
    }
  }, [slots]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Spacebar") {
        startSpin();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [spinning]);

  const handleBank = () => {
    setBalance(balance + 100);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen select-none bg-gradient-to-br from-black via-gray-900 to-black text-white font-mono">
      <div className="absolute top-4 left-4 text-xl font-semibold text-white/80">
        <div className="top-4 left-4 text-2xl justify-center p-2 font-semibold absolute text-green-400 flex items-center gap-1 drop-shadow-md">
          {balance + "x"} 
          <img className="w-10 h-10" src="coin.webp" alt="coin" />
        </div>
      </div>

      <div className="text-5xl mb-12 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-lg">
        🐼 Panda Slots
      </div>

      <div className="flex space-x-6 mb-12">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-28 h-28 sm:w-36 sm:h-36 border-4 rounded-2xl flex items-center justify-center text-5xl 
    bg-black/30 backdrop-blur-md shadow-inner shadow-black transition-all duration-500 hover:scale-105
    ${winEffect ? "animate-pulse border-green-400 shadow-[0_0_20px_#22c55e]" : "border-white/20"}`}
          >
            {loopSymbols[i] || getSymbol(i)}
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mb-6">
        {[1, 5, 10,25].map((amount) => (
          <button
            key={amount}
            onClick={() => changeBet(amount)}
            className={`px-6 py-2 border rounded-xl transition duration-300
        ${bet === amount
                ? "border-pink-500 shadow-[0_0_12px_#ec4899] text-pink-300 font-bold"
                : "border-white/30 hover:border-pink-400 hover:shadow-[0_0_12px_#ec4899]"
              }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={toggleAutoSpin}
          className={`px-6 py-2 border ${autoSpin
            ? "border-yellow-400 shadow-[0_0_12px_#facc15]"
            : "border-white/30 hover:border-yellow-300 hover:shadow-[0_0_12px_#facc15]"
            } text-white rounded-xl transition duration-300`}
        >
          {autoSpin ? "Auto-Spin Aktiv" : "Auto-Spin Aus"}
        </button>

        <button
          onClick={startSpin}
          disabled={spinning}
          className={`px-6 py-2 border border-white/30 text-white rounded-xl transition duration-300 ${spinning
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-green-400 hover:shadow-[0_0_12px_#22c55e]"}`
          }
        >
          {spinning ? "Dreht..." : "Spin 🎰"}
        </button>
      </div>

      <div className="mt-2 text-lg text-yellow-400 font-semibold">{winMessage}</div>

      <div className="mt-6 text-xl text-pink-300">
        {slots.every(Boolean) && `Ergebnis: ${slots.join(" | ")}`}
      </div>

      {/* Legend Button */}
      <button
        onClick={toggleLegend}
        className="px-6 py-2 border border-white/30 text-white rounded-xl transition duration-300 mt-4"
      >
        {showLegend ? "Schließe Legende" : "Zeige Legende"}
      </button>

      {/* Gewinnkombinationen Legend */}
      {showLegend && (
        <div className="mt-4 w-full max-w-md px-4 text-sm text-white/70">
          <h3 className="font-semibold text-lg mb-2">Gewinnkombinationen:</h3>
          <ul>
            {Object.entries(winningCombinations).map(([combination, win], index) => (
              <li className="flex justify-center duration-500 items-center text-[1.4rem]" key={index}>
                {combination}: ${win}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 w-full max-w-sm px-4">
        <h2 className="font-bold text-white/70 text-sm mb-1">Die letzten 5 Spiele:</h2>
        <ul className="text-sm text-gray-400 space-y-1">
          {history.slice(0, 5).map((entry, index) => (
            <li key={index}>• {entry}</li>
          ))}
        </ul>
      </div>
      <button onClick={handleBank} className="border px-4 py-2 rounded-2xl mt-10 border-white text-white cursor-pointer hover:scale-110 duration-300 hover:border-pink-500 hover:shadow-[0_0_12px_#ec4899] hover:text-pink-300 font-bold">
        Mehr Geld
      </button>
    </div>
  );
};

export default SlotMachine;
