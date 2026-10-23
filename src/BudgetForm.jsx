
import { useState } from 'react';

function BudgetForm({ categories, onSetBudget }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!category || amount.trim() === '') {
      return;
    }

    const budgetAmount = Number(amount);

    if (!Number.isFinite(budgetAmount) || budgetAmount <= 0) {
      return;
    }

    onSetBudget(category, budgetAmount);

    setCategory('');
    setAmount('');
  }

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <h2>Set a Monthly Spending Limit</h2>

      <label htmlFor="budget-category">Category</label>
      <select
        id="budget-category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        required
      >
        <option value="">Select a category</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label htmlFor="budget-amount">Monthly Limit</label>
      <input
        id="budget-amount"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="Enter amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        required
      />

      <button type="submit">Set Budget</button>
    </form>
  );
}

export default BudgetForm;
