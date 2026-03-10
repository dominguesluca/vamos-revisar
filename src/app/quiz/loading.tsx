export default function LoadingQuiz() {
    return (
      <main className="loading-screen">
        <div className="loading-box">
          <div className="loading-spinner" />
          <h1 className="loading-title">Carregando quiz...</h1>
          <p className="loading-text">Preparando sua revisão de biologia</p>
        </div>
      </main>
    );
  }