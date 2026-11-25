import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Variáveis de ambiente do Supabase não configuradas.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false }
    });

    // Teste de conectividade e leitura mínima com medição de latência
    const { count, error } = await supabase
      .from('parishes')
      .select('*', { count: 'exact', head: true });

    const latencyMs = Date.now() - startTime;

    if (error) {
      return NextResponse.json(
        {
          status: 'degraded',
          database: 'error',
          error: error.message,
          latencyMs,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: 'healthy',
        database: 'connected',
        latencyMs,
        uptime: process.uptime ? `${Math.floor(process.uptime())}s` : 'serverless',
        timestamp: new Date().toISOString(),
        checks: {
          supabaseRest: 'ok',
          schemaPublic: 'reachable'
        }
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'down',
        database: 'unreachable',
        error: err?.message || 'Erro inesperado na verificação de integridade',
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
