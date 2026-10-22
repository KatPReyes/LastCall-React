function SpendingChart({ transactions, totalSpending, onDeleteTransaction }) {
  return (

    <section className="spending-chart">
      <h2>Spending Overview</h2>
      <p>Transactions recorded: {transactions.length}</p>
      <p>Total spending: ${totalSpending.toFixed(2)}</p>
    
    <ul>
        {transactions.map(function(transaction) {
  return (
    <li key={transaction.id} className="transaction-item">
      {transaction.name} - ${transaction.amount.toFixed(2)}

      <button
        type="button"
        className="delete-button"
        onClick={() => onDeleteTransaction(transaction.id)}
      >
        Delete
      </button>
    </li>
  );
})}
    </ul>

    </section>
  );
}

export default SpendingChart;