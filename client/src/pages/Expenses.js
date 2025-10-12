import React, { useState, useEffect } from 'react';

const Expenses = () => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('expenses') || '[]');
    setExpenses(data);
  }, []);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || !reason) return;
    const newExpense = { amount: parseFloat(amount), reason, date: new Date().toLocaleString() };
    const updated = [...expenses, newExpense];
    setExpenses(updated);
    localStorage.setItem('expenses', JSON.stringify(updated));
    setAmount('');
    setReason('');
  };

  const total = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(90,79,243,0.08)', padding: '2rem' }}>
      <h2>Expenses Tracker</h2>
      <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ padding: '0.7rem', borderRadius: 6, border: '1px solid #e0e0e0' }}
          required
        />
        <input
          type="text"
          placeholder="Reason"
          value={reason}
          onChange={e => setReason(e.target.value)}
          style={{ padding: '0.7rem', borderRadius: 6, border: '1px solid #e0e0e0' }}
          required
        />
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button type="submit" style={{ padding: '0.7rem 1.5rem', borderRadius: 6, background: 'linear-gradient(90deg, #5a4ff3 0%, #8f6fff 100%)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Add</button>
        </div>
      </form>
      <h3>All Expenses</h3>
      {expenses.length === 0 ? (
        <div>No expenses yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {expenses.map((exp, idx) => (
            <li key={idx} style={{ marginBottom: '1rem', background: '#f7f7ff', borderRadius: 6, padding: '0.7rem' }}>
              <div><b>Amount:</b> ₹{exp.amount.toFixed(2)}</div>
              <div><b>Reason:</b> {exp.reason}</div>
              <div><b>Date:</b> {exp.date}</div>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ₹{total.toFixed(2)}</h3>
    </div>
  );
};

export default Expenses; 