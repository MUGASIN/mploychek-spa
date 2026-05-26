import { useState, useEffect, useCallback } from "react";

const DB_KEY = "mploychek_db";
const seedDB = () => {
  const existing = localStorage.getItem(DB_KEY);
  if (existing) return JSON.parse(existing);
  const data = {
    users: [
      { id: "USR001", username: "admin", password: "admin123", role: "Admin", name: "Mugasin", email: "Mugasin@gmail.com", dept: "Engineering", status: "Active", joined: "2024-01-15" },
      { id: "USR002", username: "alice", password: "alice123", role: "General User", name: "Alice Mendes", email: "alice@nsqtech.com", dept: "HR", status: "Active", joined: "2024-03-10" },
      { id: "USR003", username: "bob", password: "bob123", role: "General User", name: "Bob Kiran", email: "bob@nsqtech.com", dept: "Finance", status: "Active", joined: "2024-05-20" },
      { id: "USR004", username: "carol", password: "carol123", role: "General User", name: "Carol Nair", email: "carol@nsqtech.com", dept: "Operations", status: "Inactive", joined: "2023-11-01" },
    ],
    records: [
      { id: "REC001", owner: "USR001", title: "Q1 Verification Report", type: "Background Check", status: "Verified", date: "2026-04-01", score: 98 },
      { id: "REC002", owner: "USR001", title: "Onboarding Package", type: "Document Review", status: "Pending", date: "2026-04-15", score: 72 },
      { id: "REC003", owner: "USR002", title: "Employment History", type: "Background Check", status: "Verified", date: "2026-03-20", score: 95 },
      { id: "REC004", owner: "USR002", title: "Education Credentials", type: "Academic Check", status: "Flagged", date: "2026-04-22", score: 45 },
      { id: "REC005", owner: "USR003", title: "Finance Audit Trail", type: "Financial Check", status: "Verified", date: "2026-02-10", score: 88 },
      { id: "REC006", owner: "USR003", title: "Reference Letters", type: "Reference Check", status: "Pending", date: "2026-04-30", score: 60 },
      { id: "REC007", owner: "USR004", title: "Criminal Record Check", type: "Background Check", status: "Verified", date: "2026-01-05", score: 100 },
      { id: "REC008", owner: "USR001", title: "Social Media Audit", type: "Digital Check", status: "Verified", date: "2026-05-01", score: 82 },
    ],
  };
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  return data;
};
const getDB = () => { const d = localStorage.getItem(DB_KEY); return d ? JSON.parse(d) : seedDB(); };
const saveDB = (data) => localStorage.setItem(DB_KEY, JSON.stringify(data));

const api = {
  login: async (username, password, role, delay = 800) => {
    await new Promise(r => setTimeout(r, delay));
    const db = getDB();
    const user = db.users.find(u => u.username === username && u.password === password && u.role === role);
    if (!user) throw new Error("Invalid credentials or role mismatch.");
    const { password: _, ...safe } = user; return safe;
  },
  getRecords: async (userId, role, delay = 1200) => {
    await new Promise(r => setTimeout(r, delay));
    const db = getDB();
    return role === "Admin" ? db.records : db.records.filter(r => r.owner === userId);
  },
  getUsers: async (delay = 1000) => {
    await new Promise(r => setTimeout(r, delay));
    return getDB().users.map(({ password: _, ...u }) => u);
  },
  addUser: async (userData, delay = 700) => {
    await new Promise(r => setTimeout(r, delay));
    const db = getDB();
    if (db.users.find(u => u.username === userData.username)) throw new Error("Username already exists.");
    const newUser = { ...userData, id: `USR${String(db.users.length + 1).padStart(3, "0")}`, joined: new Date().toISOString().split("T")[0] };
    db.users.push(newUser); saveDB(db);
    const { password: _, ...safe } = newUser; return safe;
  },
  updateUser: async (id, patch, delay = 600) => {
    await new Promise(r => setTimeout(r, delay));
    const db = getDB();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("User not found.");
    db.users[idx] = { ...db.users[idx], ...patch }; saveDB(db);
    const { password: _, ...safe } = db.users[idx]; return safe;
  },
  deleteUser: async (id, delay = 500) => {
    await new Promise(r => setTimeout(r, delay));
    const db = getDB();
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("User not found.");
    db.users.splice(idx, 1); saveDB(db); return { success: true };
  },
};

const AppService = {
  _listeners: [], _state: { session: null, apiDelay: 900 },
  get: () => AppService._state,
  set: (patch) => { AppService._state = { ...AppService._state, ...patch }; AppService._listeners.forEach(fn => fn(AppService._state)); },
  subscribe: (fn) => { AppService._listeners.push(fn); return () => { AppService._listeners = AppService._listeners.filter(f => f !== fn); }; },
};
const useAppService = () => {
  const [state, setState] = useState(AppService.get());
  useEffect(() => AppService.subscribe(setState), []);
  return [state, AppService.set];
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700;900&family=Nunito:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#eef2f7;--glass:rgba(255,255,255,0.55);--glass-strong:rgba(255,255,255,0.78);
    --glass-border:rgba(255,255,255,0.9);--border:rgba(160,185,230,0.35);
    --shadow-c:rgba(100,130,200,0.18);--accent:#4f6ef7;--accent2:#38c9b0;
    --accent3:#a855f7;--danger:#f43f5e;--warn:#f59e0b;
    --text:#1a2140;--text2:#3d4f7a;--muted:#7a8bb8;
    --fh:'Playfair Display',serif;--fb:'Nunito',sans-serif;--fm:'JetBrains Mono',monospace;
    --r:18px;--blur:blur(18px);
    --sh:0 8px 32px var(--shadow-c),0 1px 0 var(--glass-border) inset;
    --sh-lg:0 20px 60px rgba(80,110,200,0.22),0 1px 0 var(--glass-border) inset;
  }
  body{background:var(--bg);color:var(--text);font-family:var(--fb)}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(79,110,247,0.2);border-radius:10px}
  .mesh-bg{position:fixed;inset:0;z-index:0;pointer-events:none;
    background:radial-gradient(ellipse 70% 60% at 15% 20%,#c3d4ff 0%,transparent 55%),
    radial-gradient(ellipse 55% 55% at 85% 15%,#bce8f5 0%,transparent 55%),
    radial-gradient(ellipse 60% 50% at 70% 85%,#d5d0fb 0%,transparent 55%),
    radial-gradient(ellipse 50% 45% at 10% 80%,#c5ede7 0%,transparent 55%),#dde8f5}
  .blob{position:absolute;border-radius:50%;filter:blur(60px);animation:drift 12s ease-in-out infinite alternate}
  @keyframes drift{0%{transform:translate(0,0) scale(1)}100%{transform:translate(30px,-20px) scale(1.08)}}
  .app{min-height:100vh;display:flex;flex-direction:column;position:relative;z-index:1}
  .shell{display:flex;flex:1}
  .sidebar{width:256px;flex-shrink:0;background:var(--glass-strong);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-right:1px solid var(--glass-border);display:flex;flex-direction:column;padding:28px 0 20px;box-shadow:4px 0 24px var(--shadow-c);position:sticky;top:0;height:100vh}
  .logo{font-family:var(--fh);font-size:21px;font-weight:900;color:var(--accent);padding:0 22px 22px;letter-spacing:-.5px;border-bottom:1px solid var(--border);margin-bottom:14px}
  .logo em{font-style:normal;color:var(--accent2)}.logo-sub{font-family:var(--fb);font-size:10px;font-weight:600;color:var(--muted);letter-spacing:1.5px;text-transform:uppercase;display:block;margin-top:2px}
  .np{padding:0 12px}
  .ni{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:12px;font-size:13.5px;color:var(--text2);cursor:pointer;transition:all .18s;font-weight:600;font-family:var(--fb);position:relative}
  .ni:hover{background:rgba(79,110,247,0.07);color:var(--accent)}
  .ni.act{background:linear-gradient(135deg,rgba(79,110,247,0.13),rgba(56,201,176,0.07));color:var(--accent);box-shadow:0 2px 12px rgba(79,110,247,0.1)}
  .ni.act::before{content:'';position:absolute;left:0;top:25%;bottom:25%;width:3px;border-radius:2px;background:linear-gradient(to bottom,var(--accent),var(--accent2))}
  .nic{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;background:rgba(79,110,247,0.07);flex-shrink:0;transition:all .18s}
  .ni.act .nic{background:linear-gradient(135deg,var(--accent),var(--accent2))}
  .topbar{background:var(--glass-strong);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-bottom:1px solid var(--glass-border);padding:13px 30px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 16px var(--shadow-c);position:sticky;top:0;z-index:50}
  .tb-brand{font-family:var(--fh);font-size:13px;font-weight:700;color:var(--muted)}
  .tb-right{display:flex;align-items:center;gap:12px}
  .upill{display:flex;align-items:center;gap:9px;background:rgba(79,110,247,0.07);border:1px solid rgba(79,110,247,0.14);border-radius:50px;padding:5px 14px 5px 5px;font-size:13px;font-weight:600}
  .av{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:var(--fh);color:#fff;flex-shrink:0}
  .rtag{font-size:10px;font-family:var(--fm);font-weight:500;padding:3px 9px;border-radius:20px;background:rgba(79,110,247,0.1);color:var(--accent);border:1px solid rgba(79,110,247,0.2)}
  .rtag.adm{background:rgba(56,201,176,0.1);color:var(--accent2);border-color:rgba(56,201,176,0.25)}
  .main{flex:1;padding:30px;overflow-y:auto}
  .card{background:var(--glass);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border:1px solid var(--glass-border);border-radius:var(--r);padding:24px;box-shadow:var(--sh)}
  .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:50px;font-size:13px;font-family:var(--fb);font-weight:700;cursor:pointer;border:none;transition:all .18s}
  .btn-p{background:linear-gradient(135deg,var(--accent),#7b8ef9);color:#fff;box-shadow:0 4px 16px rgba(79,110,247,0.3)}
  .btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(79,110,247,0.4)}
  .btn-g{background:rgba(255,255,255,0.55);color:var(--text2);border:1px solid var(--border);backdrop-filter:blur(8px)}
  .btn-g:hover{background:rgba(255,255,255,0.85)}
  .btn-d{background:rgba(244,63,94,0.09);color:var(--danger);border:1px solid rgba(244,63,94,0.18)}
  .btn-d:hover{background:rgba(244,63,94,0.16)}
  .btn-sm{padding:6px 13px;font-size:12px}
  .btn:disabled{opacity:.48;cursor:not-allowed;transform:none!important}
  .badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-family:var(--fm);font-weight:500;padding:3px 10px;border-radius:20px}
  .bg{background:rgba(34,197,94,0.11);color:#15803d;border:1px solid rgba(34,197,94,0.2)}
  .br{background:rgba(244,63,94,0.1);color:var(--danger);border:1px solid rgba(244,63,94,0.2)}
  .by{background:rgba(245,158,11,0.11);color:#b45309;border:1px solid rgba(245,158,11,0.2)}
  .bb{background:rgba(79,110,247,0.1);color:var(--accent);border:1px solid rgba(79,110,247,0.2)}
  .bp{background:rgba(168,85,247,0.1);color:var(--accent3);border:1px solid rgba(168,85,247,0.2)}
  .bt{background:rgba(56,201,176,0.1);color:var(--accent2);border:1px solid rgba(56,201,176,0.2)}
  .fg{display:flex;flex-direction:column;gap:6px;margin-bottom:15px}
  .fl{font-size:11px;font-family:var(--fm);color:var(--muted);letter-spacing:.8px;text-transform:uppercase;font-weight:500}
  .fi{background:rgba(255,255,255,0.72);border:1.5px solid var(--border);border-radius:11px;padding:10px 15px;color:var(--text);font-size:14px;font-family:var(--fb);font-weight:500;transition:all .18s;outline:none;backdrop-filter:blur(8px)}
  .fi:focus{border-color:var(--accent);background:rgba(255,255,255,0.92);box-shadow:0 0 0 4px rgba(79,110,247,0.1)}
  .fs{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%237a8bb8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
  .fe{font-size:12px;color:var(--danger);font-weight:600}
  .ph{margin-bottom:26px}.pt{font-family:var(--fh);font-size:27px;font-weight:900;color:var(--text);letter-spacing:-.5px;line-height:1.1}
  .ps{font-size:13px;color:var(--muted);margin-top:4px;font-weight:500}
  .sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:15px;margin-bottom:22px}
  .sc{background:var(--glass);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border:1px solid var(--glass-border);border-radius:var(--r);padding:20px;position:relative;overflow:hidden;box-shadow:var(--sh);transition:transform .2s}
  .sc:hover{transform:translateY(-3px)}
  .si{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:19px;margin-bottom:12px}
  .sv{font-family:var(--fh);font-size:34px;font-weight:900;line-height:1;color:var(--sc,var(--text))}
  .sl{font-size:11.5px;color:var(--muted);margin-top:3px;font-weight:600;letter-spacing:.2px}
  .sg2{position:absolute;bottom:-20px;right:-20px;width:88px;height:88px;border-radius:50%;background:var(--sg);filter:blur(20px)}
  .tw{overflow-x:auto}
  table{width:100%;border-collapse:collapse;font-size:13.5px}
  thead th{text-align:left;padding:9px 15px;font-family:var(--fm);font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid var(--border);font-weight:500}
  tbody tr{border-bottom:1px solid rgba(160,185,230,0.16);transition:background .14s}
  tbody tr:last-child{border-bottom:none}
  tbody tr:hover{background:rgba(79,110,247,0.04)}
  tbody td{padding:12px 15px;color:var(--text);font-weight:500}
  .pah{display:flex;align-items:center;gap:20px}
  .pal{width:76px;height:76px;border-radius:20px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-size:28px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 8px 24px rgba(79,110,247,0.28)}
  .pan{font-family:var(--fh);font-size:21px;font-weight:900;color:var(--text)}
  .pam{font-size:13px;color:var(--muted);font-weight:500;margin-top:3px}
  .pat{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
  .sw{display:flex;align-items:center;gap:7px}
  .st{width:70px;height:5px;background:rgba(79,110,247,0.1);border-radius:3px;overflow:hidden}
  .sf{height:100%;border-radius:3px;transition:width .6s ease}
  .sn{font-family:var(--fm);font-size:11.5px;font-weight:500}
  .ske{background:linear-gradient(90deg,rgba(79,110,247,0.06) 25%,rgba(79,110,247,0.11) 50%,rgba(79,110,247,0.06) 75%);background-size:400% 100%;animation:shi 1.6s infinite;border-radius:8px}
  @keyframes shi{0%{background-position:100% 0}100%{background-position:-100% 0}}
  .sp{width:18px;height:18px;border:2px solid rgba(79,110,247,0.2);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
  @keyframes spin{to{transform:rotate(360deg)}}
  .lo{position:absolute;inset:0;z-index:10;background:rgba(238,242,247,0.65);backdrop-filter:blur(4px);border-radius:var(--r);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:11px}
  .lt{font-family:var(--fm);font-size:12px;color:var(--accent);font-weight:500}
  .login-pg{min-height:100vh;display:flex;position:relative;overflow:hidden}
  .login-l{flex:1;display:flex;flex-direction:column;justify-content:center;padding:60px 55px;position:relative}
  .login-r{width:470px;flex-shrink:0;background:var(--glass-strong);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);border-left:1px solid var(--glass-border);padding:55px 46px;display:flex;flex-direction:column;justify-content:center;box-shadow:-8px 0 48px var(--shadow-c)}
  .lh{font-family:var(--fh);font-size:50px;font-weight:900;color:var(--text);line-height:1.05;letter-spacing:-2px;margin-bottom:18px}
  .lh span{color:var(--accent)}
  .lt2{font-size:15.5px;color:var(--text2);font-weight:400;line-height:1.65;max-width:380px}
  .lfs{display:flex;flex-direction:column;gap:13px;margin-top:38px}
  .lf{display:flex;align-items:center;gap:13px}
  .lfd{width:7px;height:7px;border-radius:50%;background:var(--accent2);flex-shrink:0}
  .lft{font-size:14px;color:var(--text2);font-weight:500}
  .lft2{font-family:var(--fh);font-size:25px;font-weight:900;color:var(--text);margin-bottom:5px}
  .lfs2{font-size:13px;color:var(--muted);margin-bottom:26px;font-weight:500}
  .ds{width:100%;appearance:none;height:5px;background:rgba(79,110,247,0.14);border-radius:3px;outline:none;cursor:pointer}
  .ds::-webkit-slider-thumb{appearance:none;width:18px;height:18px;background:#fff;border:2px solid var(--accent);border-radius:50%;cursor:pointer;box-shadow:0 2px 8px rgba(79,110,247,0.28)}
  .dr{display:flex;align-items:center;gap:11px}
  .dv{font-family:var(--fm);font-size:13px;color:var(--accent);font-weight:500;min-width:50px}
  .dh{font-size:11px;color:var(--muted);font-family:var(--fm);margin-top:4px}
  .ov{position:fixed;inset:0;z-index:100;background:rgba(26,33,64,0.32);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center}
  .mo{background:rgba(255,255,255,0.94);backdrop-filter:blur(24px);border:1px solid var(--glass-border);border-radius:22px;padding:30px;width:475px;max-width:calc(100vw - 36px);box-shadow:var(--sh-lg)}
  .mt{font-family:var(--fh);font-size:19px;font-weight:900;color:var(--text);margin-bottom:20px}
  .ir{display:grid;grid-template-columns:1fr 1fr;gap:13px}
  .toast{position:fixed;bottom:26px;right:26px;z-index:200;background:rgba(255,255,255,0.94);backdrop-filter:blur(16px);border:1px solid var(--glass-border);border-radius:13px;padding:13px 19px;font-size:13.5px;font-weight:600;display:flex;align-items:center;gap:9px;box-shadow:var(--sh-lg);animation:su .24s ease;color:var(--text)}
  @keyframes su{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
  .fb{display:flex;align-items:center;justify-content:space-between}
  .stit{font-family:var(--fh);font-size:17px;font-weight:700;color:var(--text)}
  .tm{color:var(--muted)}.tmo{font-family:var(--fm)}
  .sft{margin-top:auto;padding:13px 20px 0;border-top:1px solid var(--border);font-size:11px;font-family:var(--fm);color:var(--muted);font-weight:500}
  .fi-a{animation:fain .33s ease both}
  @keyframes fain{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .d1{animation-delay:.04s}.d2{animation-delay:.09s}.d3{animation-delay:.14s}.d4{animation-delay:.19s}
`;

const initials = n => n?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "??";
const sBadge = (s) => {
  const m = { Verified: "bg", Pending: "by", Flagged: "br", Active: "bt", Inactive: "br" };
  const d = { Verified: "✦", Pending: "◌", Flagged: "▲", Active: "✦", Inactive: "✕" };
  return <span className={`badge ${m[s] || "bb"}`}>{d[s] || "●"} {s}</span>;
};
const ScoreBar = ({ score }) => {
  const c = score >= 80 ? "#15803d" : score >= 50 ? "#b45309" : "#f43f5e";
  return <div className="sw"><div className="st"><div className="sf" style={{ width: `${score}%`, background: c }} /></div><span className="sn" style={{ color: c }}>{score}</span></div>;
};
const Skel = ({ w = "100%", h = 14 }) => <div className="ske" style={{ width: w, height: h, marginBottom: 8 }} />;
const ToastEl = ({ msg, type }) => <div className="toast"><span>{type === "success" ? "✅" : "❌"}</span>{msg}</div>;

const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "", role: "General User" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [delay, setDelay] = useState(900);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const doLogin = async () => {
    setError(""); setLoading(true);
    try { const u = await api.login(form.username, form.password, form.role, delay); AppService.set({ session: u, apiDelay: delay }); onLogin(u); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  return (
    <div className="login-pg">
      <div className="mesh-bg" />
      <div className="blob" style={{ width: 420, height: 420, background: "rgba(168,216,255,0.48)", top: "-120px", left: "-80px", animationDuration: "10s" }} />
      <div className="blob" style={{ width: 300, height: 300, background: "rgba(196,180,252,0.38)", bottom: "60px", left: "35%", animationDuration: "14s", animationDirection: "alternate-reverse" }} />
      <div className="login-l">
        <div className="lh">Digital<br />Background<br /><span>Verification.</span></div>
        <p className="lt2">Streamlined, intelligent, and trustworthy background checks for modern organizations.</p>
        <div className="lfs">
          {["Real-time verification status tracking", "Role-based access control (Admin & User)", "Async API with configurable delay simulation", "Admin user CRUD management panel"].map(f => (
            <div key={f} className="lf"><div className="lfd" /><span className="lft">{f}</span></div>
          ))}
        </div>
      </div>
      <div className="login-r">
        <div style={{ marginBottom: 30 }}>
          <div style={{ fontFamily: "var(--fh)", fontSize: 21, fontWeight: 900, color: "var(--accent)", marginBottom: 2 }}>MPloyChek</div>
          <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--fm)", letterSpacing: 1.5, textTransform: "uppercase" }}>NSQTech Private Limited</div>
        </div>
        <div className="lft2">Welcome back</div>
        <div className="lfs2">Sign in to your workspace to continue</div>
        <div className="fg"><label className="fl">User ID</label><input className="fi" value={form.username} onChange={set("username")} placeholder="e.g. admin" onKeyDown={e => e.key === "Enter" && doLogin()} /></div>
        <div className="fg"><label className="fl">Password</label><input className="fi" type="password" value={form.password} onChange={set("password")} placeholder="Enter your password" onKeyDown={e => e.key === "Enter" && doLogin()} /></div>
        <div className="fg"><label className="fl">Role</label><select className="fi fs" value={form.role} onChange={set("role")}><option>General User</option><option>Admin</option></select></div>
        <div className="fg">
          <label className="fl">API Latency</label>
          <div className="dr"><input className="ds" type="range" min={200} max={3000} step={100} value={delay} onChange={e => setDelay(+e.target.value)} /><span className="dv">{delay}ms</span></div>
          <div className="dh">{delay < 600 ? "⚡ Fast" : delay < 1500 ? "🌐 Moderate" : "🐢 Slow — watch loaders!"}</div>
        </div>
        {error && <div className="fe" style={{ marginBottom: 13 }}>⚠ {error}</div>}
        <button className="btn btn-p" style={{ width: "100%", justifyContent: "center", padding: "13px 20px", fontSize: 14, borderRadius: 14, marginTop: 4 }} onClick={doLogin} disabled={loading}>
          {loading ? <><span className="sp" style={{ borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} /> Authenticating…</> : "Sign In →"}
        </button>
        <div style={{ marginTop: 22, padding: "13px 15px", background: "rgba(79,110,247,0.06)", border: "1px solid rgba(79,110,247,0.12)", borderRadius: 11, fontSize: 12, fontFamily: "var(--fm)", color: "var(--muted)", lineHeight: 1.8 }}>
          <div style={{ color: "var(--accent)", fontWeight: 600, marginBottom: 3 }}>↳ Demo Credentials</div>
          <div>admin / admin123 → Admin</div><div>alice / alice123 → General User</div><div>bob / bob123 → General User</div>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = ({ user, delay }) => {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); api.getRecords(user.id, user.role, delay).then(r => { setRecords(r); setLoading(false); }); }, [user, delay]);
  const stats = records ? { total: records.length, verified: records.filter(r => r.status === "Verified").length, pending: records.filter(r => r.status === "Pending").length, flagged: records.filter(r => r.status === "Flagged").length } : null;
  const sCards = [
    { label: "Total Records", key: "total", icon: "📋", color: "var(--accent)", glow: "rgba(79,110,247,0.22)" },
    { label: "Verified", key: "verified", icon: "✅", color: "#15803d", glow: "rgba(21,128,61,0.18)" },
    { label: "Pending", key: "pending", icon: "⏳", color: "#b45309", glow: "rgba(180,83,9,0.18)" },
    { label: "Flagged", key: "flagged", icon: "⚑", color: "var(--danger)", glow: "rgba(244,63,94,0.18)" },
  ];
  return (
    <>
      <div className="ph fi-a"><div className="pt">Dashboard</div><div className="ps">{user.role === "Admin" ? "Full system overview · Admin access" : "Your personal verification records"}</div></div>
      <div className="card fi-a d1" style={{ marginBottom: 20 }}>
        <div className="pah">
          <div className="pal">{initials(user.name)}</div>
          <div>
            <div className="pan">{user.name}</div>
            <div className="pam">{user.email} · {user.dept} Department</div>
            <div className="pat">
              <span className={`badge ${user.role === "Admin" ? "bt" : "bb"}`}>{user.role}</span>
              {sBadge(user.status)}
              <span className="badge bp tmo">{user.id}</span>
              <span className="tmo tm" style={{ fontSize: 11, alignSelf: "center" }}>Joined {user.joined}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="sg">
        {sCards.map((s, i) => (
          <div key={s.key} className={`sc fi-a d${i + 1}`} style={{ "--sc": s.color, "--sg": s.glow }}>
            <div className="si" style={{ background: s.glow }}>{s.icon}</div>
            <div className="sv">{loading ? <Skel w={50} h={34} /> : (stats?.[s.key] ?? "—")}</div>
            <div className="sl">{s.label}</div>
            <div className="sg2" />
          </div>
        ))}
      </div>
      <div className="card fi-a" style={{ position: "relative" }}>
        {loading && <div className="lo"><div className="sp" style={{ width: 34, height: 34, borderWidth: 3 }} /><div className="lt">Loading records…</div></div>}
        <div className="fb" style={{ marginBottom: 16 }}>
          <div className="stit">Verification Records</div>
          <span className="tmo tm" style={{ fontSize: 12 }}>{records?.length ?? "…"} entries</span>
        </div>
        {loading ? <>{Array(4).fill(0).map((_, i) => <Skel key={i} h={42} />)}</> : (
          <div className="tw">
            <table>
              <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Status</th><th>Score</th><th>Date</th>{user.role === "Admin" && <th>Owner</th>}</tr></thead>
              <tbody>
                {records.map(r => {
                  const owner = getDB().users.find(u => u.id === r.owner);
                  return (
                    <tr key={r.id}>
                      <td><span className="tmo tm" style={{ fontSize: 11 }}>{r.id}</span></td>
                      <td style={{ fontWeight: 600 }}>{r.title}</td>
                      <td><span className="badge bb">{r.type}</span></td>
                      <td>{sBadge(r.status)}</td>
                      <td><ScoreBar score={r.score} /></td>
                      <td className="tmo tm" style={{ fontSize: 11 }}>{r.date}</td>
                      {user.role === "Admin" && <td className="tm">{owner?.name ?? r.owner}</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

const UserManagementPage = ({ delay }) => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", name: "", email: "", dept: "Engineering", role: "General User", status: "Active" });
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const loadUsers = useCallback(() => { setLoading(true); api.getUsers(delay).then(u => { setUsers(u); setLoading(false); }); }, [delay]);
  useEffect(() => { loadUsers(); }, [loadUsers]);
  const openAdd = () => { setForm({ username: "", password: "", name: "", email: "", dept: "Engineering", role: "General User", status: "Active" }); setModal({ mode: "add" }); };
  const openEdit = u => { setForm({ username: u.username, password: "", name: u.name, email: u.email, dept: u.dept, role: u.role, status: u.status }); setModal({ mode: "edit", data: u }); };
  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal.mode === "add") { await api.addUser(form, delay); showToast("User created successfully."); }
      else { const p = { name: form.name, email: form.email, dept: form.dept, role: form.role, status: form.status }; if (form.password) p.password = form.password; await api.updateUser(modal.data.id, p, delay); showToast("User updated."); }
      setModal(null); loadUsers();
    } catch (e) { showToast(e.message, "error"); } finally { setSaving(false); }
  };
  const handleDelete = async id => {
    if (!window.confirm("Delete this user?")) return;
    try { await api.deleteUser(id, delay); showToast("User removed."); loadUsers(); } catch (e) { showToast(e.message, "error"); }
  };
  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const depts = ["Engineering", "HR", "Finance", "Operations", "Marketing", "Legal"];
  return (
    <>
      {toast && <ToastEl {...toast} />}
      <div className="ph fi-a">
        <div className="fb"><div><div className="pt">User Management</div><div className="ps">Admin · Add, edit, or remove system users</div></div>
          <button className="btn btn-p" onClick={openAdd}>+ Add User</button></div>
      </div>
      <div className="card fi-a" style={{ position: "relative" }}>
        {loading && <div className="lo"><div className="sp" style={{ width: 34, height: 34, borderWidth: 3 }} /><div className="lt">Fetching users…</div></div>}
        <div className="fb" style={{ marginBottom: 16 }}>
          <div className="stit">All Users</div>
          <span className="tmo tm" style={{ fontSize: 12 }}>{users?.length ?? "—"} users</span>
        </div>
        <div className="tw">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th><th>Dept</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {(users ?? []).map(u => (
                <tr key={u.id}>
                  <td className="tmo tm" style={{ fontSize: 11 }}>{u.id}</td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="av" style={{ width: 27, height: 27, fontSize: 10, borderRadius: 7 }}>{initials(u.name)}</div><span style={{ fontWeight: 600 }}>{u.name}</span></div></td>
                  <td className="tmo tm" style={{ fontSize: 12 }}>{u.username}</td>
                  <td className="tm">{u.email}</td><td>{u.dept}</td>
                  <td><span className={`badge ${u.role === "Admin" ? "bt" : "bb"}`}>{u.role}</span></td>
                  <td>{sBadge(u.status)}</td>
                  <td className="tmo tm" style={{ fontSize: 11 }}>{u.joined}</td>
                  <td><div style={{ display: "flex", gap: 5 }}><button className="btn btn-g btn-sm" onClick={() => openEdit(u)}>Edit</button><button className="btn btn-d btn-sm" onClick={() => handleDelete(u.id)}>Del</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="ov" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="mo">
            <div className="mt">{modal.mode === "add" ? "Create New User" : `Edit · ${modal.data.name}`}</div>
            <div className="ir">
              <div className="fg"><label className="fl">Full Name</label><input className="fi" value={form.name} onChange={setF("name")} /></div>
              <div className="fg"><label className="fl">Username</label><input className="fi" value={form.username} onChange={setF("username")} disabled={modal.mode === "edit"} /></div>
            </div>
            <div className="ir">
              <div className="fg"><label className="fl">Email</label><input className="fi" value={form.email} onChange={setF("email")} /></div>
              <div className="fg"><label className="fl">Password</label><input className="fi" type="password" value={form.password} onChange={setF("password")} /></div>
            </div>
            <div className="ir">
              <div className="fg"><label className="fl">Department</label><select className="fi fs" value={form.dept} onChange={setF("dept")}>{depts.map(d => <option key={d}>{d}</option>)}</select></div>
              <div className="fg"><label className="fl">Role</label><select className="fi fs" value={form.role} onChange={setF("role")}><option>General User</option><option>Admin</option></select></div>
            </div>
            <div className="fg"><label className="fl">Status</label><select className="fi fs" value={form.status} onChange={setF("status")}><option>Active</option><option>Inactive</option></select></div>
            <div style={{ display: "flex", gap: 9, justifyContent: "flex-end", marginTop: 6 }}>
              <button className="btn btn-g" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-p" onClick={handleSave} disabled={saving}>
                {saving ? <><span className="sp" style={{ borderTopColor: "#fff", borderColor: "rgba(255,255,255,0.3)" }} />{modal.mode === "add" ? "Creating…" : "Saving…"}</> : modal.mode === "add" ? "Create User" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SettingsPage = ({ delay, onDelayChange }) => (
  <>
    <div className="ph fi-a"><div className="pt">Settings</div><div className="ps">Configure API behaviour and application parameters</div></div>
    <div className="card fi-a" style={{ maxWidth: 530 }}>
      <div className="stit" style={{ marginBottom: 8 }}>Async API Delay</div>
      <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 20, lineHeight: 1.7, fontWeight: 500 }}>Simulate network latency on all API calls. Adjust to observe skeleton loaders, spinners, and async state transitions.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <div className="dr"><input className="ds" type="range" min={200} max={4000} step={100} value={delay} onChange={e => onDelayChange(+e.target.value)} /><span className="dv">{delay}ms</span></div>
        <div className="dh">{delay < 600 ? "⚡ Fast – instant feel" : delay < 1500 ? "🌐 Moderate – realistic latency" : "🐢 Slow – full loading states visible"}</div>
      </div>
    </div>
  </>
);

const AppShell = ({ user, onLogout }) => {
  const [page, setPage] = useState("dashboard");
  const [appState, setAppState] = useAppService();
  const delay = appState.apiDelay;
  const nav = [
    { id: "dashboard", icon: "⬛", label: "Dashboard" },
    ...(user.role === "Admin" ? [{ id: "users", icon: "👥", label: "User Management" }] : []),
    { id: "settings", icon: "⚙", label: "Settings" },
  ];
  return (
    <div className="app">
      <div className="mesh-bg" />
      <div className="blob" style={{ width: 500, height: 500, background: "rgba(168,216,255,0.32)", top: "-150px", right: "80px", animationDuration: "11s" }} />
      <div className="blob" style={{ width: 350, height: 350, background: "rgba(196,180,252,0.28)", bottom: "0", right: "0", animationDuration: "15s", animationDirection: "alternate-reverse" }} />
      <div className="blob" style={{ width: 260, height: 260, background: "rgba(167,243,208,0.28)", bottom: "120px", left: "220px", animationDuration: "9s" }} />
      <div className="topbar">
        <div className="tb-brand">MPloyChek · NSQTech</div>
        <div className="tb-right">
          <div className="upill"><div className="av">{initials(user.name)}</div><span>{user.name}</span><span className={`rtag ${user.role === "Admin" ? "adm" : ""}`}>{user.role}</span></div>
          <button className="btn btn-g btn-sm" onClick={onLogout}>Sign out</button>
        </div>
      </div>
      <div className="shell">
        <div className="sidebar">
          <div className="logo">MPloy<em>Chek</em><span className="logo-sub">Digital Verification</span></div>
          {nav.map(n => (
            <div key={n.id} className="np">
              <div className={`ni ${page === n.id ? "act" : ""}`} onClick={() => setPage(n.id)}>
                <div className="nic">{n.icon}</div>{n.label}
              </div>
            </div>
          ))}
          <div className="sft">API delay · <span style={{ color: "var(--accent)" }}>{delay}ms</span></div>
        </div>
        <div className="main">
          {page === "dashboard" && <DashboardPage user={user} delay={delay} />}
          {page === "users" && user.role === "Admin" && <UserManagementPage delay={delay} />}
          {page === "settings" && <SettingsPage delay={delay} onDelayChange={d => setAppState({ apiDelay: d })} />}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  seedDB();
  const [session, setSession] = useState(null);
  return (
    <>
      <style>{css}</style>
      {!session ? <LoginPage onLogin={setSession} /> : <AppShell user={session} onLogout={() => setSession(null)} />}
    </>
  );
}
