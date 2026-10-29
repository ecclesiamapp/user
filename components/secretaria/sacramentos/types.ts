import { SacramentType, ApplicantRole } from '@/types';
import { 
  Baby, 
  BookOpen, 
  Flame, 
  HeartHandshake, 
  Heart, 
  Sparkles,
  FileText
} from 'lucide-react';

export interface SacramentConfig {
  type: SacramentType;
  title: string;
  badge: string;
  subtitle: string;
  icon: React.ElementType;
  accentColor: string;
  minAgeNotice?: string;
  requiredDocuments: string[];
  canonicalGuidelines: string[];
}

export const SACRAMENTS_CONFIG: Record<SacramentType, SacramentConfig> = {
  batismo: {
    type: 'batismo',
    title: 'Batismo Infantil',
    badge: 'Porta da Fé',
    subtitle: 'Para crianças de 0 a 7 anos incompletos na Catedral ou Comunidades',
    icon: Baby,
    accentColor: '#3B82F6',
    minAgeNotice: 'Crianças a partir de 7 anos devem ser inscritas na Catequese Infantil.',
    requiredDocuments: [
      'Certidão de Nascimento da criança',
      'Comprovante de residência dos pais (na área paroquial)',
      'Certidão de Casamento Religioso dos padrinhos (ou declaração de crismados se solteiros)',
      'Comprovante de participação no Encontro de Preparação para o Batismo dos pais e padrinhos'
    ],
    canonicalGuidelines: [
      'Padrinhos devem ser católicos crismados, com no mínimo 16 anos completos.',
      'Se casados, os padrinhos devem ter o Sacramento do Matrimônio na Igreja Católica.',
      'É permitido um padrinho e uma madrinha, ou apenas um padrinho/madrinha.',
    ]
  },
  eucaristia: {
    type: 'eucaristia',
    title: 'Primeira Eucaristia',
    badge: 'Iniciação Cristã',
    subtitle: 'Catequese com crianças a partir de 8/9 anos de idade',
    icon: BookOpen,
    accentColor: '#10B981',
    minAgeNotice: 'Idade mínima canônica de 8 anos ou cursando o 3º ano do Ensino Fundamental.',
    requiredDocuments: [
      'Lembrança ou Certidão de Batismo da criança (se já batizada)',
      'Certidão de Nascimento ou RG da criança',
      'Documento de identidade do pai, mãe ou responsável legal',
      'Comprovante de residência'
    ],
    canonicalGuidelines: [
      'Caso a criança ainda não seja batizada, ela será preparada durante a catequese para receber o Batismo.',
      'Encontros semanais na Catedral ou na Comunidade escolhida.',
      'Participação dos pais nos encontros formativos da Pastoral Catequética.'
    ]
  },
  crisma: {
    type: 'crisma',
    title: 'Crisma (Confirmação)',
    badge: 'Dons do Espírito',
    subtitle: 'Para jovens (a partir de 14 anos) e adultos',
    icon: Flame,
    accentColor: '#EF4444',
    minAgeNotice: 'Idade mínima de 14 anos para turma juvenil. Turmas especiais para adultos.',
    requiredDocuments: [
      'Certidão de Batismo e Lembrança de 1ª Eucaristia do crismando',
      'Documento com foto (RG/CNH)',
      'Comprovante de residência',
      'Comprovante de Crisma do padrinho/madrinha escolhido(a)'
    ],
    canonicalGuidelines: [
      'O padrinho ou madrinha de Crisma deve ser católico crismado e viver em comunhão com a fé.',
      'Adultos sem batismo ou primeira comunhão farão o itinerário de Catecumenato de Adultos.'
    ]
  },
  noivos: {
    type: 'noivos',
    title: 'Curso de Noivos (Matrimônio)',
    badge: 'Sacramento do Amor',
    subtitle: 'Encontro de preparação para casais com casamento marcado ou planejando',
    icon: HeartHandshake,
    accentColor: '#F59E0B',
    minAgeNotice: 'Recomenda-se realizar o encontro entre 6 meses e 1 ano antes da data do casamento.',
    requiredDocuments: [
      'RG e CPF de ambos os noivos',
      'Comprovante de residência dos dois',
      'Certidão de Batismo recente para fins matrimoniais (emitida há menos de 6 meses)',
      'Data e local previstos da celebração (se já definidos)'
    ],
    canonicalGuidelines: [
      'O Processo de Habilitação Matrimonial deve ser aberto na secretaria com antecedência mínima de 90 dias.',
      'A certidão de batismo para fins matrimoniais deve ser solicitada na paróquia onde cada um foi batizado.'
    ]
  },
  gestantes: {
    type: 'gestantes',
    title: 'Curso de Gestantes',
    badge: 'Acolhimento à Vida',
    subtitle: 'Acompanhamento pastoral e formativo para futuras mamães e famílias',
    icon: Heart,
    accentColor: '#EC4899',
    requiredDocuments: [
      'Documento de identidade da gestante',
      'Cartão da gestante ou comprovante do pré-natal',
      'Comprovante de residência'
    ],
    canonicalGuidelines: [
      'Aberto a gestantes em qualquer fase da gravidez com seus companheiros ou acompanhantes.',
      'Orientação sobre cuidados espirituais do recém-nascido e preparação para a paternidade responsável.'
    ]
  },
  outro: {
    type: 'outro',
    title: 'Outra Inscrição Pastoral',
    badge: 'Secretaria Geral',
    subtitle: 'Outras solicitações de sacramentos e bênçãos especiais',
    icon: FileText,
    accentColor: '#8B1E22',
    requiredDocuments: [
      'Documento de identificação com foto',
      'Comprovante de residência'
    ],
    canonicalGuidelines: [
      'A equipe da secretaria entrará em contato para detalhar os requisitos do atendimento.'
    ]
  }
};
