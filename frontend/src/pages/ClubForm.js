import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ClubForm() {
  const [form, setForm] = useState({
    club_name:'', total_budget:0, ticket_sales:0,
    players_sold:0, sponsors:0, stadium_cost:0,
    players_bought:0, player_wages:0
  });
  const nav = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/clubs', form)
       .then(() => nav('/'))
       .catch(console.error);
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Add New Club</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key:'club_name', label:'Club Name', type:'text' },
          { key:'total_budget', label:'Total Budget', type:'number' },
          { key:'ticket_sales', label:'Ticket Sales', type:'number' },
          { key:'players_sold', label:'Players Sold', type:'number' },
          { key:'sponsors', label:'Sponsors', type:'number' },
          { key:'stadium_cost', label:'Stadium Cost', type:'number' },
          { key:'players_bought', label:'Players Bought', type:'number' },
          { key:'player_wages', label:'Player Wages', type:'number' },
        ].map(({key,label,type}) => (
          <div key={key}>
            <label className="block mb-1">{label}</label>
            <input
              name={key}
              type={type}
              value={form[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button type="submit"
          className="w-full bg-green-600 text-white p-2 rounded">
          Save Club
        </button>
      </form>
    </div>
  );
}
