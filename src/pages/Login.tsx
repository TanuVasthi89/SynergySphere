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

      setSuccess("Signed in successfully.");
      // adjust navigation target as needed
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sign in</h1>
        <p className="text-muted-foreground mt-1">Sign in with your email and password</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <LogIn className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Login</h2>
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
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div className="flex justify-end md:col-span-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
