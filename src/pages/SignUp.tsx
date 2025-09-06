
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormState = {
  username: string;
  password: string;
  email: string;
  jobTitle: string;
  department: string;
};

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    email: "",
    jobTitle: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.username.trim()) return "Username is required";
    if (!form.password || form.password.length < 6)
      return "Password must be at least 6 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email";
    if (!form.jobTitle.trim()) return "Job title is required";
    if (!form.department.trim()) return "Department is required";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // Create account
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || `Signup failed (${res.status})`);

      // Attempt auto-login
      const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (loginRes.ok) {
        const loginBody = await loginRes.json();
        if (loginBody.token) {
          localStorage.setItem("token", loginBody.token);
        }
        if (loginBody.user) {
          localStorage.setItem("user", JSON.stringify(loginBody.user));
        }
        // navigate to dashboard on successful login
        navigate("/dashboard");
        return;
      }

      // If auto-login failed, show success and instruct to login
      setSuccess("Account created. Please sign in.");
      setForm({ username: "", password: "", email: "", jobTitle: "", department: "" });
    } catch (err: any) {
      setError(err.message || "Signup error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT: Brand + blurb (dark) */}
        <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white p-10 md:p-16 flex flex-col justify-center">
          <div className="mb-6">
            <div className="inline-flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center text-slate-900 font-black">SH</div>
              <div>
                <h3 className="text-xl font-extrabold">SynergyHub</h3>
                <p className="text-xs text-slate-300">Collaborate faster. Ship smarter.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2">Create your workspace</h2>
          <p className="text-sm text-slate-300 max-w-md">
            Join SynergyHub to plan, assign and track work with your team. Lightweight, fast and focused on real work.
          </p>

          <ul className="mt-6 text-sm text-slate-300 space-y-2">
            <li>• Fast onboarding</li>
            <li>• Task, tags & due dates</li>
            <li>• Team-first workflow</li>
          </ul>

          <div className="mt-8">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => navigate("/")}>Already have an account? Sign in</Button>
          </div>

          <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-600 opacity-20 blur-3xl pointer-events-none" />
        </div>

        {/* RIGHT: Signup form (white) */}
        <div className="p-10 md:p-14 bg-white flex items-center">
          <Card className="w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold">Create account</h2>
            </div>

            {error && (
              <div className="mb-4 text-sm text-destructive border border-border rounded-md p-3 bg-destructive/5">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 text-sm text-success border border-border rounded-md p-3 bg-success/5">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" value={form.username} onChange={handleChange} placeholder="Choose a username" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@company.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input id="jobTitle" name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="e.g. Product Manager" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" value={form.department} onChange={handleChange} placeholder="e.g. Engineering" />
              </div>

              <div className="flex items-center justify-between md:col-span-2 mt-2">
                <div className="text-sm text-muted-foreground">
                  Already a member?{" "}
                  <Button variant="link" size="sm" onClick={() => navigate("/")}>
                    Sign in
                  </Button>
                </div>

                <div>
                  <Button type="submit" variant="primary" disabled={loading} className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white">
                    {loading ? "Creating..." : "Create account"}
                  </Button>
                </div>
              </div>
            </form>

            <p className="mt-4 text-xs text-muted-foreground">By creating an account you agree to our Terms of Service.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};