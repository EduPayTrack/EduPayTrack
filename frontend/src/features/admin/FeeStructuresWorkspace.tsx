import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
  createFeeStructure,
  getFeeStructures,
  updateFeeStructure,
} from '../../services/admin';
import type { FeeStructure } from '../../types/api';
import { formatMoney } from '../../utils/format';

type FeeStructuresWorkspaceProps = {
  token: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

const initialForm = {
  title: '',
  description: '',
  amount: '',
  program: '',
  classLevel: '',
  term: '',
  semester: '',
  academicYear: '',
};

export function FeeStructuresWorkspace({
  token,
  onError,
  onSuccess,
}: FeeStructuresWorkspaceProps) {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState<string | null>(null);
  const [active, setActive] = useState(true);

  async function loadFeeStructures() {
    setLoading(true);

    try {
      const data = await getFeeStructures(token);
      setFeeStructures(data);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load fee structures');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFeeStructures();
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    onError('');
    onSuccess('');

    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        amount: Number(form.amount),
        program: form.program || undefined,
        classLevel: form.classLevel || undefined,
        term: form.term || undefined,
        semester: form.semester || undefined,
        academicYear: form.academicYear || undefined,
        active,
      };

      if (selectedFeeStructureId) {
        await updateFeeStructure(token, selectedFeeStructureId, payload);
        onSuccess('Fee structure updated successfully.');
      } else {
        await createFeeStructure(token, payload);
        onSuccess('Fee structure created successfully.');
      }

      resetForm();
      await loadFeeStructures();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to save fee structure');
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setSelectedFeeStructureId(null);
    setActive(true);
  }

  function loadIntoForm(fee: FeeStructure) {
    setSelectedFeeStructureId(fee.id);
    setActive(fee.active);
    setForm({
      title: fee.title,
      description: fee.description || '',
      amount: String(fee.amount),
      program: fee.program || '',
      classLevel: fee.classLevel || '',
      term: fee.term || '',
      semester: fee.semester || '',
      academicYear: fee.academicYear || '',
    });
  }

  async function handleToggleActive(fee: FeeStructure) {
    onError('');
    onSuccess('');

    try {
      await updateFeeStructure(token, fee.id, { active: !fee.active });
      onSuccess(`Fee structure ${!fee.active ? 'activated' : 'deactivated'} successfully.`);
      await loadFeeStructures();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to update fee structure');
    }
  }

  return (
    <div className="workspace-grid admin-grid">
      <section className="action-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">{selectedFeeStructureId ? 'Edit' : 'Create'}</p>
            <h3>{selectedFeeStructureId ? 'Update fee structure' : 'New fee structure'}</h3>
          </div>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
          </label>
          <label>
            <span>Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>
          <label>
            <span>Amount</span>
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={form.amount}
              onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
            />
          </label>
          <div className="field-grid two-up">
            <label>
              <span>Program</span>
              <input
                value={form.program}
                onChange={(event) => setForm((current) => ({ ...current, program: event.target.value }))}
              />
            </label>
            <label>
              <span>Class level</span>
              <input
                value={form.classLevel}
                onChange={(event) =>
                  setForm((current) => ({ ...current, classLevel: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="field-grid two-up">
            <label>
              <span>Term</span>
              <input
                value={form.term}
                onChange={(event) => setForm((current) => ({ ...current, term: event.target.value }))}
              />
            </label>
            <label>
              <span>Semester</span>
              <input
                value={form.semester}
                onChange={(event) =>
                  setForm((current) => ({ ...current, semester: event.target.value }))
                }
              />
            </label>
          </div>
          <label>
            <span>Academic year</span>
            <input
              value={form.academicYear}
              onChange={(event) =>
                setForm((current) => ({ ...current, academicYear: event.target.value }))
              }
            />
          </label>

          <label className="toggle-field">
            <span>Active status</span>
            <input
              checked={active}
              onChange={(event) => setActive(event.target.checked)}
              type="checkbox"
            />
          </label>

          <div className="action-row">
            {selectedFeeStructureId ? (
              <button className="ghost-button" type="button" onClick={resetForm}>
                Cancel edit
              </button>
            ) : null}
            <button className="primary-button" disabled={saving} type="submit">
              {saving ? 'Saving...' : selectedFeeStructureId ? 'Save changes' : 'Create fee structure'}
            </button>
          </div>
        </form>
      </section>

      <section className="history-card wide-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Catalog</p>
            <h3>Configured fee structures</h3>
          </div>
        </div>

        {loading ? <p className="muted-copy">Loading fee structures...</p> : null}

        <div className="history-list">
          {feeStructures.length ? (
            feeStructures.map((fee) => (
              <article className="history-item fee-item" key={fee.id}>
                <div>
                  <div className="history-topline">
                    <strong>{fee.title}</strong>
                    <span className={fee.active ? 'status-chip approved' : 'status-chip rejected'}>
                      {fee.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p>{fee.description || 'No description provided.'}</p>
                  <small>
                    {formatMoney(fee.amount)} | Program: {fee.program || 'All'} | Class:{' '}
                    {fee.classLevel || 'All'} | Year: {fee.academicYear || 'All'}
                  </small>
                </div>
                <div className="action-row">
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => loadIntoForm(fee)}
                  >
                    Edit
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      void handleToggleActive(fee);
                    }}
                  >
                    {fee.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="muted-copy">No fee structures configured yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
