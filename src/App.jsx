import { useState, useEffect } from "react";

const C = {
  cream: "#FDF6EE", blush: "#F2C4B0", rose: "#C97B6B", mauve: "#8B4F5E",
  plum: "#4A2535", gold: "#C9A84C", sage: "#7A9E7E", warm: "#FFFAF5",
};

// ─────────────────────────────────────────────
// REPLACE THESE WITH YOUR REAL LINKS
const PAID_DASHBOARD_URL = "https://mamalitas-client-dashboard.vercel.app";
const PURCHASE_URL = "https://mamalita.gumroad.com/l/qlxxolu";
const COACH_EMAIL = "mama.lita.daughters@gmail.com";
// ─────────────────────────────────────────────

const wisdoms = [
  "She considers a field and buys it; out of her earnings she plants a vineyard. — Proverbs 31:16",
  "A little every day adds up to a life well-built.",
  "Plan with intention. Spend with purpose. Save with hope.",
  "You are not just managing money. You are building a legacy.",
  "Mama, your steady hand shapes more than budgets — it shapes futures.",
];

const defaultBudget = [
  { id: 1, category: "Groceries & Food", budgeted: 800, spent: 0, icon: "🛒" },
  { id: 2, category: "Kids & School", budgeted: 400, spent: 0, icon: "🎒" },
  { id: 3, category: "Housing & Utilities", budgeted: 2200, spent: 0, icon: "🏠" },
  { id: 4, category: "Healthcare", budgeted: 300, spent: 0, icon: "💊" },
  { id: 5, category: "Transportation", budgeted: 500, spent: 0, icon: "🚗" },
  { id: 6, category: "Self-Care & Misc", budgeted: 150, spent: 0, icon: "✨" },
];
const defaultSavings = [
  { id: 1, name: "Emergency Fund", goal: 10000, saved: 0, icon: "🛡️", color: C.sage },
  { id: 2, name: "Family Vacation", goal: 3000, saved: 0, icon: "🌴", color: C.gold },
  { id: 3, name: "Back to School", goal: 800, saved: 0, icon: "📚", color: C.rose },
  { id: 4, name: "Christmas Fund", goal: 1500, saved: 0, icon: "🎁", color: C.mauve },
];
const defaultDebts = [
  { id: 1, name: "Credit Card", balance: 0, payment: 0, rate: 0, icon: "💳" },
  { id: 2, name: "Car Loan", balance: 0, payment: 0, rate: 0, icon: "🚗" },
  { id: 3, name: "Medical Bill", balance: 0, payment: 0, rate: 0, icon: "🏥" },
];
const ICONS = ["🛒","🎒","🏠","💊","🚗","✨","💳","🏥","🌴","📚","🎁","🛡️","💰","🏦","📱","🍽️","👗","⛽","🎓","🏋️","🐾","🎮","✈️","🎄"];

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ── UI PRIMITIVES ──
function Card({ children, style = {} }) {
  return <div style={{ background: C.warm, borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 18px rgba(74,37,53,0.07)", border: "1px solid rgba(201,168,76,0.18)", ...style }}>{children}</div>;
}

function ProgressBar({ value, max, color = C.rose }) {
  const pct = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div style={{ background: "#E8DDD5", borderRadius: 99, height: 10, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: value > max && max > 0 ? "#C0392B" : color, transition: "width 0.6s ease" }} />
    </div>
  );
}

function NumInput({ value, onChange, prefix }) {
  return (
    <div style={{ display: "flex", alignItems: "center", background: C.cream, border: `1.5px solid ${C.blush}`, borderRadius: 8, padding: "5px 10px" }}>
      {prefix && <span style={{ color: C.mauve, fontSize: 13, marginRight: 2 }}>{prefix}</span>}
      <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{ border: "none", background: "transparent", outline: "none", fontFamily: "Georgia, serif", fontSize: 13, color: C.plum, width: 72, textAlign: "right" }} />
    </div>
  );
}

function TxtInput({ value, onChange, placeholder }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ border: `1.5px solid ${C.blush}`, background: C.cream, borderRadius: 8, padding: "5px 10px", fontFamily: "Georgia, serif", fontSize: 13, color: C.plum, outline: "none", width: 130 }} />
  );
}

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ fontSize: 20, background: C.cream, border: `1px solid ${C.blush}`, borderRadius: 8, padding: "4px 8px", cursor: "pointer" }}>{value}</button>
      {open && (
        <div style={{ position: "absolute", top: 38, left: 0, zIndex: 200, background: "#fff", border: `1px solid ${C.blush}`, borderRadius: 12, padding: 10, display: "flex", flexWrap: "wrap", gap: 4, width: 210, boxShadow: "0 8px 24px rgba(74,37,53,0.15)" }}>
          {ICONS.map(ic => (
            <button key={ic} onClick={() => { onChange(ic); setOpen(false); }}
              style={{ fontSize: 20, border: "none", cursor: "pointer", padding: 4, borderRadius: 6, background: ic === value ? C.blush : "transparent" }}>{ic}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function EditBar({ editing, onToggle, onAdd, addLabel }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 4 }}>
      <button onClick={onToggle} style={{ background: editing ? C.mauve : C.cream, color: editing ? "#fff" : C.mauve, border: `1.5px solid ${C.mauve}`, borderRadius: 50, padding: "6px 16px", fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: 600 }}>
        {editing ? "✓ Done" : "✏️ Edit"}
      </button>
      {editing && <button onClick={onAdd} style={{ background: C.sage, color: "#fff", border: "none", borderRadius: 50, padding: "6px 16px", fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer", fontWeight: 600 }}>+ {addLabel}</button>}
    </div>
  );
}

// ── UPGRADE BANNER ──
function UpgradeBanner() {
  const [dismissed, setDismissed] = useState(() => load("ml_upgrade_dismissed", false));
  if (dismissed) return null;
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.gold}, #b8902a)`, borderRadius: 16, padding: "16px 18px", marginBottom: 14, position: "relative" }}>
      <button onClick={() => { setDismissed(true); save("ml_upgrade_dismissed", true); }}
        style={{ position: "absolute", top: 10, right: 14, background: "none", border: "none", color: "rgba(74,37,53,0.5)", fontSize: 18, cursor: "pointer", fontWeight: 700 }}>×</button>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.plum, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
        Want your data to follow you? 🔒
      </div>
      <div style={{ color: C.plum, fontSize: 12, fontFamily: "Georgia, serif", lineHeight: 1.6, marginBottom: 12, opacity: 0.85 }}>
        Upgrade to a <strong>Private Dashboard</strong> — your numbers save securely to your own personal link. Works across sessions, shareable with your coach.
      </div>
      <a href={PURCHASE_URL} target="_blank" rel="noreferrer" style={{
        display: "inline-block", background: C.plum, color: C.gold,
        fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
        fontSize: 13, padding: "9px 20px", borderRadius: 50, textDecoration: "none",
        letterSpacing: "0.03em",
      }}>Upgrade for $30 →</a>
    </div>
  );
}

// ── BUDGET TAB ──
function BudgetTab() {
  const [budget, setBudget] = useState(() => load("ml_budget", defaultBudget));
  const [editing, setEditing] = useState(false);
  useEffect(() => save("ml_budget", budget), [budget]);
  const upd = (id, f, v) => setBudget(b => b.map(i => i.id === id ? { ...i, [f]: v } : i));
  const totalBudgeted = budget.reduce((a, b) => a + b.budgeted, 0);
  const totalSpent = budget.reduce((a, b) => a + b.spent, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <UpgradeBanner />
      <Card style={{ background: `linear-gradient(135deg, ${C.mauve}, ${C.plum})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          {[["Monthly Budget", `$${totalBudgeted.toLocaleString()}`, false], ["Spent", `$${totalSpent.toLocaleString()}`, false], ["Remaining", `$${(totalBudgeted - totalSpent).toLocaleString()}`, true]].map(([l, v, h]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ color: h ? C.gold : "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
              <div style={{ color: h ? C.gold : "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}><ProgressBar value={totalSpent} max={totalBudgeted} color={C.gold} /></div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 6, textAlign: "right", fontFamily: "Georgia, serif" }}>
          {totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0}% used
        </div>
      </Card>
      <EditBar editing={editing} onToggle={() => setEditing(!editing)}
        onAdd={() => setBudget(b => [...b, { id: Date.now(), category: "New Category", budgeted: 0, spent: 0, icon: "💰" }])}
        addLabel="Category" />
      {budget.map(item => {
        const pct = item.budgeted > 0 ? Math.round((item.spent / item.budgeted) * 100) : 0;
        const isOver = item.spent > item.budgeted && item.budgeted > 0;
        return (
          <Card key={item.id}>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <IconPicker value={item.icon} onChange={v => upd(item.id, "icon", v)} />
                  <TxtInput value={item.category} onChange={v => upd(item.id, "category", v)} placeholder="Category" />
                  <button onClick={() => setBudget(b => b.filter(i => i.id !== item.id))} style={{ background: "#fee", border: "1px solid #fcc", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: "#c00" }}>🗑</button>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div><div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Budget/mo</div><NumInput value={item.budgeted} onChange={v => upd(item.id, "budgeted", v)} prefix="$" /></div>
                  <div><div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Spent</div><NumInput value={item.spent} onChange={v => upd(item.id, "spent", v)} prefix="$" /></div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontFamily: "Georgia, serif", color: C.plum, fontSize: 14, fontWeight: 600 }}>{item.category}</span>
                  </div>
                  <div>
                    <span style={{ color: isOver ? "#C0392B" : C.sage, fontWeight: 700, fontSize: 14 }}>${item.spent.toLocaleString()}</span>
                    <span style={{ color: "#999", fontSize: 12 }}> / ${item.budgeted.toLocaleString()}</span>
                  </div>
                </div>
                <ProgressBar value={item.spent} max={item.budgeted} color={pct > 90 ? "#C0392B" : pct > 70 ? C.gold : C.sage} />
                <div style={{ fontSize: 11, color: isOver ? "#C0392B" : "#999", marginTop: 5, textAlign: "right", fontFamily: "Georgia, serif" }}>
                  {isOver ? `⚠️ Over by $${(item.spent - item.budgeted).toLocaleString()}` : `${pct}% used`}
                </div>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ── SAVINGS TAB ──
function SavingsTab() {
  const [savings, setSavings] = useState(() => load("ml_savings", defaultSavings));
  const [editing, setEditing] = useState(false);
  useEffect(() => save("ml_savings", savings), [savings]);
  const upd = (id, f, v) => setSavings(s => s.map(i => i.id === id ? { ...i, [f]: v } : i));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card style={{ background: `linear-gradient(135deg, ${C.sage}, #5A7E5E)` }}>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Saved</div>
        <div style={{ color: "#fff", fontSize: 28, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, marginTop: 4 }}>${savings.reduce((a, b) => a + b.saved, 0).toLocaleString()}</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 2 }}>of ${savings.reduce((a, b) => a + b.goal, 0).toLocaleString()} across {savings.length} goals</div>
      </Card>
      <EditBar editing={editing} onToggle={() => setEditing(!editing)}
        onAdd={() => setSavings(s => [...s, { id: Date.now(), name: "New Goal", goal: 0, saved: 0, icon: "🏦", color: C.rose }])}
        addLabel="Goal" />
      {savings.map(item => {
        const pct = item.goal > 0 ? Math.round((item.saved / item.goal) * 100) : 0;
        const done = item.saved >= item.goal && item.goal > 0;
        return (
          <Card key={item.id}>
            {editing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <IconPicker value={item.icon} onChange={v => upd(item.id, "icon", v)} />
                  <TxtInput value={item.name} onChange={v => upd(item.id, "name", v)} placeholder="Goal name" />
                  <button onClick={() => setSavings(s => s.filter(i => i.id !== item.id))} style={{ background: "#fee", border: "1px solid #fcc", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: "#c00" }}>🗑</button>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div><div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Goal</div><NumInput value={item.goal} onChange={v => upd(item.id, "goal", v)} prefix="$" /></div>
                  <div><div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Saved</div><NumInput value={item.saved} onChange={v => upd(item.id, "saved", v)} prefix="$" /></div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontFamily: "Georgia, serif", color: C.plum, fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>Goal: ${item.goal.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ background: done ? C.sage : C.blush, color: done ? "#fff" : C.mauve, borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{done ? "✓ Done!" : `${pct}%`}</div>
                </div>
                <ProgressBar value={item.saved} max={item.goal} color={item.color} />
                <div style={{ fontSize: 12, color: C.rose, marginTop: 6, fontFamily: "Georgia, serif" }}>${Math.max(0, item.goal - item.saved).toLocaleString()} left to go</div>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ── DEBT TAB ──
function DebtTab() {
  const [debts, setDebts] = useState(() => load("ml_debts", defaultDebts));
  const [editing, setEditing] = useState(false);
  useEffect(() => save("ml_debts", debts), [debts]);
  const upd = (id, f, v) => setDebts(d => d.map(i => i.id === id ? { ...i, [f]: v } : i));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.mauve})` }}>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Debt</div>
        <div style={{ color: "#fff", fontSize: 28, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, marginTop: 4 }}>${debts.reduce((a, b) => a + b.balance, 0).toLocaleString()}</div>
        <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 }}>Every payment counts. 💪</div>
      </Card>
      <EditBar editing={editing} onToggle={() => setEditing(!editing)}
        onAdd={() => setDebts(d => [...d, { id: Date.now(), name: "New Debt", balance: 0, payment: 0, rate: 0, icon: "💳" }])}
        addLabel="Debt" />
      {debts.map(item => (
        <Card key={item.id}>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <IconPicker value={item.icon} onChange={v => upd(item.id, "icon", v)} />
                <TxtInput value={item.name} onChange={v => upd(item.id, "name", v)} placeholder="Debt name" />
                <button onClick={() => setDebts(d => d.filter(i => i.id !== item.id))} style={{ background: "#fee", border: "1px solid #fcc", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: "#c00" }}>🗑</button>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Balance</div><NumInput value={item.balance} onChange={v => upd(item.id, "balance", v)} prefix="$" /></div>
                <div><div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Payment/mo</div><NumInput value={item.payment} onChange={v => upd(item.id, "payment", v)} prefix="$" /></div>
                <div><div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Rate %</div><NumInput value={item.rate} onChange={v => upd(item.id, "rate", v)} prefix="%" /></div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "Georgia, serif", color: C.plum, fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>{item.rate > 0 ? `${item.rate}% APR` : "0% interest"}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: C.mauve, fontWeight: 700, fontSize: 16 }}>${item.balance.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>${item.payment}/mo</div>
                </div>
              </div>
              {item.balance > 0 && item.payment > 0 && (
                <div style={{ marginTop: 12, background: "#F7EFE8", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: C.plum, fontFamily: "Georgia, serif" }}>
                  💡 Paid off in ~{Math.ceil(item.balance / item.payment)} months
                </div>
              )}
            </>
          )}
        </Card>
      ))}
    </div>
  );
}

// ── AI / UPGRADE TAB ──
function PremiumTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card style={{ background: `linear-gradient(135deg, ${C.plum}, ${C.mauve})`, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>👜</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#fff", fontSize: 22, fontWeight: 700 }}>Go Premium</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4, fontFamily: "Georgia, serif" }}>Everything you need to manage money like a Proverbs 31 mama</div>
      </Card>

      {/* Free vs Paid comparison */}
      <Card>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.plum, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Free vs Premium</div>
        {[
          { feature: "Budget tracker", free: true, paid: true },
          { feature: "Savings goals", free: true, paid: true },
          { feature: "Debt payoff planner", free: true, paid: true },
          { feature: "Edit & customize categories", free: true, paid: true },
          { feature: "Your own private link", free: false, paid: true },
          { feature: "Numbers saved across devices", free: false, paid: true },
          { feature: "Share with your coach", free: false, paid: true },
          { feature: "Ask Mama Lita AI Coach", free: false, paid: true },
        ].map(item => (
          <div key={item.feature} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #F5EDE6" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 13, color: C.plum }}>{item.feature}</span>
            <div style={{ display: "flex", gap: 24 }}>
              <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{item.free ? "✅" : "❌"}</span>
              <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{item.paid ? "✅" : "❌"}</span>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, marginTop: 8 }}>
          <span style={{ fontSize: 11, color: "#aaa", fontFamily: "Georgia, serif", width: 24, textAlign: "center" }}>Free</span>
          <span style={{ fontSize: 11, color: C.gold, fontFamily: "Georgia, serif", fontWeight: 700, width: 24, textAlign: "center" }}>Premium</span>
        </div>
      </Card>

      {/* CTA card */}
      <Card style={{ border: `2px solid ${C.gold}`, textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.plum, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          One-Time Payment
        </div>
        <div style={{ fontSize: 40, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: C.mauve, marginBottom: 4 }}>$30</div>
        <div style={{ fontSize: 12, color: "#aaa", fontFamily: "Georgia, serif", marginBottom: 16 }}>Pay once. Yours forever. 🌸</div>
        <div style={{ background: C.cream, borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 13, color: C.plum, borderLeft: `3px solid ${C.gold}`, textAlign: "left" }}>
          "She considers a field and buys it." — Proverbs 31:16<br />
          <span style={{ fontSize: 12, color: "#aaa", fontStyle: "normal" }}>Investing in your financial health is an act of stewardship, mama.</span>
        </div>
        <a href={PURCHASE_URL} target="_blank" rel="noreferrer" style={{
          display: "block", background: `linear-gradient(135deg, ${C.gold}, #b8902a)`,
          color: C.plum, fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: 16, padding: "15px 24px", borderRadius: 50,
          textDecoration: "none", letterSpacing: "0.03em", marginBottom: 10,
        }}>
          Upgrade to Premium →
        </a>
        <a href={`mailto:${COACH_EMAIL}?subject=Premium Dashboard`} style={{ fontSize: 12, color: C.mauve, fontFamily: "Georgia, serif" }}>
          Questions? Email us →
        </a>
      </Card>

      {/* Testimonial placeholder */}
      <Card style={{ background: `${C.mauve}10`, border: `1px solid ${C.blush}` }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 14, color: C.plum, lineHeight: 1.7, marginBottom: 8 }}>
          "Having my own private dashboard changed everything. I finally feel like I know where we stand — and my coach can see my progress too."
        </div>
        <div style={{ fontSize: 12, color: C.rose, fontFamily: "Georgia, serif", fontWeight: 700 }}>— Maria R., Premium Member 🌸</div>
      </Card>
    </div>
  );
}

// ── MAIN APP ──
export default function App() {
  const [tab, setTab] = useState("budget");
  const [wisdom] = useState(() => wisdoms[Math.floor(Math.random() * wisdoms.length)]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const tabs = [
    { id: "budget", label: "Budget", icon: "💰" },
    { id: "savings", label: "Savings", icon: "🏦" },
    { id: "debt", label: "Debt", icon: "📉" },
    { id: "premium", label: "Upgrade", icon: "👑" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.cream, paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(160deg, ${C.plum} 0%, ${C.mauve} 100%)`, padding: "28px 20px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(201,168,76,0.12)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: C.gold, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "Georgia, serif", marginBottom: 4 }}>Mama Lita's · Free</div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#fff", fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>Family Finance<br />Dashboard</div>
            </div>
            <a href={PURCHASE_URL} target="_blank" rel="noreferrer" style={{
              background: C.gold, color: C.plum, fontFamily: "Georgia, serif",
              fontWeight: 700, fontSize: 11, padding: "6px 14px", borderRadius: 50,
              textDecoration: "none", letterSpacing: "0.04em", marginTop: 4, whiteSpace: "nowrap",
            }}>👑 Upgrade $30</a>
          </div>
          <div style={{ marginTop: 14, background: "rgba(201,168,76,0.15)", borderLeft: `2px solid ${C.gold}`, padding: "8px 12px", borderRadius: "0 8px 8px 0" }}>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontStyle: "italic", lineHeight: 1.6, fontFamily: "Georgia, serif" }}>"{wisdom}"</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {tab === "budget" && <BudgetTab />}
        {tab === "savings" && <SavingsTab />}
        {tab === "debt" && <DebtTab />}
        {tab === "premium" && <PremiumTab />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.warm, borderTop: `1px solid ${C.blush}`, display: "flex", justifyContent: "space-around", padding: "10px 0 16px", boxShadow: "0 -4px 20px rgba(74,37,53,0.08)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 16px" }}>
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontFamily: "Georgia, serif", color: tab === t.id ? (t.id === "premium" ? C.gold : C.mauve) : "#bbb", fontWeight: tab === t.id ? 700 : 400, letterSpacing: "0.05em" }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 2, background: t.id === "premium" ? C.gold : C.gold, borderRadius: 99 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
