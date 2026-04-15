// Renders a simple fallback page for unmatched routes.
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p>The board route lives at the homepage in this assignment.</p>
      <Link to="/">Go to board</Link>
    </div>
  );
}
