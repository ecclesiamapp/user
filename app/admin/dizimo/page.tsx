import React from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { TitheAdminClient } from '@/components/admin/dizimo/TitheAdminClient';
import { Parish, TitheRegistration, TitheTransparencyItem, TitheFaq } from '@/types';

export const metadata = {
  title: 'Pastoral do Dízimo • Painel Administrativo',
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
    title: 'Comunhão com as 12 Comunidades (CEBs)',
    tag: 'Igreja em Saída',
    highlight: '12 CEBs fortalecidas',
    description: 'Ajuda fraterna da Catedral Diocesana para que as comunidades menores do interior e periferia mantenham seus templos e comunidades dignas para as Santas Missas.',
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
    answer: 'Ao realizar seu cadastro aqui no portal "Sou do Sagrado", a Secretaria Paroquial formaliza seu registro no sistema eclesial oficial (Theòs). Você poderá retirar seu número de dizimista e seu kit de envelopes mensais na Secretaria ou diretamente com os agentes da Pastoral do Dízimo no plantão das Santas Missas na Catedral.',
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

// Cadastros Modelo de Dizimistas (Sou do Sagrado)
const defaultRegistrations: TitheRegistration[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    full_name: 'Maria Aparecida da Silva',
    phone: '(27) 99876-5432',
    email: 'maria.aparecida@gmail.com',
    birth_date: '1974-05-12',
    neighborhood: 'Centro',
    preferred_payment_method: 'envelope',
    preferred_day: 10,
    status: 'pendente',
    notes: 'Deseja retirar os envelopes mensais no plantão da Santa Missa das 09h na Catedral.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'a2222222-2222-2222-2222-222222222222',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    full_name: 'João Paulo Ferreira',
    phone: '(27) 99765-4321',
    email: 'joao.paulo.colatina@hotmail.com',
    birth_date: '1982-11-20',
    neighborhood: 'Honório Fraga',
    preferred_payment_method: 'pix',
    preferred_day: 5,
    status: 'pendente',
    notes: 'Contribuirá mensalmente via PIX oficial direto pelo app do banco.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: 'a3333333-3333-3333-3333-333333333333',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    full_name: 'Ana Clara Santos',
    phone: '(27) 99654-3210',
    email: 'anaclara.santos@yahoo.com.br',
    birth_date: '1995-03-08',
    neighborhood: 'Marista',
    preferred_payment_method: 'pix',
    preferred_day: 15,
    status: 'pendente',
    notes: 'Jovem atuante na comunidade assumindo o compromisso bíblico do dízimo.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: 'a4444444-4444-4444-4444-444444444444',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    full_name: 'José Carlos de Oliveira',
    phone: '(27) 99543-2109',
    email: 'jose.carlos.olv@gmail.com',
    birth_date: '1961-08-15',
    neighborhood: 'Bela Vista',
    preferred_payment_method: 'envelope',
    preferred_day: 10,
    status: 'cadastrado_theos',
    theos_code: 'TH-1042',
    notes: 'Ficha formalizada no Theòs pela secretaria. Kit de envelopes entregue.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'a5555555-5555-5555-5555-555555555555',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    full_name: 'Tereza Cristina Zanetti',
    phone: '(27) 99432-1098',
    email: 'tereza.zanetti@uol.com.br',
    birth_date: '1958-09-29',
    neighborhood: 'Esplanada',
    preferred_payment_method: 'envelope',
    preferred_day: 20,
    status: 'cadastrado_theos',
    theos_code: 'TH-0895',
    notes: 'Dizimista fiel da Catedral. Cadastro atualizado no Theòs.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'a6666666-6666-6666-6666-666666666666',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    full_name: 'Marcos Vinícius Bermudes',
    phone: '(27) 99321-0987',
    email: 'marcos.bermudes@empresa.com.br',
    birth_date: '1988-12-04',
    neighborhood: 'São Silvano',
    preferred_payment_method: 'pix',
    preferred_day: 10,
    status: 'cadastrado_theos',
    theos_code: 'TH-1120',
    notes: 'Lançado no Theòs. Contribui mensalmente no dia 10 pelo PIX da paróquia.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
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

  // 2. Buscar adesões de dizimistas (com fallback em defaultRegistrations)
  let registrations: TitheRegistration[] = defaultRegistrations;
  try {
    const { data } = await supabase
      .from('tithe_registrations')
      .select('*, community:communities(*)')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      registrations = data as TitheRegistration[];
    }
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
