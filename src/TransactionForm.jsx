import { useState } from 'react';
function TransactionForm({ onAddTransaction, categories }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

function handleSubmit(event) {
  event.preventDefault();

  if (
  name.trim() === '' ||
  amount === '' ||
  !Number.isFinite(Number(amount)) ||
  Number(amount) <= 0 ||
  category === ''
) {
    alert('Please enter a valid expense name, amount and category.');
    return;
  }

  onAddTransaction(name.trim(), amount, category);

  setName('');
  setAmount('');
  setCategory('');
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
        <label htmlFor="transaction-category">
          Category
        </label>

<select
  id="transaction-category"
  value={category}
  onChange={(event) => setCategory(event.target.value)}
>
  <option value="">Select a category</option>

  {categories.map((categoryOption) => (
    <option key={categoryOption} value={categoryOption}>
      {categoryOption}
    </option>
  ))}
</select>

        <button type="submit">
          Add Expense
        </button>
      </form>
    </section>
  );
}

export default TransactionForm;