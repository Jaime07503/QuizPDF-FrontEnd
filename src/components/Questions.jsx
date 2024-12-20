import { useState, useMemo } from "react";
import CardIcon from "../assets/CardIcon";
import SummaryIcon from "../assets/SummaryIcon";
import GameIcon from "../assets/GameIcon";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Paleta de colores para las parejas
const colors = ["#B4D8C6", "#F8D7AA", "#E6953E", "#ADD8E6", "#FFC1C1", "#FFF5BA"];

export const Questions = ({ result }) => {
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [matchedColors, setMatchedColors] = useState({});

  const parseQuestions = (text = "") => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const questionsArray = [];
    for (let i = 0; i < lines.length; i += 2) {
      questionsArray.push({
        question: lines[i].trim(),
        answer: lines[i + 1]?.trim() || "Respuesta no disponible",
      });
    }
    return questionsArray;
  };

  const questionsArray = result?.questions
    ? parseQuestions(result.questions)
    : [];
  const summaryContent = result?.summary || "Resumen no disponible";

  const pairs = questionsArray.flatMap((qa) => [
    { text: qa.question, id: qa.question, isQuestion: true },
    { text: qa.answer, id: qa.question, isQuestion: false },
  ]);

  // Utilizamos useMemo para que se mezcle solo una vez al inicio
  const shuffledPairs = useMemo(() => shuffleArray([...pairs]), []);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2) return;

    if (!flippedCards.includes(index) && !matchedCards.includes(index)) {
      const newFlipped = [...flippedCards, index];
      setFlippedCards(newFlipped);

      if (newFlipped.length === 2) {
        const [firstIndex, secondIndex] = newFlipped;
        const firstCard = shuffledPairs[firstIndex];
        const secondCard = shuffledPairs[secondIndex];

        if (
          firstCard.id === secondCard.id &&
          firstCard.isQuestion !== secondCard.isQuestion
        ) {
          setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);

          // Asignar color a la pareja que hace match
          const colorIndex = Object.keys(matchedColors).length % colors.length;
          setMatchedColors((prev) => ({
            ...prev,
            [firstCard.id]: colors[colorIndex],
          }));
        }

        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isFlipped = (index) =>
    flippedCards.includes(index) || matchedCards.includes(index);

  const isMatched = (index) => matchedCards.includes(index);

  return (
    <section className="p-8 mt-6 rounded-lg shadow-lg box-border border-2 border-[#E6953E]">
      <h2 className="text-2xl text-[#E6953E] font-bold mb-4 flex justify-center items-center gap-4">
        Resumen
        <SummaryIcon />
      </h2>
      <p className="text-[#615858] text-lg text-balance font-semibold mb-6">
        {summaryContent}
      </p>

      <h2 className="text-2xl text-[#E6953E] font-bold flex items-center justify-center gap-4 mb-6">
        Juego de Memoria
        <GameIcon />
      </h2>
      <div className="w-full mt-4">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(285px,_1fr))] gap-6 px-2">
          {shuffledPairs.map((card, index) => (
            <div
              key={index}
              className={`flex justify-center items-center cursor-pointer p-2 border-t-4 border-t-transparent rounded-lg text-[#FFFA] transition-colors duration-300 ease-in-out hover:border-t-4 hover:border-t-[#615858] ${
                isFlipped(index) ? "flipped" : ""
              } ${
                isMatched(index)
                  ? `matched`
                  : ""
              } hover:border-[#FFFA]`}
              onClick={() => handleCardClick(index)}
              style={{
                backgroundColor: isMatched(index)
                  ? matchedColors[card.id]
                  : "transparent",
              }}
            >
              <div
                className={`h-[24rem] flex justify-center items-center transform ${
                  isFlipped(index) ? "rotate-y-0" : "rotate-y-180"
                } transition-transform duration-600 ease-in-out rounded-lg text-[#615858] font-semibold`}
              >
                {isFlipped(index) ? card.text : <CardIcon />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Questions;
