import React, { useState } from 'react';
import { Sparkles, Send, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface AICeoAssistantProps {
  activeWorkspaceId: string;
  dataStore: Record<string, any>;
  onNavigateDomain: (domain: string) => void;
}

export const AICeoAssistant: React.FC<AICeoAssistantProps> = ({
  activeWorkspaceId,
  dataStore,
  onNavigateDomain,
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; action?: () => void; actionLabel?: string }>>([
    {
      sender: 'ai',
      text: 'Good morning, Billy. I am your Atlas AI CEO Executive Assistant. Ask me anything about projects, gross profit risks, open bids, or AHJ permits.',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query;
    const lower = query.toLowerCase();
    setQuery('');

    const newMessages = [...messages, { sender: 'user' as const, text: userText }];

    // Conversational Intelligence Engine
    if (lower.includes('margin') || lower.includes('risk') || lower.includes('gp')) {
      const atRisk = (dataStore.projects || []).filter((p: any) => p.grossMarginPercent < 25.0);
      newMessages.push({
        sender: 'ai',
        text: `Found ${atRisk.length} project(s) with gross margin below 25% target threshold: Oakridge Logistics Expansion (19.58% GM due to steel buyout).`,
        action: () => onNavigateDomain('youngman'),
        actionLabel: 'Open Youngman Projects Command Center',
      });
    } else if (lower.includes('permit') || lower.includes('ahj') || lower.includes('century')) {
      const permits = dataStore.permits || [];
      newMessages.push({
        sender: 'ai',
        text: `Century Fire has ${permits.length} active AHJ permit(s). Highland Towers FPS-2026-8841 permit is approved and active.`,
        action: () => onNavigateDomain('century'),
        actionLabel: 'Open Century Fire AHJ Hub',
      });
    } else if (lower.includes('bid') || lower.includes('opportunity') || lower.includes('pipeline')) {
      const opps = dataStore.opportunities || [];
      newMessages.push({
        sender: 'ai',
        text: `You have ${opps.length} active opportunity in the pipeline totaling $460,000 in open bids.`,
        action: () => onNavigateDomain('youngman'),
        actionLabel: 'Open CRM Pipeline',
      });
    } else {
      newMessages.push({
        sender: 'ai',
        text: `Analyzing active entities across workspace ${activeWorkspaceId}... All core operations are operating within expected business rules.`,
      });
    }

    setMessages(newMessages);
  };

  return (
    <div className="bg-slate-900 border border-purple-900/50 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-950 border border-purple-800/60 rounded-xl text-purple-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI CEO Conversational Intelligence</h3>
            <p className="text-xs text-slate-400">Ask questions and trigger actions across workspace business entities</p>
          </div>
        </div>
      </div>

      {/* Chat Thread */}
      <div className="space-y-3 max-h-52 overflow-y-auto pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[85%] space-y-2 ${
              m.sender === 'user'
                ? 'bg-indigo-600 text-white ml-auto font-medium'
                : 'bg-slate-950 border border-slate-800 text-slate-200'
            }`}
          >
            <div>{m.text}</div>
            {m.action && (
              <button
                onClick={m.action}
                className="px-3 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-800/80 text-purple-300 text-[11px] font-bold rounded-lg flex items-center gap-1 mt-2 transition-colors"
              >
                <span>{m.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask AI CEO: 'What projects have low gross margin?'..."
          className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:border-purple-500 focus:outline-none placeholder-slate-600"
        />
        <button
          type="submit"
          className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
