import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="text-xl">PL Finance Tracker</h1>
      <div>
        <Link to="/" className="mr-4 hover:underline">Clubs</Link>
        <Link to="/add" className="hover:underline">Add Club</Link>
      </div>
    </nav>
  );
}
