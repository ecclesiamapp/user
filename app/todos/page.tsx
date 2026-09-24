import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function TodosPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from('todos').select();

  return (
    <div className="min-h-screen p-8 bg-[var(--dash-bg)] text-[var(--dash-text-primary)]">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Supabase Test: Todos</h1>
          <Link href="/" className="text-sm text-[var(--primary)] hover:underline">
            Voltar ao Portal
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm">
            <p className="font-semibold">Aviso de Conexão:</p>
            <p className="text-xs mt-1">A tabela &apos;todos&apos; ainda não foi criada no Supabase ({error.message}).</p>
          </div>
        )}

        <div className="p-5 rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)] shadow-sm">
          {todos && todos.length > 0 ? (
            <ul className="divide-y divide-[var(--dash-border)]">
              {todos.map((todo) => (
                <li key={todo.id} className="py-2.5 text-sm flex items-center justify-between">
                  <span>{todo.name || todo.title || JSON.stringify(todo)}</span>
                  <span className="text-xs text-emerald-600 font-semibold">ID: {todo.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--dash-text-secondary)] text-center py-4">
              Nenhum registro encontrado na tabela &apos;todos&apos;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
