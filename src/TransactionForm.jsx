import { useState } from 'react';
function TransactionForm({ onAddTransaction }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

function handleSubmit(event) {
  event.preventDefault();

  if (name.trim() === '' || amount === '' || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    alert('Please enter a valid expense name and amount.');
    return;
  }

  onAddTransaction(name.trim(), amount);

  setName('');
  setAmount('');
}

  return (
    <section className="transaction-form">
      <h2>Record a Casualty</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="transaction-name">
          Expense Name
        </label>

        <input
          type="text"
          id="transaction-name"
          placeholder="Enter expense name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor="transaction-amount">
          Amount
        </label>

        <input
          type="number"
          id="transaction-amount"
          placeholder="0.00"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <button type="submit">
          Add Expense
        </button>
      </form>
    </section>
  );
}

export default TransactionForm;