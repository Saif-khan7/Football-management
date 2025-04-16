import { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ClubDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/clubs/${id}`).then(res => setForm(res.data));
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    api.put(`/clubs/${id}`, form).then(() => nav('/'));
  };

  if (!form) return <p>Loading…</p>;

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Edit Club</h2>
      {['club_name','total_budget','player_wages','transfer_spend','revenue'].map(key => (
        <div key={key} className="mb-3">
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
      <p className="mb-4">
        <strong>Net Profit:</strong> {form.net_profit}
      </p>
      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
        Save
      </button>
      <button onClick={() => nav('/')} className="bg-gray-400 text-white px-4 py-2 rounded">
        Cancel
      </button>
    </div>
  );
}
