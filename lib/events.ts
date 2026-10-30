import { ParishSpecialEvent, ParishEventDay } from '@/types';

export {
  EVENT_COLOR_PRESETS,
  getEventTheme,
  type EventThemeConfig,
  type ResolvedEventTheme,
} from './eventThemes';

export const FALLBACK_SPECIAL_EVENTS: ParishSpecialEvent[] = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    parish_id: 'c0000000-0000-0000-0000-000000000001',
    title: 'Festa da Co-Padroeira 2026',
    slug: 'festa-copadroeira-2026',
    event_type: 'copadroeira',
    theme: 'Com Maria, peregrinos da oração e da esperança',
    motto: 'Fazei tudo o que Ele vos disser (Jo 2,5)',
    description: 'A Catedral de Colatina convida todos os fiéis, pastorais, movimentos e as 12 Comunidades Eclesiais de Base para celebrarem com piedade o Tríduo e a Solenidade da Co-Padroeira da nossa paróquia.',
    start_date: '2026-11-20',
    end_date: '2026-11-22',
    banner_url: '/images/festas/copadroeira-nossa-senhora-das-gracas.webp',
    poster_pdf_url: null,
    is_featured_home: true,
    status: 'destaque_ativo',
    color_preset: 'mariano',
    primary_color: '#0E4A80',
    secondary_color: '#FDCA87',
    accent_color: '#FAF6F0',
    community_name: 'Catedral Sagrado Coração de Jesus (Sede)',
  },
];

export const FALLBACK_EVENT_DAYS: Record<string, ParishEventDay[]> = {
  'festa-copadroeira-2026': [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      event_id: 'e0000000-0000-0000-0000-000000000001',
      event_date: '2026-11-20',
      day_title: '1º Dia do Tríduo • Noite Mariana & das Famílias',
      day_subtitle: 'Oração pela santificação dos lares e pelas vocações matrimoniais',
      liturgical_color: 'branco',
      celebrant_name: 'Pe. Irineu Claudino Sales (Pároco)',
      responsible_group: 'Liturgia: Pastoral Familiar e Encontro de Casais com Cristo (ECC)',
      gesture_of_charity: 'Doação de 1kg de arroz ou feijão para a Cáritas Diocesana',
      social_attractions: 'Barracas de pastéis, doces artesanais, caldo de cana e quermesse paroquial',
      order_index: 1,
      schedule_items: [
        { time: '18:30', title: 'Santo Terço Luminoso com os Homens', location: 'Presbitério da Catedral' },
        { time: '19:30', title: 'Santa Missa Solene de Abertura', location: 'Catedral Diocesana', celebrant: 'Pe. Irineu Claudino Sales' },
        { time: '20:45', title: 'Abertura das Barracas e Noite dos Caldos', location: 'Pátio Paroquial' }
      ]
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      event_id: 'e0000000-0000-0000-0000-000000000001',
      event_date: '2026-11-21',
      day_title: '2º Dia do Tríduo • Noite da Juventude & Catequese',
      day_subtitle: 'Maria, modelo de escuta e docilidade ao Espírito Santo',
      liturgical_color: 'branco',
      celebrant_name: 'Pe. Vigário Paroquial & Convidados',
      responsible_group: 'Liturgia: Pastoral da Juventude, Crisma e Catequese Paroquial',
      gesture_of_charity: 'Doação de leite em pó ou óleo vegetal para as famílias assistidas pelos Vicentinos',
      social_attractions: 'Show acústico com músicos católicos da diocese e barracas de lanches',
      order_index: 2,
      schedule_items: [
        { time: '18:45', title: 'Ofício de Nossa Senhora Cantado', location: 'Catedral Diocesana' },
        { time: '19:30', title: 'Santa Missa com Envio dos Jovens e Crismanos', location: 'Catedral Diocesana' },
        { time: '21:00', title: 'Apresentação Musical e Praça de Alimentação', location: 'Pátio da Catedral' }
      ]
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      event_id: 'e0000000-0000-0000-0000-000000000001',
      event_date: '2026-11-22',
      day_title: 'Dia Festivo • Solenidade da Co-Padroeira',
      day_subtitle: 'Caminhada solene com o andor e consagração solene da paróquia',
      liturgical_color: 'branco',
      celebrant_name: 'Dom Lauro Sérgio Versiani Barbosa (Bispo Diocesano) e Padres',
      responsible_group: 'Liturgia Geral com representantes de todas as 12 CEBs',
      gesture_of_charity: 'Cesta básica ou fraldas geriátricas para o Lar dos Idosos',
      social_attractions: 'Grande almoço festivo comunitário, leilão de prendas e sorteio beneficente',
      order_index: 3,
      schedule_items: [
        { time: '07:00', title: 'Santa Missa da Aurora', location: 'Catedral Diocesana' },
        { time: '10:00', title: 'Santa Missa com as Crianças e Coroação de Nossa Senhora', location: 'Catedral Diocesana' },
        { time: '17:30', title: 'Procissão Solene pelas ruas do Centro com o Andor', location: 'Saída da Praça da Catedral' },
        { time: '18:30', title: 'Santa Missa Pontifical Solene presidida pelo Bispo Diocesano', location: 'Catedral Diocesana', celebrant: 'Dom Lauro Sérgio Versiani Barbosa' },
        { time: '20:15', title: 'Bênção do Santíssimo e Encerramento com Cantina Festiva', location: 'Pátio Paroquial' }
      ]
    }
  ]
};

export function formatEventDateRange(startDateStr: string, endDateStr?: string | null): string {
  if (!startDateStr) return '';
  const parseParts = (d: string) => {
    const [year, month, day] = d.split('-');
    return { day, month, year };
  };

  const start = parseParts(startDateStr);
  const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const monthName = MONTHS[parseInt(start.month, 10) - 1] || start.month;

  if (!endDateStr || endDateStr === startDateStr) {
    return `${start.day} de ${monthName} de ${start.year}`;
  }

  const end = parseParts(endDateStr);
  if (start.month === end.month && start.year === end.year) {
    return `${start.day} a ${end.day} de ${monthName} de ${start.year}`;
  }

  const endMonthName = MONTHS[parseInt(end.month, 10) - 1] || end.month;
  return `${start.day} de ${monthName} a ${end.day} de ${endMonthName} de ${end.year}`;
}

export function formatDayDisplay(dateStr: string): { dayNumber: string; weekday: string; monthShort: string } {
  if (!dateStr) return { dayNumber: '', weekday: '', monthShort: '' };
  const [year, month, day] = dateStr.split('-');
  const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  const weekday = WEEKDAYS[dateObj.getDay()] || '';
  const monthShort = MONTHS_SHORT[parseInt(month, 10) - 1] || '';

  return {
    dayNumber: day,
    weekday,
    monthShort,
  };
}

export function generateWhatsAppShareText(event: ParishSpecialEvent, url: string): string {
  const dates = formatEventDateRange(event.start_date, event.end_date);
  const location = event.community_name || 'Catedral Sagrado Coração de Jesus';
  
  let text = `🕊️ *${event.title.toUpperCase()}*\n`;
  if (event.theme) {
    text += `📖 _"${event.theme}"_\n`;
  }
  text += `📅 *Quando:* ${dates}\n`;
  text += `📍 *Onde:* ${location}\n\n`;
  text += `Confira a programação completa dia a dia com horários das Santas Missas, pregadores e quermesse:\n`;
  text += `👉 ${url}`;

  return encodeURIComponent(text);
}

export interface EventCountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: 'upcoming' | 'ongoing' | 'ended';
  label: string;
}

export function calculateEventCountdown(startDateStr: string, endDateStr?: string | null): EventCountdownState {
  if (!startDateStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: 'ended', label: 'Data a definir' };
  }

  const now = new Date();
  const [startYear, startMonth, startDay] = startDateStr.split('-').map(Number);
  const startDateTime = new Date(startYear, startMonth - 1, startDay, 0, 0, 0);

  const endStr = endDateStr || startDateStr;
  const [endYear, endMonth, endDay] = endStr.split('-').map(Number);
  const endDateTime = new Date(endYear, endMonth - 1, endDay, 23, 59, 59);

  const diffToStart = startDateTime.getTime() - now.getTime();
  const diffToEnd = endDateTime.getTime() - now.getTime();

  if (diffToStart > 0) {
    const totalSecs = Math.floor(diffToStart / 1000);
    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      status: 'upcoming',
      label: days === 0 ? 'Começa hoje!' : `Faltam ${days} ${days === 1 ? 'dia' : 'dias'}`
    };
  }

  if (diffToEnd > 0) {
    const totalSecs = Math.floor(diffToEnd / 1000);
    const days = Math.floor(totalSecs / (3600 * 24));
    const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      status: 'ongoing',
      label: 'Solenidade em Andamento!'
    };
  }

  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    status: 'ended',
    label: 'Festa Concluída'
  };
}
