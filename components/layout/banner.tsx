export const Banner = () => {
  return (
    <section className="w-full h-96 border border-black">
      <div className="max-w-5xl h-full m-auto flex justify-between items-center">
        <article>
          <header>
            <h1>Texto Principal</h1>
            <p>Paragrafo</p>
          </header>
        </article>
        <article>
          <header>
            <div>Imagem</div>
          </header>
        </article>
      </div>
    </section>
  );
};
