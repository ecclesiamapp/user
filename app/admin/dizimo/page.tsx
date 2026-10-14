import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { TitheAdminClient } from '@/components/admin/dizimo/TitheAdminClient';
import { Parish, TitheRegistration, TitheTransparencyItem, TitheFaq } from '@/types';

export const metadata = {
  title: 'Gestão do Dízimo • Painel Administrativo',
};

// Fallbacks de Transparência da Catedral
const defaultTransparency: TitheTransparencyItem[] = [
  {
    id: 'tr-1',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Restauro & Conservação da Catedral',
    tag: 'Patrimônio Sagrado',
    highlight: '100% conservada',
    description: 'Cuidado contínuo com os vitrais históricos alemães, sistema de som litúrgico, climatização da nave central e conservação da torre monumental.',
    icon_name: 'Building2',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tr-2',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Pastoral da Caridade & Pobres',
    tag: 'Ação Social Concreta',
    highlight: '+80 famílias assistidas/mês',
    description: 'Socorro imediato a famílias em vulnerabilidade em Colatina: distribuição regular de cestas básicas, medicamentos de urgência e apoio aos enfermos.',
    icon_name: 'Heart',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tr-3',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Comunhão com as 12 Capelas (CEBs)',
    tag: 'Igreja em Saída',
    highlight: '12 CEBs fortalecidas',
    description: 'Ajuda fraterna da Catedral Matriz para que as comunidades menores do interior e periferia mantenham suas capelas dignas para as Santas Missas.',
    icon_name: 'Church',
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tr-4',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Liturgia, Catequese & Vocacionados',
    tag: 'Evangelização Viva',
    highlight: 'Vida Eclesial Plena',
    description: 'Sustento da formação dos nossos seminaristas diocesanos, folhetos litúrgicos semanais, hóstias e vinho consagrados para as celebrações.',
    icon_name: 'Sparkles',
    order_index: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Fallbacks de FAQ do Dízimo
const defaultFaqs: TitheFaq[] = [
  {
    id: 'faq-1',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    question: 'Existe um valor ou porcentagem obrigatória para o Dízimo?',
    answer: 'Não. Na Igreja Católica, o dízimo não é imposto nem cobrança mercantil. A Bíblia fala em 10% como horizonte bíblico de gratidão, mas a Igreja orienta que cada família contribua de acordo com o que determinar livremente em sua consciência e capacidade financeira, de coração aberto e com alegria.',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'faq-2',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    question: 'Qual a diferença entre Dízimo e a Oferta da Santa Missa?',
    answer: 'O Dízimo é um compromisso mensal regular de pertença e corresponsabilidade com a Igreja, que sustenta as estruturas fixas da paróquia e do clero. A Oferta é uma doação espontânea realizada durante as coletas das celebrações litúrgicas para necessidades pontuais e caritativas.',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'faq-3',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    question: 'Como faço para receber meu número de dizimista e os envelopes?',
    answer: 'Ao realizar seu cadastro aqui no portal "Sou do Sagrado", a Secretaria Paroquial registrará sua ficha. Você poderá retirar seu kit de envelopes mensais na Secretaria ou diretamente com os agentes da Pastoral do Dízimo no plantão das Santas Missas na Catedral.',
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'faq-4',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    question: 'Posso contribuir exclusivamente via PIX sem pegar envelope?',
    answer: 'Sim! O PIX é totalmente integrado e aceito pela Mitra Diocesana. Muitos fiéis preferem contribuir mensalmente pelo PIX Copia & Cola oficial da Catedral pela praticidade e segurança bancária.',
    order_index: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'faq-5',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    question: 'Moro em outro bairro ou cidade. Posso ser dizimista da Catedral?',
    answer: 'Com certeza! A Catedral do Sagrado Coração de Jesus é a Casa Mãe de toda a Diocese de Colatina. Se você frequenta nossas celebrações ou acompanha as transmissões ao vivo e deseja apoiar esta missão, seu dízimo é acolhido com imensa gratidão e oração.',
    order_index: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export default async function DizimoAdminPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Buscar paróquia
  const { data: parishesData } = await supabase.from('parishes').select('*').limit(1);
  const parish: Parish = parishesData?.[0] || {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Catedral do Sagrado Coração de Jesus',
    diocese: 'Diocese de Colatina',
    slug: 'catedral-colatina',
    city: 'Colatina',
    state: 'ES',
    address: 'Praça da Catedral, s/n - Centro, Colatina/ES',
    whatsapp_number: '552737221234',
    pix_key: 'secretaria@catedraldecolatina.org.br',
    pix_key_type: 'email',
    primary_color: '#8B1E22',
    created_at: new Date().toISOString(),
  };

  // 2. Buscar adesões de dizimistas
  let registrations: TitheRegistration[] = [];
  try {
    const { data } = await supabase
      .from('tithe_registrations')
      .select('*, community:communities(*)')
      .order('created_at', { ascending: false });

    if (data) registrations = data as TitheRegistration[];
  } catch (err) {
    console.warn('Alerta busca tithe_registrations:', err);
  }

  // 3. Buscar itens de transparência
  let transparencyItems: TitheTransparencyItem[] = defaultTransparency;
  try {
    const { data } = await supabase
      .from('tithe_transparency_items')
      .select('*')
      .order('order_index', { ascending: true });

    if (data && data.length > 0) {
      transparencyItems = data as TitheTransparencyItem[];
    }
  } catch (err) {
    console.warn('Alerta busca tithe_transparency_items:', err);
  }

  // 4. Buscar FAQs
  let faqs: TitheFaq[] = defaultFaqs;
  try {
    const { data } = await supabase
      .from('tithe_faqs')
      .select('*')
      .order('order_index', { ascending: true });

    if (data && data.length > 0) {
      faqs = data as TitheFaq[];
    }
  } catch (err) {
    console.warn('Alerta busca tithe_faqs:', err);
  }

  return (
    <TitheAdminClient
      parish={parish}
      registrations={registrations}
      transparencyItems={transparencyItems}
      faqs={faqs}
    />
  );
}
