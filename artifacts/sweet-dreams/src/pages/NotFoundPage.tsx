import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="section-title">404</h1>
      <p className="section-subtitle">Page not found</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );
}
