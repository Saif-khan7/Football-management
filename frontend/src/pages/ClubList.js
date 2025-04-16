// src/pages/ClubList.js
import { useEffect, useState, useMemo } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ClubList() {
  const [clubs, setClubs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'net_profit', direction: 'descending' });
  const nav = useNavigate();

  useEffect(() => {
    api.get('/clubs')
      .then(res => setClubs(res.data))
      .catch(console.error);
  }, []);

  const sortedClubs = useMemo(() => {
    const sortable = [...clubs];
    if (sortConfig) {
      sortable.sort((a, b) => {
        const aVal = parseFloat(a[sortConfig.key]);
        const bVal = parseFloat(b[sortConfig.key]);
        if (aVal < bVal) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [clubs, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  const handleDelete = (id) => {
    api.delete(`/clubs/${id}`)
      .then(() => setClubs(clubs.filter(c => c.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Premier League Clubs Financial Overview</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse shadow-lg">
          <thead>
            <tr>
              <th rowSpan="2" className="border px-4 py-2 bg-gray-800 text-white">Name</th>
              <th rowSpan="2" className="border px-4 py-2 bg-gray-800 text-white">Budget</th>
              <th colSpan="3" className="border px-4 py-2 bg-green-600 text-white">Revenue</th>
              <th colSpan="3" className="border px-4 py-2 bg-red-600 text-white">Expenditure</th>
              <th
                rowSpan="2"
                className="border px-4 py-2 bg-gray-800 text-white cursor-pointer select-none"
                onClick={() => requestSort('net_profit')}
              >
                Net Profit {getArrow('net_profit')}
              </th>
              <th rowSpan="2" className="border px-4 py-2 bg-gray-800 text-white">Actions</th>
            </tr>
            <tr>
              <th className="border px-4 py-2 bg-green-200">Ticket Sales</th>
              <th className="border px-4 py-2 bg-green-200">Players Sold</th>
              <th className="border px-4 py-2 bg-green-200">Sponsors</th>
              <th className="border px-4 py-2 bg-red-200">Stadium Cost</th>
              <th className="border px-4 py-2 bg-red-200">Players Bought</th>
              <th className="border px-4 py-2 bg-red-200">Player Wages</th>
            </tr>
          </thead>
          <tbody>
            {sortedClubs.map(c => {
              const net = parseFloat(c.net_profit);
              return (
                <tr key={c.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{c.club_name}</td>
                  <td className="px-4 py-2">{c.total_budget}</td>
                  <td className="px-4 py-2 bg-green-50 text-green-800">{c.ticket_sales}</td>
                  <td className="px-4 py-2 bg-green-50 text-green-800">{c.players_sold}</td>
                  <td className="px-4 py-2 bg-green-50 text-green-800">{c.sponsors}</td>
                  <td className="px-4 py-2 bg-red-50 text-red-800">{c.stadium_cost}</td>
                  <td className="px-4 py-2 bg-red-50 text-red-800">{c.players_bought}</td>
                  <td className="px-4 py-2 bg-red-50 text-red-800">{c.player_wages}</td>
                  <td className={`px-4 py-2 font-semibold ${net >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {c.net_profit}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => nav(`/clubs/${c.id}`)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
