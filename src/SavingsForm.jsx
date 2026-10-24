import { useState } from 'react';

function SavingsForm({ onSetGoal }) {
    const[amount, setAmount] =useState('');

    function handleSubmit(event) {
        event.preventDefault();

  if (amount === '' || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
    alert('Please enter a valid savings goal.');
    return;
  }

  onSetGoal(amount);
  setAmount('');
}

  return (
    <section className="savings-form">
      <h2>Plan Your Escape</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="savings-goal">
          Savings Goal
        </label>

        <input
          type="number"
          id="savings-goal"
          placeholder="0.00"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <button type="submit">
          Set Goal
        </button>
      </form>
    </section>
  );
}

export default SavingsForm;