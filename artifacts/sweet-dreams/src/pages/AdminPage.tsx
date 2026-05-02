import { useState } from "react";
import AdminLogin from "./AdminLogin";

export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("cakeauth") === "true"
  );

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="section-title text-gradient">Admin Panel</h1>
    </div>
  );
}
