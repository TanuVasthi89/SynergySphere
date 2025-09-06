import { useState } from "react";
import { LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) return setError("Email is required");
    if (!password) return setError("Password is required");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || `Login failed (${res.status})`);

      if (body.token) localStorage.setItem("token", body.token);
      if (body.user) localStorage.setItem("user", JSON.stringify(body.user));

      setSuccess("Signed in successfully.");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: Login panel (dark, pop of color) */}
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center text-slate-900 font-bold">SH</div>
              <div>
                <h3 className="text-lg font-extrabold">SynergyHub</h3>
                <p className="text-xs text-slate-300">Work together. Ship faster.</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-sm text-slate-300 mt-1">Sign in to continue to your workspace</p>
          </div>

          <Card className="bg-transparent border-0 shadow-none p-0">
            {error && <div className="mb-3 text-sm text-destructive bg-white/10 border border-white/10 p-3 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-200">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 bg-white/5 text-white placeholder:text-slate-300" />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-200">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 bg-white/5 text-white placeholder:text-slate-300" />
              </div>

              <div className="flex items-center justify-between">
                <Button type="submit" className="bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                <Button variant="ghost" className="text-slate-200 hover:text-white" onClick={() => navigate("/signup")}>New here? Sign up</Button>
              </div>
            </form>
          </Card>

          <div className="mt-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-slate-300" />
              <span>Secure login • Role-based access coming soon</span>
            </div>
          </div>

          {/* subtle decorative circle */}
          <div className="absolute -right-20 -bottom-20 w-56 h-56 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-600 opacity-20 blur-3xl pointer-events-none" />
        </div>

        {/* RIGHT: Big hero, tagline, about */}
        <div className="p-10 md:p-14 bg-white flex flex-col justify-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">Welcome to SynergyHub</h1>
            <p className="mt-4 text-lg text-slate-600">
              Bring teams together. Plan visually. Deliver predictably.
            </p>

            <div className="mt-6 text-sm text-slate-500 space-y-3">
              <p>
                SynergyHub is a lightweight project & task workspace built for small teams and fast-moving projects.
                Create projects, add tasks, assign teammates, tag work and track progress, all in one simple place.
              </p>
              <p>
                Designed with minimalism in mind: less clutter, more focus. Perfect for product teams, agencies and startups.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button onClick={() => navigate("/signup")} className="bg-emerald-600 text-white hover:bg-emerald-700">Create free account</Button>
              
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
              <li>• Quick task creation</li>
              <li>• Tags & due dates</li>
              <li>• Shared project view</li>
              <li>• Lightweight auth & dashboard</li>
            </ul>
          </div>

          <div className="mt-8 text-xs text-slate-400">© {new Date().getFullYear()} SynergyHub</div>
        </div>
      </div>
    </div>
  );
}