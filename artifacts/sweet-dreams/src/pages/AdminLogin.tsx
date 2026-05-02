import { useState } from "react";

const ADMIN_PASSWORD =
  import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("cakeauth", "true");
      onSuccess();
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card-dark p-8 w-full max-w-sm">
        <h1 className="font-playfair text-2xl font-bold text-white mb-2 text-center">
          Admin Access
        </h1>
        <p className="section-subtitle text-center mb-6">Sweet Dreams Cakes</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            className="input-dark"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm text-center">Incorrect password</p>
          )}
          <button type="submit" className="btn-primary text-center">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
