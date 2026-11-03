// ─── SP3-03: Live Catalog Stock Lookup ──────────────────────────────────────
// Searchable ERPNext stock balance lookup backed by TanStack Query.

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { ShoppingBag, Search, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { lookupStock } from '../../../api/catalogApi';

const SUGGESTIONS = ['FUR-CHR-001', 'DESK-MOD-04', 'LAMP-FL-02'];

export function ERPStockLookup() {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const stockQuery = useQuery({
    queryKey: ['stock', code],
    queryFn: () => lookupStock(code),
    enabled: code.trim().length > 0,
    staleTime: 15 * 1000,
  });

  const handleSearch = (queryOverride?: string) => {
    const q = (queryOverride !== undefined ? queryOverride : input).trim();
    if (q) {
      setCode(q);
      if (queryOverride) setInput(queryOverride);
    }
  };

  const clear = () => {
    setInput('');
    setCode('');
  };

  const isLoading = stockQuery.isFetching;
  const hasSearched = code.trim().length > 0;
  const result = stockQuery.data;

  return (
    <div className="p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Catalog Stock Lookup
          </span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2 border border-border focus-within:border-[#74A09F] focus-within:bg-card focus-within:ring-2 focus-within:ring-[#74A09F]/20 transition-all">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="Search SKU or item name..."
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full font-normal"
            />
            {input && (
              <button
                onClick={clear}
                className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !input.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#74A09F] hover:bg-[#5D8C8B] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all shadow-xs cursor-pointer shrink-0"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        {!hasSearched && (
          <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold shrink-0">
              Quick:
            </span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-2 py-0.5 rounded-lg bg-muted/70 hover:bg-muted text-foreground text-2xs font-mono font-medium border border-border/60 transition-colors cursor-pointer shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-6 gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-[#74A09F]" />
          <span>Querying inventory in ERPNext...</span>
        </div>
      )}

      {!isLoading && hasSearched && !result && (
        <div className="mt-3 p-4 rounded-xl bg-muted/40 border border-dashed border-border text-center">
          <AlertCircle className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs font-semibold text-foreground">No catalog match</p>
          <p className="text-2xs text-muted-foreground">No item found for "{code}". Try another SKU.</p>
        </div>
      )}

      {!isLoading && result && (
        <div className="mt-3 bg-card border border-border rounded-xl overflow-hidden shadow-xs">
          <div className="px-3.5 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">{result.item_name}</p>
              <p className="text-2xs text-muted-foreground font-mono">{result.item_code}</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-[#74A09F]/15 text-[#74A09F] border border-[#74A09F]/20">
              {result.warehouses.reduce((sum, w) => sum + w.actual_qty, 0)} In Total
            </span>
          </div>

          <table className="w-full text-xs">
            <thead>
              <tr className="text-2xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                <th className="text-left px-3.5 py-2 font-semibold">Warehouse</th>
                <th className="text-right px-3.5 py-2 font-semibold">Stock Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {result.warehouses.map((wh) => (
                <tr key={wh.warehouse_name} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3.5 py-2 font-medium text-foreground">{wh.warehouse_name}</td>
                  <td className="px-3.5 py-2 text-right">
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold border',
                        wh.actual_qty > 0
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                      )}
                    >
                      {wh.actual_qty > 0 ? (
                        <>
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          <span>{wh.actual_qty} in stock</span>
                        </>
                      ) : (
                        '0 stock'
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

