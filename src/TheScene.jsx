import Greeting from "./Greeting";
import DashboardCard from "./DashboardCard";
import SpendingChart from "./SpendingChart";
import TransactionForm from "./TransactionForm";
import IncomeForm from "./IncomeForm";
import SavingsForm from "./SavingsForm";

function TheScene({
  income,
  totalExpenses,
  remainingBalance,
  savingsGoal,
  transactions,
  expenseCategories,
  deleteTransaction,
  updateSavingsGoal,
  addIncome,
  addTransaction,
}) {
  return (
    <>
      <Greeting />

      <h2 className="section-heading">Your Financial Overview</h2>

      <div className="dashboard-grid">
        <DashboardCard
          title="The Supply Drop"
          description="Total Income"
          amount={`$${income.toFixed(2)}`}
        />

        <DashboardCard
          title="The Damage"
          description="Total Expenses"
          amount={`$${totalExpenses.toFixed(2)}`}
        />

        <DashboardCard
          title="The Lifeline"
          description="Remaining Balance"
          amount={`$${remainingBalance.toFixed(2)}`}
        />

        <DashboardCard
          title="The Escape Plan"
          description="Savings Target"
          amount={`$${savingsGoal.toFixed(2)}`}
        />
      </div>

      {/* Displays expenses and allows transactions to be deleted */}
      <SpendingChart
        transactions={transactions}
        totalSpending={totalExpenses}
        onDeleteTransaction={deleteTransaction}
      />
      {/* Allows user to add income to their total */}
      <SavingsForm onSetGoal={updateSavingsGoal} />
      {/* Allows user to add income to their total */}
      <IncomeForm onAddIncome={addIncome} />
      {/* Allows user to add new expense transactions */}
      <TransactionForm
        onAddTransaction={addTransaction}
        categories={expenseCategories}
      />
    </>
  );
}

export default TheScene;
