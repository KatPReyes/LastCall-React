// React hooks used to manage data and perform sidee effect
import { useState, useEffect } from "react";

import TheScene from "./TheScene";
import TheRules from "./TheRules";
import TheReveal from "./TheReveal";

const expenseCategories = [
  "Groceries",
  "Housing",
  "Transportation",
  "Dining Out",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Other",
];

function getMonthKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
  ].join("-");
}

function getLatestBudgetMonth(history, currentMonth) {
  const months = Object.keys(history)
    .filter((month) => month <= currentMonth)
    .sort();

  return months.length > 0 ? months[months.length - 1] : null;
}

function rollOverBudgets(history, currentMonth) {
  if (history[currentMonth]) {
    return history;
  }

  const latestMonth = getLatestBudgetMonth(history, currentMonth);

  if (!latestMonth) {
    return history;
  }

  return {
    ...history,
    [currentMonth]: { ...history[latestMonth] },
  };
}

function isCompletedMonth(monthKey) {
  return monthKey < getMonthKey();
}

function followedTheRules(budgets, transactions, monthKey) {
  if (!isCompletedMonth(monthKey)) {
    return false;
  }
  const categories = Object.keys(budgets);

  if (categories.length === 0) {
    return false;
  }

  const hasInvalidBudget = categories.some((category) => {
    const limit = Number(budgets[category]);
    return !Number.isFinite(limit) || limit <= 0;
  });

  if (hasInvalidBudget) {
    return false;
  }

  const monthlyExpenses = transactions.filter(
    (transaction) =>
      transaction.date?.slice(0, 7) === monthKey &&
      (transaction.type === "expense" || transaction.type == null),
  );

  if (monthlyExpenses.length === 0) {
    return false;
  }

  return categories.every((category) => {
    const spent = monthlyExpenses
      .filter((transaction) => transaction.category === category)
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    return spent <= Number(budgets[category]);
  });
}

// Main component that manages the application's data and dashboard
function App() {
  const [activePage, setActivePage] = useState("scene");
  // Stores expense transactions and loads previously saved transactions
  // If no transactions are saved, start with an empty array
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Store total income and loads the previously saved amount
  // If no income is saved, start at zero
  const [income, setIncome] = useState(() => {
    const savedIncome = localStorage.getItem("income");
    return savedIncome !== null ? Number(savedIncome) : 0;
  });

  // Stores the savings goal and loads the previously saved target
  // If no savings goal exists, start at zero
  const [savingsGoal, setSavingsGoal] = useState(() => {
    const savedGoal = localStorage.getItem("savingsGoal");
    return savedGoal !== null ? Number(savedGoal) : 0;
  });

  const [categoryBudgets, setCategoryBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem("categoryBudgets");
    return savedBudgets ? JSON.parse(savedBudgets) : {};
  });

  const [selectedMonth, setSelectedMonth] = useState(() => getMonthKey());

  const [revealMonth, setRevealMonth] = useState(() => getMonthKey());

  const [budgetHistory, setBudgetHistory] = useState(() => {
    const savedHistory = localStorage.getItem("budgetHistory");
    return savedHistory ? JSON.parse(savedHistory) : {};
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const savedAchievements = localStorage.getItem("unlockedAchievements");
    return savedAchievements ? JSON.parse(savedAchievements) : {};
  });

  const displayedBudgets = budgetHistory[selectedMonth] || {};

  const spendingByCategory = transactions
    .filter(
      (transaction) =>
        (transaction.type ?? "expense") === "expense" &&
        typeof transaction.date === "string" &&
        transaction.date.slice(0, 7) === revealMonth,
    )
    .reduce((totals, transaction) => {
      const category = transaction.category;
      const amount = Number(transaction.amount);

      if (!category || !Number.isFinite(amount) || amount <= 0) {
        return totals;
      }

      totals[category] = (totals[category] || 0) + amount;

      return totals;
    }, {});

  const totalMonthlySpending = Object.values(spendingByCategory).reduce(
    (total, amount) => total + amount,
    0,
  );

  const monthlySpendingTrends = Array.from({ length: 6 }, (_, index) => {
    const [year, month] = revealMonth.split("-").map(Number);
    const date = new Date(year, month - 1 - (5 - index), 1);
    const monthKey = getMonthKey(date);

    const total = transactions
      .filter(
        (transaction) =>
          (transaction.type ?? "expense") === "expense" &&
          typeof transaction.date === "string" &&
          transaction.date.slice(0, 7) === monthKey,
      )
      .reduce((sum, transaction) => {
        const amount = Number(transaction.amount);
        return sum + (Number.isFinite(amount) && amount > 0 ? amount : 0);
      }, 0);

    return {
      month: monthKey,
      label: date.toLocaleDateString("en-US", { month: "short" }),
      total,
    };
  });

  const currentTrendMonth = monthlySpendingTrends[5];
  const previousTrendMonth = monthlySpendingTrends[4];

  const spendingDifference = currentTrendMonth.total - previousTrendMonth.total;

  const previousMonthHasExpenses = transactions.some(
    (transaction) =>
      (transaction.type ?? "expense") === "expense" &&
      typeof transaction.date === "string" &&
      transaction.date.slice(0, 7) === previousTrendMonth.month,
  );

  const currentMonthHasExpenses = transactions.some(
    (transaction) =>
      (transaction.type ?? "expense") === "expense" &&
      typeof transaction.date === "string" &&
      transaction.date.slice(0, 7) === currentTrendMonth.month,
  );

  // Saves the transaction list to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Saves the current income total whenever income changes
  useEffect(() => {
    localStorage.setItem("income", String(income));
  }, [income]);
  // Saves the savings goal whenever it changes
  useEffect(() => {
    localStorage.setItem("savingsGoal", String(savingsGoal));
  }, [savingsGoal]);
  // Saves the category budgets whenever they change
  useEffect(() => {
    localStorage.setItem("categoryBudgets", JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  useEffect(() => {
    localStorage.setItem("budgetHistory", JSON.stringify(budgetHistory));
  }, [budgetHistory]);

  useEffect(() => {
    localStorage.setItem(
      "unlockedAchievements",
      JSON.stringify(unlockedAchievements),
    );
  }, [unlockedAchievements]);

  useEffect(() => {
    const qualifyingMonth = Object.keys(budgetHistory)
      .sort()
      .find((monthKey) =>
        followedTheRules(budgetHistory[monthKey], transactions, monthKey),
      );

    if (qualifyingMonth) {
      setUnlockedAchievements((previous) => {
        if (previous.followedTheRules) {
          return previous;
        }

        return {
          ...previous,
          followedTheRules: true,
          followedTheRulesMonth: qualifyingMonth,
        };
      });
    }
  }, [budgetHistory, transactions]);

  useEffect(() => {
    const hasRecordedExpense = transactions.some(
      (transaction) => (transaction.type ?? "expense") === "expense",
    );

    if (hasRecordedExpense) {
      setUnlockedAchievements((previous) => {
        if (previous.firstBlood) {
          return previous;
        }

        return {
          ...previous,
          firstBlood: true,
        };
      });
    }
  }, [transactions]);

  useEffect(() => {
    const monthKey = getMonthKey();

    const savedHistory = JSON.parse(
      localStorage.getItem("budgetHistory") || "{}",
    );

    const updatedHistory = rollOverBudgets(savedHistory, monthKey);

    setBudgetHistory(updatedHistory);
    setCategoryBudgets(updatedHistory[monthKey] || {});
  }, []);

  // Adds together the amounts of all expense transactions
  // reduce() processes each transaction and accumulates a running total
  const totalExpenses = transactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  // Calculates the remaining balance after subtracting expenses from income
  const remainingBalance = income - totalExpenses;

  // Creates a new expense using the name and amount entered by the user
  function addTransaction(name, amount, category) {
    // Stores the expense as an object with an ID, name, and numeric amount
    const newTransaction = {
      id: Date.now(),
      name: name,
      amount: Number(amount),
      category: category,
      type: "expense",
      date: new Date().toLocaleDateString("en-CA"),
    };

    // Creates a new array containing existing expenses and the new expense
    // Updating state tells React to refresh the relevant dashboard information
    setTransactions([...transactions, newTransaction]);
  }

  function setBudget(category, amount) {
    setCategoryBudgets((previousBudgets) => ({
      ...previousBudgets,
      [category]: amount,
    }));

    const monthKey = getMonthKey();

    setBudgetHistory((previousHistory) => ({
      ...previousHistory,
      [monthKey]: {
        ...previousHistory[monthKey],
        [category]: amount,
      },
    }));
  }

  const currentMonth = getMonthKey();
  const previousMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1,
  );

  const previousMonthKey = [
    previousMonth.getFullYear(),
    String(previousMonth.getMonth() + 1).padStart(2, "0"),
  ].join("-");

  function getCategorySpending(category) {
    return transactions
      .filter((transaction) => {
        return (
          transaction.category === category &&
          typeof transaction.date === "string" &&
          transaction.date.slice(0, 7) === selectedMonth
        );
      })
      .reduce((total, transaction) => {
        return total + Number(transaction.amount);
      }, 0);
  }

  const survivalStats = Object.entries(displayedBudgets).reduce(
    (stats, [category, limit]) => {
      const spent = getCategorySpending(category);
      const percentage = (spent / Number(limit)) * 100;

      if (percentage >= 100) {
        stats.danger += 1;
      } else if (percentage >= 80) {
        stats.warning += 1;
      } else {
        stats.safe += 1;
      }

      return stats;
    },
    { safe: 0, warning: 0, danger: 0 },
  );

  // Deletes a transaction using its ID
  function deleteTransaction(id) {
    // Creates a new array containing every transaction except the selected one
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== id),
    );
  }
  // Adds a new income amount to the existing income total
  function addIncome(amount) {
    // Uses the previous income value and adds the new numeric amount
    setIncome((currentIncome) => currentIncome + Number(amount));
  }
  // Updates the user's savings target
  function updateSavingsGoal(amount) {
    // Replaces the previous goal with the new numeric amount
    setSavingsGoal(Number(amount));
  }
  // Returns the JSX that builds the Last Call interface
  return (
    <div className="app-layout">
      {/* Sidebar the applications navigation links */}
      <nav className="sidebar">
        <h2>Fatal Interest</h2>

        <ul>
          <li>
            <button
              type="button"
              className={
                activePage === "scene" ? "nav-link active" : "nav-link"
              }
              onClick={() => setActivePage("scene")}
            >
              <span className="nav-title">The Scene</span>
              <span className="nav-description">Dashboard</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={
                activePage === "rules" ? "nav-link active" : "nav-link"
              }
              onClick={() => setActivePage("rules")}
            >
              <span className="nav-title">The Rules</span>
              <span className="nav-description">Monthly Budgets</span>
            </button>
          </li>

          <li>
            <button
              type="button"
              className={
                activePage === "reveal" ? "nav-link active" : "nav-link"
              }
              onClick={() => setActivePage("reveal")}
            >
              <span className="nav-title">The Reveal</span>
              <span className="nav-description">Reports & Insights</span>
            </button>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        {activePage === "scene" && (
          <TheScene
            income={income}
            totalExpenses={totalExpenses}
            remainingBalance={remainingBalance}
            savingsGoal={savingsGoal}
            transactions={transactions}
            expenseCategories={expenseCategories}
            deleteTransaction={deleteTransaction}
            updateSavingsGoal={updateSavingsGoal}
            addIncome={addIncome}
            addTransaction={addTransaction}
          />
        )}
        {activePage === "rules" && (
          <TheRules
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            displayedBudgets={displayedBudgets}
            survivalStats={survivalStats}
            currentMonth={currentMonth}
            expenseCategories={expenseCategories}
            setBudget={setBudget}
            getCategorySpending={getCategorySpending}
          />
        )}
        {activePage === "reveal" && (
          <TheReveal
            revealMonth={revealMonth}
            setRevealMonth={setRevealMonth}
            totalMonthlySpending={totalMonthlySpending}
            spendingByCategory={spendingByCategory}
            previousMonthHasExpenses={previousMonthHasExpenses}
            currentMonthHasExpenses={currentMonthHasExpenses}
            spendingDifference={spendingDifference}
            previousTrendMonth={previousTrendMonth}
            currentTrendMonth={currentTrendMonth}
            monthlySpendingTrends={monthlySpendingTrends}
            unlockedAchievements={unlockedAchievements}
          />
        )}
      </main>
    </div>
  );
}
// Makes the app component available to import elsewhere in the project
export default App;
