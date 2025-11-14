import { Star } from "lucide-react";

export const ReviewsSection = () => {
  const reviews = [
    {
      name: "Carlos Antônio",
      date: "24/09/2025",
      rating: 5,
      comment:
        "A RC Soluções tem sido um grande aliado no dia a dia do nosso escritório. Sempre encontramos tudo o que precisamos e a entrega é extremamente rápida. ",
    },
    {
      name: "Ana Paula Ribeiro",
      date: "12/10/2025",
      rating: 5,
      comment:
        "Compro material de limpeza mensalmente e nunca tive nenhum problema.",
    },
    {
      name: "Marcos Vinícius da Silva",
      date: "28/12/2024",
      rating: 5,
      comment:
        "Os produtos são de excelente qualidade e o preço é muito justo. Recomendo de olhos fechados para qualquer empresa que queira praticidade.",
    },
    {
      name: "Juliana Matos",
      date: "05/01/2025",
      rating: 5,
      comment:
        "A RC Soluções tem sido um grande aliado no dia a dia do nosso escritório. Sempre encontramos tudo o que precisamos e a entrega é extremamente rápida. ",
    },
    {
      name: "Ricardo Albuquerque",
      date: "18/12/2024",
      rating: 4,
      comment:
        "O atendimento é muito atencioso e eficiente, o que nos dá muita segurança em comprar sempre.",
    },
    {
      name: "Cláudia Fernandes",
      date: "09/01/2025",
      rating: 5,
      comment:
        "A qualidade do atendimento me surpreendeu. Precisei de ajuda para montar uma lista de itens e fui atendida com muita paciência. Além disso, os produtos chegaram muito bem embalados.",
    },
  ];

  return (
    <>
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Avaliações e depoimentos de Clientes
            </h2>
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="fill-yellow-400 text-yellow-400"
                  size={32}
                />
              ))}
            </div>
            <p className="text-xl text-gray-700">
              Veja o que estão falando sobre a nossa empresa
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-gray-800">
                  {review.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="fill-yellow-400 text-yellow-400"
                      size={16}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
