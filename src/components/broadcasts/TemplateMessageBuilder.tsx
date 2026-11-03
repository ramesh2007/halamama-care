// ─── SP4-03: Template Message Builder ───────────────────────────────────────
// Select a Meta-approved template, map variables, and define the target
// audience with a live WhatsApp mobile preview.

import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import {
  Send,
  Eye,
  CheckCircle2,
  Sparkles,
  Users,
  Layers,
  Info,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  RefreshCw,
} from 'lucide-react';
import { useBroadcastTemplates, useCreateBroadcastCampaign } from '../../hooks/api';

const AUDIENCE_OPTIONS = [
  {
    id: 'orders',
    title: 'High Spenders',
    desc: 'Customers with cumulative orders > QAR 1,000',
    count: 1420,
    tag: 'High Value',
  },
  {
    id: 'geo',
    title: 'Doha & Lusail Region',
    desc: 'Targeted geographic zone for rapid delivery',
    count: 5800,
    tag: 'Zone A',
  },
  {
    id: 'inactive',
    title: 'Re-engagement Segment',
    desc: 'No completed purchases in the last 60 days',
    count: 2150,
    tag: 'Retention',
  },
  {
    id: 'custom',
    title: 'VIP Loyalty Members',
    desc: 'Gold & Platinum tier registered users',
    count: 640,
    tag: 'VIP Club',
  },
];

const VARIABLE_SUGGESTIONS: Record<string, string[]> = {
  'tpl-1': ['Fatima Al-Kuwari', 'ORD-84920', '2'],
  'tpl-2': ['Omar Farouk', 'ORD-71933', 'Out for Delivery', 'https://halamama.qa/track/71933'],
  'tpl-3': ['Valued Customer', 'WINTER40'],
  'tpl-4': ['Maryam', '24'],
};

interface TemplateMessageBuilderProps {
  onCompleted?: () => void;
}

export function TemplateMessageBuilder({ onCompleted }: TemplateMessageBuilderProps) {
  const { data: templates = [] } = useBroadcastTemplates();
  const createCampaign = useCreateBroadcastCampaign();

  const [campaignName, setCampaignName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [audience, setAudience] = useState<string[]>(['orders', 'geo']);
  const [sent, setSent] = useState(false);

  const approvedTemplates = templates.filter((t) => t.status === 'approved');
  const templateId = selectedTemplateId || approvedTemplates[0]?.id || '';
  const template = templates.find((t) => t.id === templateId) || approvedTemplates[0];

  // Auto-fill template variables with sensible defaults on template switch
  const handleTemplateChange = (id: string) => {
    setSelectedTemplateId(id);
    const defaults = VARIABLE_SUGGESTIONS[id] || [];
    const t = templates.find((tpl) => tpl.id === id);
    if (t) {
      const initial: Record<string, string> = {};
      t.variables.forEach((v, idx) => {
        initial[v] = defaults[idx] || '';
      });
      setValues(initial);
      if (!campaignName) {
        setCampaignName(`${t.name} - ${new Date().toLocaleDateString('en-GB')}`);
      }
    }
  };

  // Preview interpolation
  const preview = useMemo(() => {
    if (!template) return '';
    return template.variables.reduce((acc, variable, idx) => {
      const val = values[variable]?.trim();
      return acc.replaceAll(variable, val || `{{${idx + 1}}}`);
    }, template.body);
  }, [template, values]);

  // Audience calculations
  const totalAudienceSize = useMemo(() => {
    return AUDIENCE_OPTIONS.filter((opt) => audience.includes(opt.id)).reduce(
      (sum, opt) => sum + opt.count,
      0,
    );
  }, [audience]);

  const toggleAudience = (id: string) => {
    setAudience((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const handleSend = () => {
    if (!template) return;
    const finalName = campaignName.trim() || `${template.name} Campaign`;

    createCampaign.mutate(
      {
        name: finalName,
        template_id: template.id,
        template_name: template.name,
        audience_criteria: audience,
        variables: values,
      },
      {
        onSuccess: () => {
          setSent(true);
          window.setTimeout(() => {
            setSent(false);
            if (onCompleted) onCompleted();
          }, 1500);
        },
      },
    );
  };

  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Column: Campaign Configuration (7 cols) ── */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section: Campaign Details */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <div className="h-8 w-8 rounded-xl bg-[#74A09F]/15 flex items-center justify-center text-[#74A09F]">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">1. Campaign Configuration</h2>
                <p className="text-2xs text-muted-foreground">Select template & give this broadcast a name</p>
              </div>
            </div>

            {/* Campaign Name */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Winter Sale Weekend Blast 2026"
                className="w-full bg-muted/40 rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-2 focus:ring-[#74A09F]/20 outline-none transition-all"
              />
            </div>

            {/* Template Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-foreground">Meta-Approved Template</label>
                <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Meta Verified
                </span>
              </div>
              <select
                value={templateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full bg-muted/40 rounded-xl px-3.5 py-2.5 text-xs text-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-2 focus:ring-[#74A09F]/20 outline-none transition-all cursor-pointer font-medium"
              >
                {approvedTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} • [{t.category}] ({t.variables.length} parameters)
                  </option>
                ))}
              </select>
            </div>

            {/* Template Info Card */}
            {template && (
              <div className="p-3.5 rounded-xl bg-muted/50 border border-border/80 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-[#74A09F] shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-foreground/80 space-y-1">
                  <p className="font-semibold text-foreground">
                    Category: <span className="text-[#74A09F]">{template.category}</span>
                  </p>
                  <p className="font-mono text-2xs text-muted-foreground break-all">
                    {template.body}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Variable Mapping */}
          {template && template.variables.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-[#74A09F]/15 flex items-center justify-center text-[#74A09F]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">2. Template Parameter Mapping</h2>
                    <p className="text-2xs text-muted-foreground">Replace placeholders with dynamic fields or sample values</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const defaults = VARIABLE_SUGGESTIONS[template.id] || [];
                    const next: Record<string, string> = {};
                    template.variables.forEach((v, idx) => {
                      next[v] = defaults[idx] || '';
                    });
                    setValues(next);
                  }}
                  className="flex items-center gap-1 text-2xs font-bold text-[#74A09F] hover:underline cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  Fill Sample Data
                </button>
              </div>

              <div className="space-y-3">
                {template.variables.map((variable, idx) => {
                  const sampleHint = (VARIABLE_SUGGESTIONS[template.id] || [])[idx];
                  return (
                    <div key={variable} className="space-y-1">
                      <div className="flex items-center justify-between text-2xs">
                        <span className="font-mono font-bold text-[#74A09F] bg-[#74A09F]/10 px-2 py-0.5 rounded-md border border-[#74A09F]/20">
                          Parameter {variable}
                        </span>
                        {sampleHint && (
                          <span className="text-muted-foreground">
                            Sample: <span className="font-semibold text-foreground">{sampleHint}</span>
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={values[variable] || ''}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [variable]: e.target.value }))
                        }
                        placeholder={sampleHint ? `e.g. ${sampleHint}` : `Enter value for ${variable}`}
                        className="w-full bg-muted/40 rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground border border-border focus:border-[#74A09F] focus:bg-card focus:ring-2 focus:ring-[#74A09F]/20 outline-none transition-all"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Target Audience */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">3. Target Audience Selection</h2>
                  <p className="text-2xs text-muted-foreground">Choose customer segments to receive this broadcast</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-2xs font-bold bg-[#74A09F]/15 text-[#74A09F] border border-[#74A09F]/20">
                {totalAudienceSize.toLocaleString()} Reach
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AUDIENCE_OPTIONS.map((opt) => {
                const isSelected = audience.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleAudience(opt.id)}
                    className={clsx(
                      'p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3',
                      isSelected
                        ? 'border-[#74A09F] bg-[#74A09F]/10 ring-1 ring-[#74A09F]/30'
                        : 'border-border bg-muted/30 hover:bg-muted/60',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-0.5 rounded accent-[#74A09F] cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className="text-xs font-bold text-foreground truncate">{opt.title}</p>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {opt.count.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-2xs text-muted-foreground leading-snug">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rate Limiting Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="text-2xs space-y-0.5 leading-relaxed">
                <p className="font-bold">Meta WhatsApp Business API Rate Limiting</p>
                <p className="text-foreground/80 dark:text-foreground/70">
                  Batched dispatch active: maximum 10 messages/sec. Automatic opt-out tag (STOP to unsubscribe) is enforced per Qatar & Meta compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs text-muted-foreground font-medium">
              Ready to broadcast to{' '}
              <strong className="text-foreground">{totalAudienceSize.toLocaleString()}</strong> recipients
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAudience(['orders', 'geo']);
                  setValues({});
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sent || audience.length === 0}
                className={clsx(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
                  sent
                    ? 'bg-emerald-600'
                    : 'bg-[#74A09F] hover:bg-[#5D8C8B]',
                )}
              >
                {sent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Campaign Dispatched ✓</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Launch Broadcast Campaign</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column: WhatsApp Live Mobile Preview (5 cols) ── */}
        <div className="lg:col-span-5 sticky top-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Eye className="h-4 w-4 text-[#74A09F]" />
              <span>Real-Time WhatsApp Preview</span>
            </label>
            <span className="text-2xs font-mono text-muted-foreground">iPhone 15 Mockup</span>
          </div>

          {/* Smartphone Shell */}
          <div className="mx-auto max-w-[340px] rounded-[36px] p-3 bg-zinc-900 border-[4px] border-zinc-700 shadow-xl">
            {/* Phone Screen */}
            <div className="rounded-[28px] overflow-hidden flex flex-col h-[520px] bg-[#EFEAE2] dark:bg-[#0B141A] text-foreground">
              {/* WhatsApp Top Navigation Bar */}
              <div className="bg-[#075E54] dark:bg-[#1F2C34] text-white px-3.5 py-2.5 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center font-bold text-white text-xs shrink-0">
                    HM
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold truncate">Halamama Care</span>
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[10px] text-emerald-100/80 truncate">Official Business Account</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-white/90">
                  <Video className="h-4 w-4" />
                  <Phone className="h-4 w-4" />
                  <MoreVertical className="h-4 w-4" />
                </div>
              </div>

              {/* Chat Canvas with Wallpaper */}
              <div className="flex-1 p-3.5 overflow-y-auto flex flex-col justify-end space-y-3 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:12px_12px]">
                {/* Date Chip */}
                <div className="text-center my-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-card/80 backdrop-blur-xs text-muted-foreground shadow-2xs">
                    TODAY
                  </span>
                </div>

                {/* WhatsApp Chat Bubble */}
                <div className="max-w-[85%] ml-auto bg-[#E7FFDB] dark:bg-[#005C4B] text-zinc-900 dark:text-zinc-100 rounded-2xl rounded-tr-xs p-3.5 shadow-sm space-y-2 relative">
                  {/* Bubble content */}
                  <div className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {preview}
                  </div>

                  {/* Bubble timestamp & read receipt */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                    <span>{currentTimeStr}</span>
                    <CheckCheck className="h-3.5 w-3.5 text-[#53BDEB]" />
                  </div>
                </div>

                {/* Interactive Action Buttons Mockup */}
                <div className="max-w-[85%] ml-auto space-y-1.5">
                  <div className="bg-card/90 dark:bg-zinc-800 text-center py-1.5 px-3 rounded-xl border border-border shadow-xs text-xs font-semibold text-[#74A09F] cursor-pointer hover:bg-card">
                    {template?.name.includes('Order') || template?.name.includes('Delivery')
                      ? '📍 Track Order'
                      : '🛍️ Shop Collection'}
                  </div>
                  <div className="bg-card/90 dark:bg-zinc-800 text-center py-1.5 px-3 rounded-xl border border-border shadow-xs text-xs font-semibold text-muted-foreground cursor-pointer hover:bg-card">
                    💬 Contact Support
                  </div>
                </div>
              </div>

              {/* WhatsApp Input Bar Mockup */}
              <div className="bg-[#F0F2F5] dark:bg-[#1F2C34] px-3 py-2 flex items-center gap-2 border-t border-border shrink-0">
                <div className="flex-1 bg-white dark:bg-[#2A3942] rounded-full px-3 py-1.5 text-2xs text-muted-foreground">
                  Reply to Halamama...
                </div>
                <div className="h-7 w-7 rounded-full bg-[#00A884] text-white flex items-center justify-center shrink-0">
                  <Send className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
