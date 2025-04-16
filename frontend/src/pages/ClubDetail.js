// src/pages/ClubDetail.js
import { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ClubDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/clubs/${id}`)
       .then(res => setForm(res.data))
       .catch(console.error);
  }, [id]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () =>
    api.put(`/clubs/${id}`, form)
       .then(() => nav('/'))
       .catch(console.error);

  if (!form) return <p>Loading…</p>;

  // compute revenue vs expenditure
  const revenueTotal = 
    parseFloat(form.ticket_sales) +
    parseFloat(form.players_sold) +
    parseFloat(form.sponsors);

  const expenditureTotal =
    parseFloat(form.stadium_cost) +
    parseFloat(form.players_bought) +
    parseFloat(form.player_wages);

  const data = [
    { name: 'Revenue', value: revenueTotal },
    { name: 'Expenditure', value: expenditureTotal }
  ];

  const COLORS = ['#82ca9d', '#8884d8'];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl mb-4">Edit {form.club_name}</h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={val => val.toLocaleString()} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

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
        <div key={key} className="mb-3">
          <label className="block mb-1 font-medium">{label}</label>
          <input
            name={key}
            type={type}
            value={form[key]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      ))}

      <p className="mb-4">
        <strong>Net Profit:</strong> {form.net_profit}
      </p>

      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={() => nav('/')}
          className="flex-1 bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
