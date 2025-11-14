export default function Page() {
  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Aviso Legal</h1>
        <div className="prose max-w-none">
          <h2>Última atualização: 2025</h2>
          <p>
            As informações contidas neste site têm caráter informativo e
            comercial. Apesar de buscarmos manter os conteúdos sempre
            atualizados, podem ocorrer erros, atrasos ou informações incorretas.
            A RC Soluções não se responsabiliza por:
          </p>
          <ul className="list-disc list-inside">
            <li>Uso indevido das informações do site</li>
            <li>Interpretações equivocadas de conteúdos</li>
            <li>
              Danos diretos ou indiretos decorrentes da utilização das
              informações aqui apresentadas
            </li>
            <li>Disponibilidade contínua do site</li>
          </ul>

          <p>
            As imagens de produtos exibidas podem não representar exatamente o
            item entregue, devido as imagens serem meramente ilustrativa e as
            variações de lote ou atualizações de fornecedores.
          </p>
        </div>
      </div>
    </>
  );
}
