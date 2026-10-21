import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2 } from 'lucide-react';
import { Button, Card, Field, PageHeader } from '../../components/ui';
import { db } from '../../data/db';
import { newId } from '../../lib/id';
import { detectCrisis } from '../../engine/crisis';
import { useCrisisStore } from '../../store/crisis';

export function TriggersPage() {
  const { t } = useTranslation(['cravings', 'common']);
  const triggers = useLiveQuery(() => db.triggers.toArray(), [], []);
  const openCrisis = useCrisisStore((s) => s.open);
  const [label, setLabel] = useState('');
  const [plan, setPlan] = useState('');

  async function add() {
    const trimmed = label.trim();
    if (!trimmed) return;
    const crisis = detectCrisis(plan);
    if (crisis.level !== 'none') openCrisis(crisis.level, 'trigger-plan');
    await db.triggers.put({ id: newId(), label: trimmed, plan: plan.trim() });
    setLabel('');
    setPlan('');
  }

  async function remove(id: string) {
    await db.triggers.delete(id);
  }

  return (
    <>
      <PageHeader title={t('cravings:triggersTitle')} subtitle={t('cravings:triggersSubtitle')} />
      <div className="space-y-4">
        <Card className="space-y-3">
          <Field label={t('cravings:triggerName')} htmlFor="trigger-label">
            <input
              id="trigger-label"
              className="input"
              maxLength={60}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t('cravings:triggerNamePlaceholder')}
            />
          </Field>
          <Field
            label={t('cravings:triggerPlan')}
            hint={t('cravings:triggerPlanHint')}
            htmlFor="trigger-plan"
          >
            <textarea
              id="trigger-plan"
              className="input min-h-20"
              rows={2}
              maxLength={500}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </Field>
          <Button className="w-full" onClick={() => void add()} disabled={!label.trim()}>
            {t('cravings:triggerAdd')}
          </Button>
        </Card>

        {(triggers ?? []).length === 0 ? (
          <Card>
            <p className="muted">{t('cravings:triggerEmpty')}</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {triggers?.map((tr) => (
              <Card key={tr.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{tr.label}</p>
                  {tr.plan && <p className="muted mt-1 whitespace-pre-wrap text-xs">{tr.plan}</p>}
                </div>
                <button
                  type="button"
                  className="btn-ghost !min-h-11 !px-3 text-rose-600"
                  onClick={() => void remove(tr.id)}
                  aria-label={t('common:actions.delete')}
                >
                  <Trash2 size={16} aria-hidden />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
