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
        // navigate to dashboard (root)
        navigate("/");
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
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
        <p className="text-muted-foreground mt-1">Sign up to access the application</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserPlus className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Sign Up</h2>
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
            <Input id="username" name="username" value={form.username} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" name="jobTitle" value={form.jobTitle} onChange={handleChange} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" name="department" value={form.department} onChange={handleChange} />
          </div>

          <div className="flex justify-end md:col-span-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
