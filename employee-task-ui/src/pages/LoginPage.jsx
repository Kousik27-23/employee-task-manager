import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authApi.login(form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        backgroundImage:
          "radial-gradient(ellipse at 30% 20%, rgba(79,142,247,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(124,92,252,0.06) 0%, transparent 60%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400, padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              color: "var(--accent)",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            EM_TASK
          </div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>
            Employee & Task Management
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
            Sign In
          </div>

          {error && (
            <div
              style={{
                color: "var(--danger)",
                background: "#2a1515",
                border: "1px solid #5c2020",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handle}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                type="email"
                required
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="form-control"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                justifyContent: "center",
                padding: "12px",
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          <p>
            Don't have an account?
            <a href="/register"> Register </a>
          </p>
        </div>
      </div>
    </div>
  );
}
