"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const score = Number(searchParams.get("score") || 0);

  let message = "";
  let emoji = "";

  if (score >= 4) {
    message = "Excelente!";
    emoji = "😄";
  } else if (score <= 2) {
    message = "Precise estudar mais.";
    emoji = "😢";
  } else {
    message = "Você está quase lá.";
    emoji = "🙂";
  }

  return (
    <main className="result-screen">
      <div className="result-box">
        <div className="result-emoji">{emoji}</div>
        <h1 className="result-title">{message}</h1>
        <p className="result-score">
          Você acertou <strong>{score}</strong> de <strong>5</strong> perguntas.
        </p>

        <Link href="/" className="result-button">
          voltar ao início
        </Link>
      </div>
    </main>
  );
}