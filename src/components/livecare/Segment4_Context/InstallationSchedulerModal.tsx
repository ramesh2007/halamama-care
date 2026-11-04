// ─── SP3-06: OMS Installation Scheduler ─────────────────────────────────────
// Calendar + slot picker by delivery zone. Books an installation appointment
// and shows a confirmation reference.

import { useState } from 'react';
import { clsx } from 'clsx';
import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { scheduleInstallation } from '../../../api/installationApi';
import {
  useDeliveryZones,
  useInstallationSlots,
  useInstallationTeams,
} from '../../../hooks/api';
import type { SalesOrderSummary, InstallationSlotResponse } from '../../../types/care';

const TODAY = new Date().toISOString().split('T')[0];

interface InstallationSchedulerModalProps {
  order: SalesOrderSummary | null;
  customerPhone: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InstallationSchedulerModal({
  order,
  customerPhone,
  isOpen,
  onClose,
}: InstallationSchedulerModalProps) {
  const { data: zones = ['Doha Central', 'West Bay', 'Al Sadd', 'Al Wakra', 'Al Rayyan'] } = useDeliveryZones();
  const { data: slots = ['09:00–12:00', '12:00–15:00', '15:00–18:00'] } = useInstallationSlots();
  const { data: teams = [{ id: 'team-1', name: 'Install Team A', lead: 'Mohammed Ali' }] } = useInstallationTeams();

  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstallationSlotResponse | null>(null);

  const zone = selectedZone || zones[0] || 'Doha Central';
  const teamId = selectedTeamId || teams[0]?.id || 'team-1';

  const canBook = Boolean(order && date && slot);

  const handleClose = () => {
    setResult(null);
    setDate('');
    setSlot('');
    onClose();
  };

  const handleBook = async () => {
    if (!order || !date || !slot) return;
    setLoading(true);
    const response = await scheduleInstallation({
      order_id: order.name,
      customer_phone: customerPhone,
      delivery_zone: zone,
      scheduled_date: date,
      time_slot: slot,
      installation_team_id: teamId,
    });
    setResult(response);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Schedule Installation"
      subtitle={order ? `Order ${order.name}` : undefined}
      size="md"
      footer={
        result ? (
          <Button variant="ghost" onClick={handleClose}>
            Done
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleBook} disabled={!canBook} loading={loading}>
              Book Installation Slot
            </Button>
          </>
        )
      }
    >
      {result ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-success/30 bg-success/10 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Check className="h-4 w-4 text-success" />
              <span className="text-sm font-bold text-success">Slot Booked</span>
            </div>
            <p className="text-2xs text-muted-foreground font-mono mb-2">{result.appointment_id}</p>
            <p className="text-xs text-foreground font-medium">
              {date} · {slot}
            </p>
            <p className="text-xs text-muted-foreground capitalize mt-1">Zone: {zone}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Delivery Zone
            </label>
            <div className="flex flex-wrap gap-2">
              {zones.map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer',
                    zone === z
                      ? 'bg-primary/15 text-primary border-primary/30 font-semibold'
                      : 'text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                  )}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Date
            </label>
            <input
              type="date"
              min={TODAY}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-9 bg-muted/60 rounded-xl px-3.5 text-xs font-medium text-foreground border border-border focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none transition-all cursor-pointer"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Time Slot
            </label>
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer',
                    slot === s
                      ? 'bg-primary/15 text-primary border-primary/30 font-semibold'
                      : 'text-muted-foreground border-border hover:bg-muted hover:text-foreground',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              Installation Team
            </label>
            <select
              value={teamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full h-9 bg-muted/60 rounded-xl px-3.5 text-xs font-medium text-foreground border border-border focus:border-primary focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none transition-all cursor-pointer"
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} — Lead: {team.lead}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </Modal>
  );
}

