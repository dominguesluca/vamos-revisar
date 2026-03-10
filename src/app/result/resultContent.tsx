"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResultContent() {
    const searchParams = useSearchParams();
    const score = Number(searchParams.get("score")) || 0;

    let message = "";
    let emoji = "";

    if (score >= 4) {
        message = "Excelente!";
        emoji = "😄";
    } else if (score === 3) {
        message = "Você está quase lá!";
        emoji = "🙂";
    } else {
        message = "Precisa estudar mais.";
        emoji = "😕";
    }

    return (
        <main className="result-screen">
            <div className="result-box">
                <div className="result-emoji">{emoji}</div>

                <h1 className="result-title">{message}</h1>

                <p className="result-score">
                    Você acertou {score} de 5 perguntas
                </p>

                <Link href="/" className="result-button">
                    Jogar novamente
                </Link>
            </div>
        </main>
    );
}
