import { useState } from 'react';
function IncomeForm({ onAddIncome }) {
    const [amount, setAmount] = useState('');
    function handleSubmit(event) {
  event.preventDefault();

  if (amount === '' || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    alert('Please enter a valid income amount.');
    return;
  }

  onAddIncome(amount);
  setAmount('');
}

  return (
    <section className="income-form">
      <h2>Record an Incoming Call</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="income-amount">
          Income Amount
        </label>

        <input
          type="number"
          id="income-amount"
          placeholder="0.00"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <button type="submit">
          Add Income
        </button>
      </form>
    </section>
  );
}

export default IncomeForm;