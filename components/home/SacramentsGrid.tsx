import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SacramentsGridProps {
  whatsappNumber?: string;
}

export function SacramentsGrid({ whatsappNumber = '552737221234' }: SacramentsGridProps) {
  const cleanPhone = whatsappNumber.replace(/\D/g, '');

  const services = [
    {
      icon: '🕊️',
      title: 'Santo Batismo',
      description: 'Orientações canônicas para pais e padrinhos, documentação necessária e datas das celebrações na Catedral.',
      whatsappMsg: 'Olá, gostaria de orientações sobre o Batismo na Catedral de Colatina.',
      linkText: 'Solicitar no WhatsApp',
    },
    {
      icon: '💍',
      title: 'Santo Matrimônio',
      description: 'Abertura do processo canônico matrimonial, encontro de preparação para noivos e reserva da data do casamento.',
      whatsappMsg: 'Olá, gostaria de informações sobre agendamento de Casamento e Curso de Noivos.',
      linkText: 'Falar com o setor',
    },
    {
      icon: '🕯️',
      title: 'Intenções de Missa',
      description: 'Apresente suas intenções particulares, ação de graças, saúde dos enfermos e sufrágio dos fiéis falecidos no altar.',
      whatsappMsg: 'Olá, gostaria de registrar uma Intenção de Missa na Catedral.',
      linkText: 'Enviar intenção',
    },
    {
      icon: '💬',
      title: 'Fale com o Pároco',
      description: 'Agende atendimento pastoral pessoal, direção espiritual ou pedido de bênção residencial com nossos sacerdotes.',
      whatsappMsg: 'Olá, gostaria de agendar um atendimento pastoral com o padre.',
      linkText: 'Agendar horário',
    },
  ];

  return (
    <section id="secretaria" className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#03637A]/10 text-[#03637A] text-xs font-bold uppercase tracking-[0.12em] font-sans">
            Atendimento Paroquial
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase tracking-[0.06em] text-[#2D1A16] mt-1.5">
            Sacramentos e <span className="text-[#8B1E22]">Secretaria</span>
          </h2>
        </div>
        <Link 
          href="/secretaria"
          className="text-xs sm:text-sm font-bold text-[#03637A] hover:text-[#02495A] inline-flex items-center gap-1 transition-colors font-sans uppercase tracking-wider"
        >
          <span>Acessar Balcão Digital da Secretaria</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-[#EAE3D9] p-6 shadow-sm hover:shadow-md hover:border-[#C8A463]/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#F5EFE7] border border-[#EAE3D9] flex items-center justify-center text-2xl mb-4 shadow-xs">
                {item.icon}
              </div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold uppercase tracking-wide text-[#2D1A16] mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-[#514D4B] leading-relaxed mb-4 font-sans">
                {item.description}
              </p>
            </div>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(item.whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full pt-3 border-t border-[#F2ECE3] text-xs font-bold text-[#8B1E22] hover:text-[#721C24] transition-colors"
            >
              <span>{item.linkText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
