import { useState } from "react";

const AGENTS = [
  { id: "analytics", label: "Analytics", icon: "📊", query: "show me revenue trends", color: "#6C63FF", light: "#f0eeff" },
  { id: "crm", label: "CRM", icon: "🤝", query: "show me sales pipeline status", color: "#00B894", light: "#e6faf6" },
  { id: "meeting", label: "Meeting", icon: "📅", query: "schedule a team meeting", color: "#FDCB6E", light: "#fffbf0" },
  { id: "project", label: "Project", icon: "🗂️", query: "what projects are at risk", color: "#E17055", light: "#fff3f0" },
  { id: "comms", label: "Comms", icon: "✉️", query: "draft an email to the team", color: "#0984E3", light: "#eef7ff" },
  { id: "executive", label: "Executive", icon: "🏢", query: "give me a company overview", color: "#2D3436", light: "#f5f5f5" },
];

function renderValue(val, depth = 0) {
  if (val === null || val === undefined) return <span style={{ color: "#aaa" }}>—</span>;
  if (typeof val === "string") return <span>{val}</span>;
  if (typeof val === "number" || typeof val === "boolean") return <span>{String(val)}</span>;
  if (Array.isArray(val)) {
    if (val.length === 0) return <span style={{ color: "#aaa" }}>none</span>;
    return (
      <ul style={{ margin: "4px 0 0 0", paddingLeft: 16 }}>
        {val.map((item, i) => (
          <li key={i} style={{ marginBottom: 2, fontSize: 13 }}>{renderValue(item, depth + 1)}</li>
        ))}
      </ul>
    );
  }
  if (typeof val === "object") {
    return (
      <div style={{ marginTop: depth > 0 ? 4 : 0 }}>
        {Object.entries(val).map(([k, v]) => (
          <div key={k} style={{ marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.04em" }}>{k.replace(/_/g, " ")}</span>
            <div style={{ marginTop: 2, fontSize: 13, color: "#222" }}>{renderValue(v, depth + 1)}</div>
          </div>
        ))}
      </div>
    );
  }
  return <span>{JSON.stringify(val)}</span>;
}

function AgentCard({ agent, webhookUrl }) {
  const [query, setQuery] = useState(agent.query);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(null);

  async function handleRun() {
    setLoading(true);
    setError(null);
    setResult(null);
    const start = Date.now();
    try {
      if (!webhookUrl.trim()) {
        setError("Enter your n8n webhook URL in the dashboard first.");
        setLoading(false);
        return;
      }

      const res = await fetch(webhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          agentLabel: agent.label,
          query,
          context: "",
        }),
      });
      const data = await res.json();
      setElapsed(((Date.now() - start) / 1000).toFixed(1));
      const display = data.result || data.executive_report || data;
      setResult(display);
    } catch (e) {
      setError("Failed to reach webhook. Check n8n is active.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", overflow: "hidden", display: "flex", flexDirection: "column", border: `1.5px solid ${result ? agent.color + "44" : "#f0f0f0"}`, transition: "border 0.3s" }}>
      <div style={{ background: agent.light, padding: "16px 20px 12px", borderBottom: `2px solid ${agent.color}22`, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>{agent.icon}</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: agent.color }}>{agent.label} Agent</div>
          {elapsed && result && <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>↩ {elapsed}s</div>}
        </div>
        {result && <div style={{ marginLeft: "auto", background: agent.color, color: "#fff", borderRadius: 20, fontSize: 11, fontWeight: 700, padding: "3px 10px" }}>DONE</div>}
      </div>

      <div style={{ padding: "14px 20px 10px" }}>
        <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={2} style={{ width: "100%", border: "1.5px solid #e8e8e8", borderRadius: 8, padding: "8px 10px", fontSize: 13, resize: "vertical", fontFamily: "inherit", color: "#333", boxSizing: "border-box", outline: "none" }} placeholder="Enter your query..." />
        <button onClick={handleRun} disabled={loading} style={{ marginTop: 8, width: "100%", background: loading ? "#ccc" : agent.color, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.03em", transition: "background 0.2s" }}>
          {loading ? "Running..." : `Run ${agent.label} Agent`}
        </button>
      </div>

      <div style={{ flex: 1, padding: "0 20px 16px", minHeight: 60 }}>
        {error && <div style={{ background: "#fff0f0", border: "1px solid #ffcccc", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#c00" }}>{error}</div>}
        {result && !error && <div style={{ background: agent.light, borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#222", maxHeight: 280, overflowY: "auto" }}>{renderValue(result)}</div>}
        {!result && !error && !loading && <div style={{ fontSize: 12, color: "#ccc", textAlign: "center", paddingTop: 8 }}>Hit Run to query this agent</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [cardKeys, setCardKeys] = useState(AGENTS.map((_, i) => i));
  const [webhookUrl, setWebhookUrl] = useState(import.meta.env.VITE_N8N_WEBHOOK_URL || "");

  function resetAll() {
    setCardKeys(AGENTS.map((_, i) => i + Math.random()));
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#1a1a2e", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6C63FF, #00B894)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em" }}>AgentFlow OS</div>
            <div style={{ color: "#6C63FF", fontSize: 11, fontWeight: 500 }}>AI Agent Command Center</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00B894", boxShadow: "0 0 6px #00B894" }} />
          <span style={{ color: "#aaa", fontSize: 12 }}>n8n Live</span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>Command Center</h1>
            <p style={{ margin: "6px 0 0", color: "#888", fontSize: 14 }}>6 AI agents • Powered by Gemini 2.5 Flash • Routed via n8n</p>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Webhook URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder=""
                style={{ width: 360, maxWidth: "100%", border: "1.5px solid #ddd", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#222", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <button onClick={resetAll} style={{ background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "#555", cursor: "pointer" }}>🔄 Reset All</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {AGENTS.map((agent, i) => <AgentCard key={cardKeys[i]} agent={agent} webhookUrl={webhookUrl} />)}
        </div>

        <div style={{ marginTop: 32, textAlign: "center", color: "#ccc", fontSize: 12 }}>AgentFlow OS · n8n + Gemini 2.5 Flash</div>
      </div>
    </div>
  );
}
