import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page-header" style={{ minHeight: '60vh' }}>
      <span className="kicker">404</span>
      <h1>Lost at sea 🌊</h1>
      <p>This page doesn’t exist, or the tide took it.</p>
      <Link to="/" className="btn btn-primary">
        Back to shore
      </Link>
    </div>
  );
}
