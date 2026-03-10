"use client";

import { Suspense } from "react";
import ResultContent from "./resultContent";

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}
