'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { TitheFaq } from '@/types';

interface DizimoFaqProps {
  faqs?: TitheFaq[];
}

const DEFAULT_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'Existe um valor ou porcentagem obrigatória para o Dízimo?',
    answer:
      'Não. Na Igreja Católica, o dízimo não é imposto nem cobrança mercantil. A Bíblia fala em 10% como horizonte bíblico de gratidão, mas a Igreja orienta que cada família contribua de acordo com o que determinar livremente em sua consciência e capacidade financeira, de coração aberto e com alegria.',
  },
  {
    question: 'Qual a diferença entre Dízimo e a Oferta da Santa Missa?',
    answer:
      'O Dízimo é um compromisso mensal regular de pertença e corresponsabilidade com a Igreja, que sustenta as estruturas fixas da paróquia e do clero. A Oferta é uma doação espontânea realizada durante as coletas das celebrações litúrgicas para necessidades pontuais e caritativas.',
  },
  {
    question: 'Como faço para receber meu número de dizimista e os envelopes?',
    answer:
      'Ao realizar seu cadastro aqui no portal "Sou do Sagrado", a Secretaria Paroquial formaliza seu registro no sistema eclesial oficial (Theòs). Você poderá retirar seu número de dizimista e seu kit de envelopes mensais na Secretaria ou diretamente com os agentes da Pastoral do Dízimo no plantão das Santas Missas na Catedral.',
  },
  {
    question: 'Posso contribuir exclusivamente via PIX sem pegar envelope?',
    answer:
      'Sim! O PIX é totalmente integrado e aceito pela Mitra Diocesana. Muitos fiéis preferem contribuir mensalmente pelo PIX Copia & Cola oficial da Catedral pela praticidade e segurança bancária.',
  },
  {
    question: 'Moro em outro bairro ou cidade. Posso ser dizimista da Catedral?',
    answer:
      'Com certeza! A Catedral do Sagrado Coração de Jesus é a Casa Mãe de toda a Diocese de Colatina. Se você frequenta nossas celebrações ou acompanha as transmissões ao vivo e deseja apoiar esta missão, seu dízimo é acolhido com imensa gratidão e oração.',
  },
];

export function DizimoFaq({ faqs }: DizimoFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const displayFaqs = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2.5 border-b border-[var(--dash-border)] pb-4">
        <div className="w-8 h-8 rounded-lg bg-[#FFA82A]/10 text-[#FFA82A] flex items-center justify-center">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wide text-[var(--dash-text-primary)]">
            Perguntas Frequentes sobre o Dízimo
          </h2>
          <p className="text-xs text-[var(--dash-text-secondary)] font-sans">
            Orientações canônicas e pastorais para esclarecer suas dúvidas
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {displayFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className="rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--dash-surface-secondary)]/50 transition-colors min-h-[44px]"
              >
                <span className="font-cinzel text-sm sm:text-base font-bold text-[var(--dash-text-primary)]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#FFA82A] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--dash-text-secondary)] leading-relaxed font-sans border-t border-[var(--dash-border)]/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
