import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function ClubForm() {
  const [form, setForm] = useState({
    club_name:'', total_budget:0, player_wages:0, transfer_spend:0, revenue:0
  });
  const nav = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/clubs', form).then(() => nav('/'));
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Add New Club</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['club_name','total_budget','player_wages','transfer_spend','revenue'].map(key => (
          <div key={key}>
            <label className="block">{key.replace('_',' ').toUpperCase()}</label>
            <input
              type={key==='club_name'?'text':'number'}
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Save Club
        </button>
      </form>
    </div>
  );
}
