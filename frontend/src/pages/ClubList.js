import { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function ClubList() {
  const [clubs, setClubs] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get('/clubs').then(res => setClubs(res.data));
  }, []);

  const handleDelete = (id) => {
    api.delete(`/clubs/${id}`).then(() => {
      setClubs(clubs.filter(c => c.id !== id));
    });
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">All Clubs</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            {['Name','Budget','Wages','Spend','Revenue','Net Profit','Actions'].map(h => (
              <th key={h} className="border p-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clubs.map(c => (
            <tr key={c.id} className="text-center">
              <td className="border p-2">{c.club_name}</td>
              <td className="border p-2">{c.total_budget}</td>
              <td className="border p-2">{c.player_wages}</td>
              <td className="border p-2">{c.transfer_spend}</td>
              <td className="border p-2">{c.revenue}</td>
              <td className="border p-2">{c.net_profit}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => nav(`/clubs/${c.id}`)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >View</button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
