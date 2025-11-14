"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Mail,
  Shield,
  AlertCircle,
  ExternalLink,
  Copyright,
} from "lucide-react";
import Image from "next/image";

export default function Page() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    alert("Termos aceitos com sucesso!");
    console.log("Usuário aceitou os termos em:", new Date().toISOString());
  };

  return (
    <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              width={80}
              height={80}
              src="/assets/images/logo-tipo-light.png"
              alt="Logo"
            />
          </div>
          <p className="text-gray-600 text-lg">
            Termos de Uso e Política de Navegação
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-t-4 border-indigo-600">
          <CardHeader className="rom-indigo-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <CardTitle className="text-2xl">Termos de Uso</CardTitle>
            </div>
            <p className="text-indigo-100 text-sm mt-2">
              Última atualização: 2025
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-gray-700 leading-relaxed">
                Bem-vindo ao site da <strong>RC Soluções</strong>. Ao acessar
                nossos conteúdos, você concorda com os seguintes Termos de Uso.
                Caso não concorde, recomendamos que não continue a navegação.
              </p>
            </div>

            <ScrollArea className="h-96 pr-4">
              <div className="space-y-8">
                {/* Seção 1 */}
                <section>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                      <span className="text-indigo-600 font-bold">1</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3">
                        Uso do Site
                      </h2>
                      <p className="text-gray-700 mb-3">
                        O usuário se compromete a:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span className="text-gray-700">
                            Utilizar o site de forma lícita e responsável
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span className="text-gray-700">
                            Não tentar acessar áreas restritas ou sistemas
                            internos
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span className="text-gray-700">
                            Não utilizar o site para distribuir vírus, spam ou
                            conteúdo malicioso
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <div className="border-t border-gray-200"></div>

                {/* Seção 2 */}
                <section>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                      <span className="text-indigo-600 font-bold">2</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Copyright className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">
                          Propriedade Intelectual
                        </h2>
                      </div>
                      <p className="text-gray-700">
                        Todo o conteúdo deste site, incluindo textos, imagens,
                        logos, gráficos e layout, é de propriedade da{" "}
                        <strong>RC Soluções</strong> e protegido por direitos
                        autorais. É proibido copiar, distribuir ou reproduzir
                        qualquer parte sem autorização prévia.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="border-t border-gray-200"></div>

                {/* Seção 3 */}
                <section>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                      <span className="text-indigo-600 font-bold">3</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3">
                        Informações de Produtos
                      </h2>
                      <p className="text-gray-700">
                        As descrições, preços e disponibilidade podem mudar sem
                        aviso prévio. A <strong>RC Soluções</strong> se reserva
                        o direito de corrigir qualquer erro antes, durante ou
                        após a realização de pedidos.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="border-t border-gray-200"></div>

                {/* Seção 4 */}
                <section>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                      <span className="text-indigo-600 font-bold">4</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ExternalLink className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">
                          Links Externos
                        </h2>
                      </div>
                      <p className="text-gray-700">
                        Este site pode apresentar links para páginas de
                        terceiros. Não nos responsabilizamos pelo conteúdo
                        externo ou danos decorrentes de seu uso.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="border-t border-gray-200"></div>

                {/* Seção 5 */}
                <section>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                      <span className="text-indigo-600 font-bold">5</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">
                          Limitação de Responsabilidade
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-3">
                        A <strong>RC Soluções</strong> não se responsabiliza
                        por:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span className="text-gray-700">
                            Quaisquer danos causados pelo uso do site
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span className="text-gray-700">
                            Interrupções temporárias
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">•</span>
                          <span className="text-gray-700">
                            Informações incorretas publicadas por erro humano ou
                            técnico
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                <div className="border-t border-gray-200"></div>

                {/* Seção 6 */}
                <section>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                      <span className="text-indigo-600 font-bold">6</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Mail className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">
                          Contato
                        </h2>
                      </div>
                      <p className="text-gray-700 mb-3">
                        Para dúvidas ou solicitações sobre estes Termos, entre
                        em contato:
                      </p>
                      <a
                        href="mailto:contato@rcsolucoes.com.br"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        contato@rcsolucoes.com.br
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </ScrollArea>

            {/* Acceptance Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Ao marcar a caixa abaixo e clicar em Aceitar Termos, você
                  declara ter lido, compreendido e concordado com todos os
                  termos de uso apresentados.
                </p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  id="accept-terms"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked === true)}
                />
                <label
                  htmlFor="accept-terms"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Li e concordo com os Termos de Uso
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAccept}
                  disabled={!accepted}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Aceitar Termos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  Voltar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2025 RC Soluções. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
