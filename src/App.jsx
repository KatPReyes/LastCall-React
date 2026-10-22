import { useState, useEffect } from 'react';
import Greeting from'./Greeting';
import DashboardCard from'./DashboardCard';
import SpendingChart from './SpendingChart';
import TransactionForm from './TransactionForm';
import IncomeForm from './IncomeForm';
import SavingsForm from './SavingsForm';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [income, setIncome] = useState(() => {
  const savedIncome = localStorage.getItem('income');
  return savedIncome !== null ? Number(savedIncome) : 0;
  });

  const [savingsGoal, setSavingsGoal] = useState(() => {
  const savedGoal = localStorage.getItem('savingsGoal');
  return savedGoal !== null ? Number(savedGoal) : 0;
});

useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}, [transactions]);
useEffect(() => {
  localStorage.setItem('income', String(income));
}, [income]);
useEffect(() => {
  localStorage.setItem('savingsGoal', String(savingsGoal));
}, [savingsGoal]);

const totalExpenses = transactions.reduce((total, transaction) => {
  return total + transaction.amount;
}, 0);
const remainingBalance = income - totalExpenses;

  function addTransaction(name, amount) {
  const newTransaction = {
    id: Date.now(),
    name: name,
    amount: Number(amount)
  };

  setTransactions([...transactions, newTransaction]);
}
  function deleteTransaction(id) {
  setTransactions((currentTransactions) =>
    currentTransactions.filter((transaction) => transaction.id !== id)
  );
}
function addIncome(amount) {
  setIncome((currentIncome) => currentIncome + Number(amount));
}
function updateSavingsGoal(amount) {
  setSavingsGoal(Number(amount));
}
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h2>Last Call</h2>
        <ul>
          <li>The Scene</li>
          <li>The Rules</li>
          <li>The Reveal</li>
        </ul>
      </nav>

      <main className="main-content">
        <Greeting />

        <h2 className="section-heading">Your Financial Overview</h2>

          <div className="dashboard-grid">

            <DashboardCard 
              title="Incoming Calls"
              amount={`$${income.toFixed(2)}`}
            />
            <DashboardCard 
              title="Casualties" 
              amount={`$${totalExpenses.toFixed(2)}`}
            />
            <DashboardCard 
              title="The Final Count" 
              amount={`$${remainingBalance.toFixed(2)}`}
            />

            <DashboardCard 
              title="Survival Fund Goal" 
              amount={`$${savingsGoal.toFixed(2)}`}
            />

          </div>

          <SpendingChart 
            transactions={transactions}
            totalSpending={totalExpenses}
            onDeleteTransaction={deleteTransaction}
          />

          <SavingsForm onSetGoal={updateSavingsGoal} />
          <IncomeForm onAddIncome={addIncome} />
          <TransactionForm onAddTransaction={addTransaction} />

      </main>
    </div>
  );
}

export default App;
