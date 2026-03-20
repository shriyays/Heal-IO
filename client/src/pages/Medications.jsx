import { useEffect, useState } from 'react';
import Bar from '../components/Bar';
import './Medications.css';

const today = new Date().toISOString().split('T')[0];
const FREQUENCIES = ['Daily', 'Twice daily', 'Three times daily', 'Weekly', 'As needed'];

export default function Medications() {
  const [meds, setMeds] = useState([]);
  const [adherence, setAdherence] = useState({});
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', dosage: '', frequency: 'Daily', reminderTime: '', notes: '' });
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    loadMeds();
    loadAdherence();
  }, []);

  async function loadMeds() {
    const r = await fetch('/api/medications', { credentials: 'include' });
    const d = await r.json();
    if (Array.isArray(d)) setMeds(d);
  }

  async function loadAdherence() {
    const r = await fetch(`/api/medications/adherence?from=${today}&to=${today}`, { credentials: 'include' });
    const d = await r.json();
    if (Array.isArray(d)) {
      const map = {};
      d.forEach((a) => { map[a.medId] = a.taken; });
      setAdherence(map);
    }
  }

  async function saveMed() {
    if (!form.name || !form.dosage) return;
    const r = await fetch('/api/medications', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      await loadMeds();
      setShow(false);
      setForm({ name: '', dosage: '', frequency: 'Daily', reminderTime: '', notes: '' });
      showToast('Medication added');
    }
  }

  async function toggleActive(id) {
    await fetch(`/api/medications/${id}/toggle`, { method: 'PATCH', credentials: 'include' });
    await loadMeds();
  }

  async function markTaken(medId, taken) {
    await fetch('/api/medications/adherence', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medId, date: today, taken }),
    });
    setAdherence((p) => ({ ...p, [medId]: taken }));
    showToast(taken ? 'Marked as taken ✓' : 'Unmarked');
  }

  const active = meds.filter((m) => m.active);
  const inactive = meds.filter((m) => !m.active);
  const takenCount = active.filter((m) => adherence[m._id?.toString()]).length;
  const adherePct = active.length ? Math.round((takenCount / active.length) * 100) : 0;
  const weekBars = [85, 100, 50, 100, 100, 67, adherePct];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div className="pg-title">Medications</div>
          <div className="pg-sub">Track daily medications and adherence.</div>
        </div>
        <button className="btn" type="button" onClick={() => setShow(!show)}>+ Add</button>
      </div>

      {show && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="sec-lbl">New medication</div>
          <div className="g2e">
            <div>
              <label className="lbl" htmlFor="med-name">Name</label>
              <input id="med-name" className="inp" placeholder="e.g. Metformin" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="lbl" htmlFor="med-dosage">Dosage</label>
              <input id="med-dosage" className="inp" placeholder="e.g. 500mg" value={form.dosage} onChange={set('dosage')} />
            </div>
            <div>
              <label className="lbl" htmlFor="med-freq">Frequency</label>
              <select id="med-freq" className="inp" value={form.frequency} onChange={set('frequency')}>
                {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl" htmlFor="med-time">Reminder time</label>
              <input id="med-time" className="inp" type="time" value={form.reminderTime} onChange={set('reminderTime')} />
            </div>
          </div>
          <label className="lbl" htmlFor="med-notes">Notes</label>
          <input id="med-notes" className="inp" placeholder="Take with food, etc." value={form.notes} onChange={set('notes')} />
          <button className="btn" type="button" onClick={saveMed}>Save</button>
        </div>
      )}

      <div className="g2e">
        <div className="card">
          <div className="sec-lbl">All medications</div>
          {meds.length === 0 && <p style={{ fontSize: 12, color: '#6a9a8a' }}>No medications added yet.</p>}
          {meds.map((m) => {
            const taken = adherence[m._id?.toString()];
            return (
              <div key={m._id} className="med-row" style={{ opacity: m.active ? 1 : 0.4 }}>
                <div style={{ width: 6, height: 6, background: m.active ? '#0a6e5c' : 'rgba(10,110,92,0.2)', flexShrink: 0 }} aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0d2820' }}>
                    {m.name} <span style={{ fontSize: 11.5, fontWeight: 400, color: '#6a9a8a' }}>{m.dosage}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#6a9a8a', marginTop: 1 }}>
                    {m.frequency}{m.reminderTime ? ` · ${m.reminderTime}` : ''}
                  </div>
                </div>
                {m.active && (
                  <button
                    type="button"
                    className="taken"
                    style={{ background: taken ? 'rgba(209,250,229,0.8)' : 'rgba(255,255,255,0.7)', borderColor: taken ? '#86efac' : 'rgba(10,110,92,0.2)', color: taken ? '#166534' : '#4a7a6a' }}
                    onClick={() => markTaken(m._id?.toString(), !taken)}
                  >
                    {taken ? 'Taken' : 'Mark taken'}
                  </button>
                )}
                <button
                  type="button"
                  className="taken"
                  style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(10,110,92,0.2)', color: '#6a9a8a', marginLeft: 5 }}
                  onClick={() => toggleActive(m._id)}
                >
                  {m.active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card">
            <div className="sec-lbl">Today&apos;s adherence</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#0a6e5c', letterSpacing: -2, lineHeight: 1, marginBottom: 8 }}>
              {adherePct}<span style={{ fontSize: 14, fontWeight: 400, color: '#6a9a8a' }}>%</span>
            </div>
            <Bar val={adherePct} color="#0a6e5c" max={100} />
            <div style={{ fontSize: 11.5, color: '#6a9a8a', marginTop: 7 }}>
              {takenCount} of {active.length} taken today
            </div>
          </div>

          <div className="card">
            <div className="sec-lbl">Weekly adherence</div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 56 }}>
              {weekBars.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: '100%', height: `${(val / 100) * 42}px`, background: val >= 80 ? '#0a6e5c' : val >= 50 ? '#d97706' : '#dc2626', opacity: 0.8, transition: 'height .5s ease' }} />
                  <div style={{ fontSize: 9.5, color: '#6a9a8a' }}>{'SMTWTFS'[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {inactive.length > 0 && (
            <div className="card">
              <div className="sec-lbl">Inactive</div>
              {inactive.map((m) => (
                <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, padding: '6px 0', borderBottom: '1px solid rgba(10,110,92,0.08)', color: '#6a9a8a' }}>
                  <span>{m.name} <span style={{ fontSize: 11 }}>{m.dosage}</span></span>
                  <button
                    type="button"
                    className="taken"
                    style={{ background: 'rgba(255,255,255,0.7)', borderColor: 'rgba(10,110,92,0.2)', color: '#4a7a6a' }}
                    onClick={() => toggleActive(m._id)}
                  >
                    Activate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast" role="status" style={{ position: 'fixed', bottom: 24, right: 24, margin: 0 }}>{toast}</div>}
    </div>
  );
}
