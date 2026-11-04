// ─── Start WhatsApp Conversation Modal ──────────────────────────────────────
// Dialog for initiating an outbound WhatsApp chat directly to a phone number.
// Calls POST /api/customer-care/conversations/start.

import { useState } from 'react';
import { Phone, User, Send, Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { useStartConversation } from '../../../hooks/api';

interface StartConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StartConversationModal({ isOpen, onClose }: StartConversationModalProps) {
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startMutation = useStartConversation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.trim();
    const cleanMsg = message.trim();

    if (!cleanPhone) {
      setError('Please provide a valid phone number');
      return;
    }
    if (!cleanMsg) {
      setError('Please provide an opening WhatsApp message');
      return;
    }

    try {
      await startMutation.mutateAsync({
        phone: cleanPhone,
        customer_name: customerName.trim() || undefined,
        message: cleanMsg,
      });

      // Reset and close
      setPhone('');
      setCustomerName('');
      setMessage('');
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to start conversation';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start WhatsApp Conversation"
      subtitle="Send a WhatsApp message to initiate a new customer thread"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={startMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={startMutation.isPending || !phone.trim() || !message.trim()}
          >
            {startMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-1.5" />
                <span>Send WhatsApp</span>
              </>
            )}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-1">
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-semibold">{error}</div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Customer Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="relative flex items-center">
            <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +974 5512 3456 or 974XXXXXXXX"
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>
          <p className="text-2xs text-muted-foreground mt-1">
            Include country code (e.g. +974 for Qatar).
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Customer Name <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Fatima Al-Kuwari"
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Initial Message <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Hello, this is Halamama Customer Care..."
              className="w-full p-3 text-xs rounded-xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
              required
            />
          </div>
          <div className="flex items-center justify-between text-2xs text-muted-foreground mt-1">
            <span>This WhatsApp message will be sent immediately via Meta API.</span>
            <span className="font-mono">{message.length} chars</span>
          </div>
        </div>
      </form>
    </Modal>
  );
}
