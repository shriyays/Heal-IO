import { useState, useEffect } from 'react';
import SliderField from '../components/SliderField';
import './DailyLog.css';

const today = new Date().toISOString().split('T')[0];
const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

const SYMPTOMS = [
  'Fatigue', 'Headache', 'Cramps', 'Bloating', 'Nausea',
  'Brain fog', 'Joint pain', 'Anxiety', 'Insomnia', 'Skin flare',
];
const FLOW_OPTIONS = ['None', 'Light', 'Medium', 'Heavy', 'Spotting', 'N/A'];

export default function DailyLog() {
  const [date, setDate] = useState(today);
  const [form, setForm] = useState({
    mood: 7, energy: 6, sleep: 7, pain: 3, cramp: 4,
    symptoms: [], meals: [], flow: 'None', notes: '',
  });
  const [mealInput, setMealInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSaved(false);
    setError('');
    fetch(`/api/dailylogs/${date}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            mood: data.mood ?? 7,
            energy: data.energy ?? 6,
            sleep: data.sleep ?? 7,
            pain: data.pain ?? 3,
            cramp: data.cramp ?? 4,
            symptoms: data.symptoms ?? [],
            meals: Array.isArray(data.meals) ? data.meals : (data.meals ? [data.meals] : []),
            flow: data.flow ?? 'None',
            notes: data.notes ?? '',
          });
        } else {
          setForm({ mood: 7, energy: 6, sleep: 7, pain: 3, cramp: 4, symptoms: [], meals: [], flow: 'None', notes: '' });
        }
      });
  }, [date]);

  function set(k, val) {
    setForm((f) => ({ ...f, [k]: val }));
  }

  function addMeal() {
    if (mealInput.trim()) {
      setForm((f) => ({ ...f, meals: [...f.meals, mealInput.trim()] }));
      setMealInput('');
    }
  }

  function removeMeal(i) {
    setForm((f) => ({ ...f, meals: f.meals.filter((_, j) => j !== i) }));
  }

  function toggleSym(s) {
    setForm((f) => ({
      ...f,
      symptoms: f.symptoms.includes(s) ? f.symptoms.filter((x) => x !== s) : [...f.symptoms, s],
    }));
  }

  async function handleSave() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dailylogs', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, ...form }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Could not save. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="pg-title">Daily Log</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
        <div className="pg-sub" style={{ margin: 0 }}>{date === today ? todayLabel : date}</div>
        <input
          type="date"
          className="inp"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: 'auto', margin: 0 }}
        />
      </div>

      {saved && <div className="toast" role="status">Today&apos;s log saved successfully.</div>}
      {error && <div className="toast error" role="alert">{error}</div>}

      <div className="g2e">
        {/* Left column */}
        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="sec-lbl">How are you feeling?</div>
            <div className="g2e">
              <SliderField label="Mood" name="mood" value={form.mood} onChange={set} color="#0a6e5c" />
              <SliderField label="Energy" name="energy" value={form.energy} onChange={set} color="#059669" />
              <SliderField label="Sleep quality" name="sleep" value={form.sleep} onChange={set} color="#7c3aed" />
              <SliderField label="Pain level" name="pain" value={form.pain} onChange={set} color="#dc2626" />
            </div>
            <SliderField label="Sleep hours" name="sleep" value={form.sleep} onChange={set} max={12} color="#7c3aed" />
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <div className="sec-lbl">Meals and diet</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                className="inp"
                style={{ margin: 0, flex: 1 }}
                placeholder="e.g. oatmeal with berries"
                value={mealInput}
                onChange={(e) => setMealInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMeal()}
              />
              <button className="btn" type="button" onClick={addMeal}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {form.meals.map((m, i) => (
                <span key={i} className="tag" style={{ background: 'rgba(209,250,229,0.8)', color: '#166534', gap: 5 }}>
                  {m}
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, padding: '0 0 0 4px', color: 'inherit' }}
                    onClick={() => removeMeal(i)}
                    aria-label={`Remove ${m}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="sec-lbl">Notes</div>
            <textarea
              className="inp"
              rows={3}
              placeholder="Anything else worth noting…"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="sec-lbl">Symptoms today</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SYMPTOMS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`sym${form.symptoms.includes(s) ? ' on' : ''}`}
                  onClick={() => toggleSym(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <div className="sec-lbl">Cycle tracking</div>
            <div className="lbl" style={{ marginBottom: 8 }}>Flow today</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 14 }}>
              {FLOW_OPTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`cyc${form.flow === f ? ' on' : ''}`}
                  onClick={() => set('flow', f)}
                >
                  {f}
                </button>
              ))}
            </div>
            <SliderField label="Cramping" name="cramp" value={form.cramp} onChange={set} color="#e11d48" />
          </div>

          <button className="btn-full" type="button" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : "Save today's log"}
          </button>
        </div>
      </div>
    </div>
  );
}
