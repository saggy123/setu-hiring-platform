import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Building2,
  MessageCircle,
  Send,
  ArrowUpRight,
  Users,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Wallet,
  Plus,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const C = {
  ink: "#14232B",
  inkDeep: "#0E1A20",
  board: "#0F1B21",
  paper: "#F2EBDA",
  paperDeep: "#E8DFC8",
  amber: "#F0A83C",
  amberDim: "#8A6428",
  green: "#5C9C76",
  greenDim: "#3E6A50",
  coral: "#C1614B",
  slate: "#3E4A47",
  slateSoft: "#6C776F",
  hair: "rgba(20,35,43,0.12)",
};

const STAGES = ["Applied", "Screening", "Interview", "Offer"];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const JOBS = [
  { id: 1, title: "Frontend Engineer", company: "Orbit Retail", location: "Bengaluru", mode: "Hybrid", salary: "₹18–24L", match: 92, tags: ["React", "TypeScript", "3+ yrs"], posted: "2d ago" },
  { id: 2, title: "Product Designer", company: "Finch Health", location: "Pune", mode: "Remote", salary: "₹14–20L", match: 81, tags: ["Figma", "Design systems"], posted: "5d ago" },
  { id: 3, title: "Data Analyst", company: "Ledger Works", location: "Mumbai", mode: "On-site", salary: "₹10–14L", match: 74, tags: ["SQL", "Python"], posted: "1w ago" },
  { id: 4, title: "DevOps Engineer", company: "Northbeam Cloud", location: "Hyderabad", mode: "Hybrid", salary: "₹20–28L", match: 88, tags: ["AWS", "Kubernetes"], posted: "3d ago" },
  { id: 5, title: "HR Business Partner", company: "Orbit Retail", location: "Bengaluru", mode: "On-site", salary: "₹12–16L", match: 65, tags: ["Employee relations"], posted: "1d ago" },
];

const INITIAL_APPLICATIONS = [
  { jobId: 1, stage: 2 },
  { jobId: 4, stage: 1 },
  { jobId: 2, stage: 3 },
];

const INITIAL_CANDIDATES = [
  { id: 1, name: "Aditi Rao", role: "Frontend Engineer", match: 94, stage: 3, initials: "AR" },
  { id: 2, name: "Karan Mehta", role: "Frontend Engineer", match: 88, stage: 2, initials: "KM" },
  { id: 3, name: "Sana Iqbal", role: "Frontend Engineer", match: 85, stage: 2, initials: "SI" },
  { id: 4, name: "Rohit Nair", role: "Frontend Engineer", match: 79, stage: 1, initials: "RN" },
  { id: 5, name: "Priya Shah", role: "DevOps Engineer", match: 76, stage: 1, initials: "PS" },
  { id: 6, name: "Vikram Joshi", role: "Frontend Engineer", match: 70, stage: 0, initials: "VJ" },
  { id: 7, name: "Meera Pillai", role: "Product Designer", match: 91, stage: 0, initials: "MP" },
];

const INITIAL_THREADS = [
  { id: 1, name: "Neha · Orbit Retail", subtitle: "Frontend Engineer", messages: [
    { from: "them", text: "Hi! Loved your portfolio. Open to a quick call this week?" },
    { from: "me", text: "Hi Neha, thanks — Thursday afternoon works well for me." },
    { from: "them", text: "Perfect, sending a calendar invite for 3 PM Thursday." },
  ]},
  { id: 2, name: "Arjun · Finch Health", subtitle: "Product Designer", messages: [
    { from: "them", text: "Your application just moved to the Interview stage." },
    { from: "me", text: "Great news — thank you! Looking forward to it." },
  ]},
  { id: 3, name: "Divya · Northbeam Cloud", subtitle: "DevOps Engineer", messages: [
    { from: "them", text: "We're reviewing your profile against the role now." },
  ]},
];

// ---------------------------------------------------------------------------
// Split-flap board — the shared signature element
// ---------------------------------------------------------------------------
function FlapWord({ text, size = "base" }) {
  const chars = text.toUpperCase().split("");
  const dims = size === "lg" ? { w: 34, h: 44, fs: 22 } : { w: 22, h: 30, fs: 15 };
  return (
    <div style={{ display: "flex", gap: 4 }} key={text}>
      {chars.map((ch, i) => (
        <div
          key={`${text}-${i}`}
          className="flap-cell"
          style={{
            width: dims.w,
            height: dims.h,
            background: C.board,
            color: C.amber,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: dims.fs,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            border: `1px solid ${C.amberDim}`,
            boxShadow: "inset 0 -8px 10px -8px rgba(0,0,0,0.6)",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </div>
      ))}
    </div>
  );
}

function StageTrack({ stage }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {STAGES.map((s, i) => {
        const done = i < stage;
        const active = i === stage;
        return (
          <React.Fragment key={s}>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                background: active ? C.amber : done ? C.greenDim : "transparent",
                color: active ? C.inkDeep : done ? "#EFE7D2" : C.slateSoft,
                border: `1px solid ${active ? C.amber : done ? C.greenDim : C.hair}`,
              }}
            >
              {s}
            </div>
            {i < STAGES.length - 1 && (
              <div style={{ width: 14, height: 1, background: i < stage ? C.green : C.hair }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------
function MatchBadge({ score }) {
  const color = score >= 85 ? C.green : score >= 70 ? C.amberDim : C.coral;
  return (
    <div
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
      style={{ background: `${color}1A`, color }}
    >
      <Sparkles size={12} />
      {score}% match
    </div>
  );
}

function Card({ children, style, className = "" }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: "#FFFDF7", border: `1px solid ${C.hair}`, ...style }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Applicant side
// ---------------------------------------------------------------------------
function ApplicantView({ threads, setThreads }) {
  const [tab, setTab] = useState("discover");
  const [selectedJobId, setSelectedJobId] = useState(JOBS[0].id);
  const selectedJob = JOBS.find((j) => j.id === selectedJobId);
  const [applications] = useState(INITIAL_APPLICATIONS);

  return (
    <div>
      <SubNav
        items={[
          { key: "discover", label: "Discover roles" },
          { key: "applications", label: "My applications" },
          { key: "messages", label: "Messages" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "discover" && (
        <div className="grid md:grid-cols-5 gap-5 mt-5">
          <div className="md:col-span-2 space-y-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "#FFFDF7", border: `1px solid ${C.hair}` }}
            >
              <Search size={16} color={C.slateSoft} />
              <input
                placeholder="Search roles, skills, companies"
                className="bg-transparent outline-none text-sm w-full"
                style={{ color: C.slate }}
              />
            </div>
            {JOBS.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                className="w-full text-left p-4 rounded-2xl transition"
                style={{
                  background: j.id === selectedJobId ? "#FFFDF7" : "transparent",
                  border: `1px solid ${j.id === selectedJobId ? C.amber : C.hair}`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: C.slate }}>
                      {j.title}
                    </div>
                    <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: C.slateSoft }}>
                      <Building2 size={12} /> {j.company}
                    </div>
                  </div>
                  <MatchBadge score={j.match} />
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs" style={{ color: C.slateSoft }}>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {j.location} · {j.mode}</span>
                  <span className="flex items-center gap-1"><Wallet size={11} /> {j.salary}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            <Card style={{ padding: 24 }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: C.slate, fontWeight: 700 }}>
                    {selectedJob.title}
                  </h3>
                  <div className="text-sm mt-1" style={{ color: C.slateSoft }}>
                    {selectedJob.company} · {selectedJob.location} · {selectedJob.mode}
                  </div>
                </div>
                <MatchBadge score={selectedJob.match} />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {selectedJob.tags.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full" style={{ background: C.paperDeep, color: C.slate }}>
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-sm mt-4 leading-relaxed" style={{ color: C.slate }}>
                We're looking for someone who can move fluidly between product thinking and hands-on
                execution. You'll partner directly with design and product to ship features end to end,
                with real ownership from week one.
              </p>

              <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${C.hair}` }}>
                <div className="text-xs uppercase tracking-wide mb-2" style={{ color: C.slateSoft, fontFamily: "'IBM Plex Mono', monospace" }}>
                  Why Setu matched you
                </div>
                <ul className="text-sm space-y-1" style={{ color: C.slate }}>
                  <li>· Your top listed skills overlap with 4 of 5 must-haves</li>
                  <li>· Salary expectation falls inside this role's band</li>
                  <li>· Two of your saved companies have hired from this JD before</li>
                </ul>
              </div>

              <button
                className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: C.ink, color: C.paper }}
              >
                Apply now <ArrowUpRight size={15} />
              </button>
            </Card>
          </div>
        </div>
      )}

      {tab === "applications" && (
        <div className="space-y-4 mt-5">
          {applications.map((a) => {
            const job = JOBS.find((j) => j.id === a.jobId);
            return (
              <Card key={a.jobId} style={{ padding: 20 }}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: C.slate }}>
                      {job.title}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: C.slateSoft }}>{job.company}</div>
                  </div>
                  <FlapWord text={STAGES[a.stage]} />
                </div>
                <div className="mt-4">
                  <StageTrack stage={a.stage} />
                </div>
              </Card>
            );
          })}
          <p className="text-xs text-center pt-2" style={{ color: C.slateSoft }}>
            Every stage change here notifies you the moment a recruiter moves your card — no more checking a black hole.
          </p>
        </div>
      )}

      {tab === "messages" && <MessagesPanel threads={threads} setThreads={setThreads} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recruiter side
// ---------------------------------------------------------------------------
function RecruiterView({ threads, setThreads }) {
  const [tab, setTab] = useState("pipeline");
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [showPost, setShowPost] = useState(false);

  const counts = STAGES.map((_, i) => candidates.filter((c) => c.stage === i).length);

  function advance(id) {
    setCandidates((cs) => cs.map((c) => (c.id === id && c.stage < STAGES.length - 1 ? { ...c, stage: c.stage + 1 } : c)));
  }

  return (
    <div>
      <SubNav
        items={[
          { key: "pipeline", label: "Pipeline" },
          { key: "post", label: "Post a role" },
          { key: "messages", label: "Messages" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "pipeline" && (
        <div className="mt-5">
          <div
            className="rounded-2xl p-5 mb-5 flex flex-wrap items-center gap-6"
            style={{ background: C.board }}
          >
            {STAGES.map((s, i) => (
              <div key={s} className="flex flex-col gap-2">
                <span className="text-xs" style={{ color: "#B9C6C2", fontFamily: "'IBM Plex Mono', monospace" }}>{s}</span>
                <FlapWord text={String(counts[i]).padStart(2, "0")} size="lg" />
              </div>
            ))}
            <div className="ml-auto flex items-center gap-2 text-xs" style={{ color: "#B9C6C2" }}>
              <Users size={14} /> {candidates.length} candidates across 1 open role
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {STAGES.map((stage, si) => (
              <div key={stage}>
                <div className="text-xs uppercase tracking-wide mb-2 flex items-center justify-between" style={{ color: C.slateSoft, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {stage} <span>{counts[si]}</span>
                </div>
                <div className="space-y-2">
                  {candidates.filter((c) => c.stage === si).map((c) => (
                    <Card key={c.id} style={{ padding: 14 }}>
                      <div className="flex items-center gap-2">
                        <div
                          className="rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ width: 32, height: 32, background: C.paperDeep, color: C.slate }}
                        >
                          {c.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate" style={{ color: C.slate }}>{c.name}</div>
                          <div className="text-xs truncate" style={{ color: C.slateSoft }}>{c.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <MatchBadge score={c.match} />
                        {si < STAGES.length - 1 && (
                          <button
                            onClick={() => advance(c.id)}
                            className="text-xs flex items-center gap-0.5 font-medium"
                            style={{ color: C.amberDim }}
                          >
                            Move <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "post" && (
        <Card style={{ padding: 24 }} className="mt-5">
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: C.slate }}>
            Post a new role
          </div>
          <p className="text-sm mt-1" style={{ color: C.slateSoft }}>
            Setu scores every applicant against this JD automatically, so you only see people worth a look.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            {["Job title", "Location", "Experience required", "Salary band"].map((label) => (
              <div key={label}>
                <label className="text-xs" style={{ color: C.slateSoft }}>{label}</label>
                <input className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: C.paperDeep, color: C.slate }} />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="text-xs" style={{ color: C.slateSoft }}>Must-have skills</label>
            <textarea rows={3} className="w-full mt-1 px-3 py-2 rounded-lg text-sm outline-none" style={{ background: C.paperDeep, color: C.slate }} />
          </div>
          <button className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: C.ink, color: C.paper }}>
            <Plus size={15} /> Publish role
          </button>
        </Card>
      )}

      {tab === "messages" && <MessagesPanel threads={threads} setThreads={setThreads} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared messaging panel
// ---------------------------------------------------------------------------
function MessagesPanel({ threads, setThreads }) {
  const [activeId, setActiveId] = useState(threads[0].id);
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeId);

  function send() {
    if (!draft.trim()) return;
    setThreads((ts) =>
      ts.map((t) => (t.id === activeId ? { ...t, messages: [...t.messages, { from: "me", text: draft.trim() }] } : t))
    );
    setDraft("");
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-5" style={{ height: 460 }}>
      <div className="space-y-2 overflow-y-auto pr-1">
        {threads.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className="w-full text-left p-3 rounded-xl"
            style={{ background: t.id === activeId ? "#FFFDF7" : "transparent", border: `1px solid ${t.id === activeId ? C.amber : C.hair}` }}
          >
            <div className="text-sm font-semibold" style={{ color: C.slate }}>{t.name}</div>
            <div className="text-xs" style={{ color: C.slateSoft }}>{t.subtitle}</div>
          </button>
        ))}
      </div>
      <Card style={{ padding: 0 }} className="md:col-span-2 flex flex-col">
        <div className="px-4 py-3 text-sm font-semibold" style={{ borderBottom: `1px solid ${C.hair}`, color: C.slate }}>
          {active.name}
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {active.messages.map((m, i) => (
            <div key={i} className="flex" style={{ justifyContent: m.from === "me" ? "flex-end" : "flex-start" }}>
              <div
                className="px-3 py-2 rounded-2xl text-sm max-w-[80%]"
                style={{
                  background: m.from === "me" ? C.ink : C.paperDeep,
                  color: m.from === "me" ? C.paper : C.slate,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 flex items-center gap-2" style={{ borderTop: `1px solid ${C.hair}` }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Write a message"
            className="flex-1 px-3 py-2 rounded-full text-sm outline-none"
            style={{ background: C.paperDeep, color: C.slate }}
          />
          <button onClick={send} className="p-2.5 rounded-full" style={{ background: C.ink, color: C.paper }}>
            <Send size={15} />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nav bits
// ---------------------------------------------------------------------------
function SubNav({ items, active, onChange }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className="px-4 py-2 rounded-full text-sm font-medium transition"
          style={{
            background: active === it.key ? C.ink : "transparent",
            color: active === it.key ? C.paper : C.slate,
            border: `1px solid ${active === it.key ? C.ink : C.hair}`,
          }}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export default function SetuHiringPlatform() {
  const [role, setRole] = useState("applicant");
  const [threads, setThreads] = useState(INITIAL_THREADS);

  const heroWord = role === "applicant" ? "INTERVIEW" : "HIRING";

  return (
    <div style={{ background: C.paper, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        @keyframes flapIn { from { transform: rotateX(90deg); opacity: 0; } to { transform: rotateX(0deg); opacity: 1; } }
        .flap-cell { animation: flapIn 0.35s ease-out; transform-origin: top; }
        * { box-sizing: border-box; }
        input:focus, textarea:focus { outline: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: C.ink }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold"
              style={{ background: C.amber, color: C.inkDeep, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              से
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: C.paper, fontSize: 18, lineHeight: 1 }}>
                Setu
              </div>
              <div className="text-xs" style={{ color: "#9FB0AA" }}>the bridge between hiring and being hired</div>
            </div>
          </div>

          {/* Platform switcher — styled like two station platforms */}
          <div className="flex rounded-full p-1" style={{ background: C.board }}>
            {[
              { key: "applicant", label: "Applicant platform" },
              { key: "recruiter", label: "Recruiter platform" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setRole(p.key)}
                className="px-4 py-2 rounded-full text-sm font-medium transition"
                style={{
                  background: role === p.key ? C.amber : "transparent",
                  color: role === p.key ? C.inkDeep : "#B9C6C2",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero flap board */}
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <div className="flex items-end gap-6 flex-wrap">
            <div>
              <div className="text-xs mb-2" style={{ color: "#9FB0AA", fontFamily: "'IBM Plex Mono', monospace" }}>
                {role === "applicant" ? "your next stage" : "today's focus"}
              </div>
              <FlapWord text={heroWord} size="lg" />
            </div>
            <p className="text-sm max-w-md pb-1" style={{ color: "#C7D2CD" }}>
              {role === "applicant"
                ? "One board, always current. Every move a recruiter makes on your application shows up here the moment it happens."
                : "The same board your candidates see. Move someone forward and they know instantly — no chasing status updates over email."}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {role === "applicant" ? (
          <ApplicantView threads={threads} setThreads={setThreads} />
        ) : (
          <RecruiterView threads={threads} setThreads={setThreads} />
        )}
      </div>
    </div>
  );
}
