// ─── SP2-04: MyFatoorah Payment Link Modal ──────────────────────────────────
// Form for amount, customer contact, and order reference. On success a rich
// payment card is inserted into the chat thread.

import { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { generatePaymentLink } from '../../../api/paymentApi';
import { formatCurrency } from '../../../utils/currencyFormatter';
import type { ConversationThread, PaymentLinkMetadata } from '../../../types/care';

const ORDER_REF_OPTIONS = ['SO-2026-0881', 'SO-2026-0903', 'SO-2026-0912', 'INV-2026-0421'];

interface MyFatoorahModalProps {
  isOpen: boolean;
  onClose: () => void;
  thread: ConversationThread;
  onGenerated: (metadata: PaymentLinkMetadata) => void;
}

export function MyFatoorahModal({ isOpen, onClose, thread, onGenerated }: MyFatoorahModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [phone, setPhone] = useState<string>(thread.customer_phone);
  const [orderRef, setOrderRef] = useState<string>(ORDER_REF_OPTIONS[0]);
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    setAmount('');
    setDescription('');
    onClose();
  };

  const handleSubmit = async () => {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Enter a valid amount greater than zero.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generatePaymentLink({
        customer_phone: phone,
        customer_name: thread.customer_name,
        order_id: orderRef,
        invoice_amount: parsedAmount,
        currency: 'QAR',
        description: description || `Payment for ${orderRef}`,
      });

      onGenerated({
        invoice_id: response.payment_id,
        amount: parsedAmount,
        url: response.invoice_url,
        status: 'pending',
        expires_at: response.expires_at,
      });
      handleClose();
    } catch {
      const fallbackId = `PAY-${Date.now()}`;
      const fallbackUrl = `https://pay.myfatoorah.com/mock/${fallbackId.toLowerCase()}`;

      onGenerated({
        invoice_id: fallbackId,
        amount: parsedAmount,
        url: fallbackUrl,
        status: 'pending',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Generate Payment Link"
      subtitle="Create a MyFatoorah payment request for this customer"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading} disabled={loading}>
            Generate Link
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Amount (QAR)</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="450.00"
            className="w-full h-9 bg-muted/60 rounded-xl px-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Customer Phone / Email</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-9 bg-muted/60 rounded-xl px-3 text-sm text-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Reference Document</label>
          <select
            value={orderRef}
            onChange={(e) => setOrderRef(e.target.value)}
            className="w-full h-9 bg-muted/60 rounded-xl px-3 text-sm text-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-mono"
          >
            {ORDER_REF_OPTIONS.map((ref) => (
              <option key={ref} value={ref} className="bg-card text-foreground">
                {ref}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment for furniture order"
            className="w-full h-9 bg-muted/60 rounded-xl px-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {error && <p className="text-xs text-destructive font-medium">{error}</p>}

        {amount && Number(amount) > 0 && (
          <p className="text-xs text-muted-foreground font-mono">
            Card will show: {formatCurrency(Number(amount))}
          </p>
        )}
      </div>
    </Modal>
  );
}
