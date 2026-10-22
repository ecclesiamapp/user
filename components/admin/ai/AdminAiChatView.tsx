'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  Copy, 
  Check, 
  Trash2, 
  FileText, 
  BookOpen,
  HelpCircle 
} from 'lucide-react';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  sources?: { title: string; source_type: string; similarity: number }[];
  suggested_draft?: string | null;
  timestamp: string;
}

interface AdminAiChatViewProps {
  initialPrompt?: string;
  compact?: boolean;
}

const QUICK_PROMPTS = [
  'Qual o horário de atendimento e confissão do Pe. Irineu?',
  'Quais são as 12 comunidades filiadas da Catedral?',
  'Crie um rascunho de aviso sobre as celebrações de fim de ano',
  'Qual é a chave PIX oficial para doações da Catedral?',
];

export function AdminAiChatView({ initialPrompt, compact = false }: AdminAiChatViewProps) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content:
        'Paz e bem! Sou o Assistente Inteligente da Catedral de Colatina. Como posso auxiliar a secretaria hoje? Posso consultar horários dos 4 sacerdotes, informações das 12 CEBs ou redigir rascunhos de avisos pastorais.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>(initialPrompt || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Prepara o histórico recente para o Gemini
      const historyPayload = messages.slice(-5).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/admin/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          similarity_threshold: 0.40,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMessage: ChatMessageItem = {
          id: `bot-${Date.now()}`,
          role: 'model',
          content: data.answer,
          sources: data.sources || [],
          suggested_draft: data.suggested_draft,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Erro ao processar consulta.');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Falha na requisição';
      const errorMessage: ChatMessageItem = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `Desculpe, ocorreu uma instabilidade ao consultar a IA: ${errorMsg}. Por favor, tente novamente.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDraft = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: 'Histórico de conversa reiniciado. Em que posso ajudar agora?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-2xl overflow-hidden shadow-sm">
      {/* Header do Chat */}
      <div className="p-4 border-b border-[var(--dash-border)] flex items-center justify-between bg-[var(--dash-bg)]/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-[var(--dash-text-primary)]">
              IA da Paróquia
            </h2>
            <span className="text-[11px] text-[var(--dash-text-secondary)]">
              RAG Conectado ao Supabase pgvector
            </span>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-2 rounded-xl text-[var(--dash-text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Limpar conversa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Área de Mensagens com Scroll */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#FFA82A] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white rounded-tr-none shadow-md'
                  : 'bg-[var(--dash-bg)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] rounded-tl-none'
              }`}
            >
              {/* Conteúdo Principal */}
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </div>

              {/* Bloco de Rascunho Sugerido (quando detectado) */}
              {msg.suggested_draft && (
                <div className="mt-3 p-3 rounded-xl bg-[var(--dash-surface)] border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-500">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Rascunho de Aviso Gerado
                    </span>
                    <button
                      onClick={() => handleCopyDraft(msg.suggested_draft!, msg.id)}
                      className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs p-2 rounded-lg bg-[var(--dash-bg)] text-[var(--dash-text-primary)] font-sans whitespace-pre-wrap">
                    {msg.suggested_draft}
                  </pre>
                </div>
              )}

              {/* Fontes Citadas (RAG) */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-[var(--dash-border)]/60 space-y-1">
                  <span className="text-[10px] font-semibold text-[var(--dash-text-secondary)] uppercase tracking-wider block">
                    Fontes Oficiais Consultadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[11px] text-[var(--dash-text-secondary)]"
                      >
                        <BookOpen className="w-2.5 h-2.5 text-amber-500" />
                        <span className="truncate max-w-[200px]">{src.title}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`text-[10px] ${
                  msg.role === 'user' ? 'text-white/70' : 'text-[var(--dash-text-secondary)]'
                } text-right`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-[var(--dash-bg)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1E22] to-[#FFA82A] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[var(--dash-bg)] border border-[var(--dash-border)] p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-[var(--dash-text-secondary)]">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>Consultando acervo da Catedral e formulando resposta...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões Rápidas (Chips) */}
      {!compact && messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/30 flex items-center gap-2 overflow-x-auto">
          <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[11px] text-[var(--dash-text-secondary)] shrink-0">
            Sugestões:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-border)] text-[var(--dash-text-primary)] hover:border-amber-500/50 transition-colors whitespace-nowrap shrink-0 min-h-[32px] cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Campo de Entrada de Mensagem */}
      <div className="p-3 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma dúvida sobre a Catedral, padres, CEBs ou peça um aviso..."
            disabled={loading}
            className="flex-1 bg-[var(--dash-surface)] border border-[var(--dash-border)] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--dash-text-primary)] placeholder:text-[var(--dash-text-secondary)] focus:outline-none focus:border-amber-500 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B1E22] to-[#6E161A] text-white hover:opacity-95 transition-opacity disabled:opacity-40 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
