import { useEffect, useState } from 'react';
import Bar from '../components/Bar';
import '../css/pages/Analytics.css';

function getNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function avg(logs, key) {
  const vals = logs.map((l) => l[key]).filter((v) => v != null);
  return vals.length ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : '—';
}

function symFreq(logs) {
  const map = {};
  logs.forEach((l) =>
    (l.symptoms || []).forEach((s) => {
      map[s] = (map[s] || 0) + 1;
    })
  );
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

const SYM_COLORS = ['#dc2626', '#e11d48', '#d97706', '#7c3aed', '#0a6e5c'];

export default function Analytics() {
  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    fetch('/api/dailylogs', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setLogs(d);
      });
  }, []);

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const from = getNDaysAgo(days);
  const filtered = logs.filter((l) => l.date >= from).sort((a, b) => a.date.localeCompare(b.date));
  const chartLogs = filtered.slice(-7);

  const poor = filtered.filter((l) => l.sleep != null && l.sleep < 6);
  const okay = filtered.filter((l) => l.sleep != null && l.sleep >= 6 && l.sleep < 7);
  const good = filtered.filter((l) => l.sleep != null && l.sleep >= 7);

  function bucketPain(arr) {
    const v = arr.map((l) => l.pain).filter((x) => x != null);
    return v.length ? (v.reduce((s, x) => s + x, 0) / v.length).toFixed(1) : '—';
  }

  const poorPain = bucketPain(poor);
  const okayPain = bucketPain(okay);
  const goodPain = bucketPain(good);
  const topSyms = symFreq(filtered);

  const radarItems = [
    ['Mood', parseFloat(avg(filtered, 'mood')) || 0, '#0a6e5c'],
    ['Energy', parseFloat(avg(filtered, 'energy')) || 0, '#059669'],
    ['Sleep', parseFloat(avg(filtered, 'sleep')) || 0, '#7c3aed'],
    ['Pain', parseFloat(avg(filtered, 'pain')) || 0, '#dc2626'],
  ];

  return (
    <div>
      <div className="pg-title">Analytics</div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 20 }}>
        {['7d', '30d', '90d'].map((r) => (
          <button
            key={r}
            type="button"
            className={`rpill${range === r ? ' on' : ''}`}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="met-row">
        {[
          [avg(filtered, 'mood'), 'Avg Mood', '#0a6e5c'],
          [avg(filtered, 'energy'), 'Avg Energy', '#059669'],
          [`${avg(filtered, 'sleep')}h`, 'Avg Sleep', '#7c3aed'],
          [avg(filtered, 'pain'), 'Avg Pain', '#dc2626'],
        ].map(([val, lbl, color]) => (
          <div key={lbl} className="met-card" style={{ borderTopColor: color }}>
            <div className="met-val" style={{ color }}>
              {val}
            </div>
            <div className="met-lbl">{lbl}</div>
          </div>
        ))}
      </div>

      <div className="g2" style={{ marginBottom: 12 }}>
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div className="sec-lbl" style={{ margin: 0 }}>
              Trends — {range}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                ['Mood', '#0a6e5c'],
                ['Energy', '#059669'],
                ['Pain', '#dc2626'],
              ].map(([lbl, color]) => (
                <div
                  key={lbl}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 10.5,
                    color: '#6a9a8a',
                  }}
                >
                  <div style={{ width: 7, height: 7, background: color }} aria-hidden="true" />
                  {lbl}
                </div>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <p style={{ fontSize: 12, color: '#6a9a8a' }}>
              No data for this period. Start logging to see trends.
            </p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90 }}>
              {chartLogs.map((l) => (
                <div
                  key={l._id}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 70 }}>
                    {[
                      [l.mood || 0, '#0a6e5c'],
                      [l.energy || 0, '#059669'],
                      [l.pain || 0, '#dc2626'],
                    ].map(([val, color], j) => (
                      <div
                        key={j}
                        style={{
                          width: 7,
                          height: `${(val / 10) * 70}px`,
                          background: color,
                          opacity: 0.75,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: '#6a9a8a' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][new Date(l.date).getDay()]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="sec-lbl">Sleep vs pain</div>
          {[
            ['Poor (&lt;6h)', poorPain, '#dc2626'],
            ['Okay (6–7h)', okayPain, '#d97706'],
            ['Good (7h+)', goodPain, '#059669'],
          ].map(([lbl, val, color]) => (
            <div key={lbl} style={{ marginBottom: 14 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  marginBottom: 5,
                }}
              >
                <span style={{ color: '#4a7a6a' }} dangerouslySetInnerHTML={{ __html: lbl }} />
                <span style={{ color, fontWeight: 700 }}>{val}</span>
              </div>
              <Bar val={parseFloat(val) || 0} color={color} />
            </div>
          ))}
          {goodPain !== '—' && poorPain !== '—' && (
            <div className="insight">
              7h+ sleep reduced pain by{' '}
              <strong>
                {Math.round((1 - parseFloat(goodPain) / parseFloat(poorPain)) * 100)}%
              </strong>
            </div>
          )}
        </div>
      </div>

      <div className="g2e">
        <div className="card">
          <div className="sec-lbl">Top symptoms</div>
          {topSyms.length === 0 ? (
            <p style={{ fontSize: 12, color: '#6a9a8a' }}>No symptom data yet</p>
          ) : (
            topSyms.map(([sym, count], idx) => (
              <div
                key={sym}
                style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}
              >
                <div
                  style={{ width: 6, height: 6, background: SYM_COLORS[idx], flexShrink: 0 }}
                  aria-hidden="true"
                />
                <div style={{ flex: 1, fontSize: 12.5, color: '#2d4a3e' }}>{sym}</div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: SYM_COLORS[idx] }}>
                  {count}x
                </span>
                <div style={{ width: 80 }}>
                  <Bar val={count} color={SYM_COLORS[idx]} max={Math.max(count, 7)} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="sec-lbl">Averages</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
            {radarItems.map(([lbl, val, color]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 44, height: 44, margin: '0 auto 5px' }}>
                  <svg
                    viewBox="0 0 36 36"
                    style={{ transform: 'rotate(-90deg)', width: 44, height: 44 }}
                    aria-hidden="true"
                  >
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="rgba(10,110,92,0.12)"
                      strokeWidth="3"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={color}
                      strokeWidth="3"
                      strokeDasharray={`${(val / 10) * 88} 88`}
                      strokeLinecap="butt"
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%,-50%)',
                      fontSize: 10.5,
                      fontWeight: 700,
                      color,
                    }}
                  >
                    {val}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 9.5,
                    color: '#6a9a8a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
