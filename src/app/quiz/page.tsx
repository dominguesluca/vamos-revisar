"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/src/data/questions";

type AnswerType = "true" | "false" | "dontknow" | null;
type FeedbackType = "correct" | "wrong" | "dontknow" | "timeout" | null;

const QUESTION_TIME = 15;
const DELAY_NEXT_QUESTION = 1200;

export default function QuizPage() {
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerType>(null);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const currentQuestion = questions[currentQuestionIndex];

  function goToNextQuestion(finalScore: number) {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      setTimeLeft(QUESTION_TIME);
    } else {
      router.push(`/result?score=${finalScore}`);
    }
  }

  function handleAnswer(answer: "true" | "false" | "dontknow") {
    if (feedback !== null) return;

    setSelectedAnswer(answer);

    if (answer === "dontknow") {
      setFeedback("dontknow");

      setTimeout(() => {
        goToNextQuestion(score);
      }, DELAY_NEXT_QUESTION);

      return;
    }

    const answerBoolean = answer === "true";
    const isCorrect = answerBoolean === currentQuestion.correct;

    if (isCorrect) {
      const updatedScore = score + 1;
      setScore(updatedScore);
      setFeedback("correct");

      setTimeout(() => {
        goToNextQuestion(updatedScore);
      }, DELAY_NEXT_QUESTION);
    } else {
      setFeedback("wrong");

      setTimeout(() => {
        goToNextQuestion(score);
      }, DELAY_NEXT_QUESTION);
    }
  }

  useEffect(() => {
    if (feedback !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          setFeedback("timeout");

          setTimeout(() => {
            goToNextQuestion(score);
          }, DELAY_NEXT_QUESTION);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [feedback, score, currentQuestionIndex]);

  const getTrueButtonClass = () => {
    if (feedback === null) return "quiz-button";

    if (selectedAnswer === "true") {
      return feedback === "correct"
        ? "quiz-button button-correct"
        : "quiz-button button-wrong";
    }

    return "quiz-button button-dimmed";
  };

  const getFalseButtonClass = () => {
    if (feedback === null) return "quiz-button";

    if (selectedAnswer === "false") {
      return feedback === "correct"
        ? "quiz-button button-correct"
        : "quiz-button button-wrong";
    }

    return "quiz-button button-dimmed";
  };

  const getDontKnowButtonClass = () => {
    if (feedback === null) return "quiz-button";

    if (selectedAnswer === "dontknow") {
      return "quiz-button button-opaque";
    }

    return "quiz-button button-dimmed";
  };

  return (
    <main className="quiz-screen">
      <div className="quiz-topbar">
        <span className="quiz-progress">
          Pergunta {currentQuestionIndex + 1} de {questions.length}
        </span>

        <span className="quiz-timer">{timeLeft}s</span>
      </div>

      <section className="quiz-main">
        <h1 className="quiz-question">{currentQuestion.question}</h1>

        <div className="quiz-image-area">
          <img
            src={currentQuestion.image}
            alt={`Pergunta ${currentQuestionIndex + 1}`}
            className="quiz-image"
          />
        </div>
      </section>

      {feedback === "correct" && (
        <p className="quiz-feedback success">Resposta correta!</p>
      )}

      {feedback === "wrong" && (
        <p className="quiz-feedback error">Resposta incorreta!</p>
      )}

      {feedback === "dontknow" && (
        <p className="quiz-feedback neutral">Tudo bem, vamos para a próxima.</p>
      )}

      {feedback === "timeout" && (
        <p className="quiz-feedback neutral">Tempo esgotado.</p>
      )}

      <section className="quiz-actions">
        <button
          className={getTrueButtonClass()}
          onClick={() => handleAnswer("true")}
        >
          Verdadeiro
        </button>

        <button
          className={getFalseButtonClass()}
          onClick={() => handleAnswer("false")}
        >
          Falso
        </button>

        <button
          className={getDontKnowButtonClass()}
          onClick={() => handleAnswer("dontknow")}
        >
          Não sei
        </button>
      </section>
    </main>
  );
}