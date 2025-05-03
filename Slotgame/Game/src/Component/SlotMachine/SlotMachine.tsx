import React, { useState, useEffect } from "react";

// Panda-Thema Symbole
const symbols = ["🐼", "🍃", "🎋", "🥢", "🌿", "🍪", "💩"];
const fallbackSymbols = ["Panda", "Leaf", "Bamboo", "Chopsticks", "Herb", "Cookie", "Trophy"];

// Gewinnkombinationen für das Panda-Thema
const winningCombinations: { [key: string]: number } = {
  "🐼🐼🐼": 200,
  "🍃🍃🍃": 50,
  "🎋🎋🎋": 40,
  "🥢🥢🥢": 30,
  "🌿🌿🌿": 25,
  "🍪🍪🍪": 20,
  "💩💩💩": 100,
  "🐼🎋🍃": 60,
  "🍃🥢🍪": 15,
  "🎋🐼🥢": 50,
  "🐼🎋💩":150,
  "🐼🍪💩":75,
  "🐼🌿💩":75,
  "🐼🍃💩":75,
  "🐼💩🐼":25,
  
};

// Funktion für die Übersetzungen
const translations = {
  en: {
    balance: "Balance",
    spin: "Spin 🎰",
    spinning: "Spinning...",
    autoSpin: "Auto-Spin",
    autoSpinOn: "Auto-Spin On",
    autoSpinOff: "Auto-Spin Off",
    winMessage: "You have won: $",
    noWinMessage: "Unfortunately, no win.",
    bet: "Bet",
    legend: "Show Legend",
    hideLegend: "Hide Legend",
    result: "Result",
    lastGames: "Last 5 Games",
    moreMoney: "Add More Money",
  },
  de: {
    balance: "Guthaben",
    spin: "Drehen 🎰",
    spinning: "Dreht...",
    autoSpin: "Auto-Spin",
    autoSpinOn: "Auto-Spin Aktiv",
    autoSpinOff: "Auto-Spin Aus",
    winMessage: "Du hast gewonnen: $",
    noWinMessage: "Leider kein Gewinn.",
    bet: "Wette",
    legend: "Zeige Legende",
    hideLegend: "Schließe Legende",
    result: "Ergebnis",
    lastGames: "Die letzten 5 Spiele",
    moreMoney: "Mehr Geld",
  }
};

const getSymbol = (index: number, useFallback = false) => {
  return useFallback ? fallbackSymbols[index] : symbols[index];
};

const SlotMachine: React.FC = () => {
  const [slots, setSlots] = useState<string[]>(["", "", ""]);
  const [spinning, setSpinning] = useState(false);
  const [loopSymbols, setLoopSymbols] = useState<string[]>(["", "", ""]);
  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(1);
  const [autoSpin, setAutoSpin] = useState(false);
  const [history, setHistory] = useState<string[]>([]); // Historie für alle Spiele
  const [winMessage, setWinMessage] = useState<string>("");
  const [winEffect, setWinEffect] = useState(false);

  const [showLegend, setShowLegend] = useState(false); // Zustand für Legende
  const [language, setLanguage] = useState<'en' | 'de'>('de'); // Sprachzustand

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
      alert(language === 'de' ? "Nicht genug Guthaben!" : "Not enough balance!");
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
  
  
    setTimeout(() => {
      if (winAmount) {
        const totalWin = winAmount * bet;
        setBalance((prev) => prev + totalWin);
        setWinMessage(language === 'de' ? `Du hast gewonnen: $${totalWin}!` : `You won: $${totalWin}!`);
        setHistory((prev) => [
          `${language === 'de' ? "Wette" : "Bet"}: $${bet} | ${language === 'de' ? "Gewinn" : "Win"}: $${totalWin} | ${language === 'de' ? "Kombination" : "Combination"}: ${slots.join(" | ")}`,
          ...prev,
        ]);
        setSpinning(false);
        setAutoSpin(false);
        setWinEffect(true); // Animation aktivieren
        setTimeout(() => setWinEffect(false), 1500); // Animation nach 0.5s zurücksetzen // Stoppt Auto-Spin nach einem Gewinn
      } 
      else {
        setWinMessage(language === 'de' ? "Leider kein Gewinn." : "No win.");
        setHistory((prev) => [
          `${language === 'de' ? "Wette" : "Bet"}: $${bet} | ${language === 'de' ? "Kein Gewinn" : "No Win"} | ${language === 'de' ? "Kombination" : "Combination"}: ${slots.join(" | ")}`,
          ...prev,
        ]);
      }
    }, 500); // Verzögerung nach Gewinn (länger bei Gewinn)
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

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'de' ? 'en' : 'de'));
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen select-none bg-gradient-to-br from-black via-gray-900 to-black text-white font-mono">
      <button
        onClick={toggleLanguage}
        className="absolute top-4 right-4 px-4 py-2 border border-white/30 text-white rounded-xl transition duration-300"
      >
        {language === 'de' ? 'Switch to English' : 'Wechsel zu Deutsch'}
      </button>

      <div className="top-4 left-4 text-xl font-semibold z-100">
        <div className="top-4 left-4 text-2xl justify-center p-2 font-semibold absolute text-green-400 flex items-center gap-1 drop-shadow-md">
          {balance + "x"}
          <img className="w-10 h-10" src="coin.webp" alt="coin" />
        </div>
      </div>

      <div className="text-5xl mb-12 font-extrabold mt-20 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-lg">
        🐼 Panda Slots
      </div>

      <div className="flex space-x-6 mb-12">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-28 h-28 sm:w-36 sm:h-36 border-4 rounded-2xl scale-100  flex items-center justify-center text-5xl 
    bg-black/30 backdrop-blur-md shadow-inner shadow-black transition-all duration-500 hover:scale-105
    ${winEffect ? "animate-pulse border-green-400 scale-110  shadow-[0_0_20px_#22c55e]" : "border-white/20"}`}
          >
            {loopSymbols[i] || getSymbol(i)}
          </div>
        ))}
      </div>

      <div className="flex space-x-4 mb-6">
        {[1, 5, 10, 25].map((amount) => (
          <button
            key={amount}
            onClick={() => changeBet(amount)}
            className={`px-6 py-2 border rounded-xl transition duration-300
        ${bet === amount
                ? "border-pink-500 shadow-[0_0_12px_#ec4899] text-pink-300 font-bold"
                : "border-white/30 hover:border-pink-400 hover:shadow-[0_0_12px_#ec4899]"}`
            }
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
          {autoSpin ? translations[language].autoSpinOn : translations[language].autoSpinOff}
        </button>

        <button
          onClick={startSpin}
          disabled={spinning}
          className={`px-6 py-2 border border-white/30 text-white rounded-xl transition duration-300 ${spinning
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-green-400 hover:shadow-[0_0_12px_#22c55e]"}`}
        >
          {spinning ? (language === 'de' ? "Dreht..." : "Spinning...") : (language === 'de' ? "Spin 🎰" : "Spin 🎰")}
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="text-lg font-semibold">{translations[language].result}</div>
        <div className="text-xl font-bold">{winMessage}</div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <button
          onClick={handleBank}
          className="px-6 py-2 border border-green-400 text-green-400 font-semibold rounded-xl hover:bg-green-400/20 transition duration-300"
        >
          {translations[language].moreMoney}
        </button>
      </div>

      <div className="flex items-center mb-6">
        <button
          onClick={toggleLegend}
          className="text-sm text-gray-300 underline hover:text-white transition duration-300"
        >
          {showLegend ? translations[language].hideLegend : translations[language].legend}
        </button>
      </div>

      {showLegend && (
        <div className="mb-12">
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(winningCombinations).map((combination) => (
              <div
                key={combination}
                className="flex items-center justify-between px-4 py-2 bg-black/40 border border-white/30 rounded-xl"
              >
                <div>{combination}</div>
                <div>{`$${winningCombinations[combination]}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-12">
        <div className="text-xl font-semibold mb-4">{translations[language].lastGames}</div>
        <ul className="space-y-2 text-sm text-gray-300">
          {history.slice(0, 5).map((game, index) => (
            <li key={index}>{game}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SlotMachine;
