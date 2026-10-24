// React hooks used to manage data and perform sidee effect
import { useState, useEffect } from "react";

// Reusable components that make up the Last Call interface
import Greeting from "./Greeting";
import DashboardCard from "./DashboardCard";
import SpendingChart from "./SpendingChart";

// Form comments used to collect financial information
import TransactionForm from "./TransactionForm";
import IncomeForm from "./IncomeForm";
import SavingsForm from "./SavingsForm";
import BudgetForm from "./BudgetForm";

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

  const [budgetHistory, setBudgetHistory] = useState(() => {
    const savedHistory = localStorage.getItem("budgetHistory");
    return savedHistory ? JSON.parse(savedHistory) : {};
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const savedAchievements = localStorage.getItem("unlockedAchievements");
    return savedAchievements ? JSON.parse(savedAchievements) : {};
  });

  const displayedBudgets = budgetHistory[selectedMonth] || {};

  // Saves the transaction list to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Saves the current income total whenever income changes
  useEffect(() => {
    localStorage.setItem("income", String(income));
  }, [income]);

  // Saves the savings goal whenever the target changes
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
        <h2>Last Call</h2>

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
          <>
            {/* Displays the personalized greeting */}
            <Greeting />

            <h2 className="section-heading">Your Financial Overview</h2>

            <div className="dashboard-grid">
              <DashboardCard
                title="Incoming Calls"
                description="Total Income"
                amount={`$${income.toFixed(2)}`}
              />

              <DashboardCard
                title="Casualties"
                description="Total Expenses"
                amount={`$${totalExpenses.toFixed(2)}`}
              />

              <DashboardCard
                title="The Final Count"
                description="Remaining Balance"
                amount={`$${remainingBalance.toFixed(2)}`}
              />

              <DashboardCard
                title="Survival Fund Goal"
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
        )}
        {activePage === "rules" && (
          <section className="page-section">
            <h1>The Rules</h1>
            <p>Every scary movie has rules. So does your budget.</p>

            <div className="month-navigation">
              <button
                type="button"
                onClick={() => {
                  const [year, month] = selectedMonth.split("-").map(Number);
                  setSelectedMonth(getMonthKey(new Date(year, month - 2, 1)));
                }}
              ></button>

              <h3>
                {new Date(`${selectedMonth}-01T12:00:00`).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" },
                )}
              </h3>

              <button
                type="button"
                disabled={selectedMonth >= getMonthKey()}
                onClick={() => {
                  const [year, month] = selectedMonth.split("-").map(Number);
                  setSelectedMonth(getMonthKey(new Date(year, month, 1)));
                }}
              ></button>
            </div>

            <div className="survival-report">
              <h2>Monthly Survival Report</h2>
              <p>How long can you follow the rules?</p>
              {Object.keys(displayedBudgets).length === 0 && (
                <p className="survival-empty-message">
                  No survival data available for this month.
                </p>
              )}

              <div className="survival-stats">
                <div className="survival-stat safe">
                  <h3>{survivalStats.safe}</h3>
                  <p>Safe</p>
                </div>

                <div className="survival-stat warning">
                  <h3>{survivalStats.warning}</h3>
                  <p>Warning</p>
                </div>

                <div className="survival-stat danger">
                  <h3>{survivalStats.danger}</h3>
                  <p>Danger</p>
                </div>
              </div>
            </div>

            {selectedMonth === currentMonth && (
              <BudgetForm
                categories={expenseCategories}
                onSetBudget={setBudget}
              />
            )}

            <div className="budget-list">
              <h2>Your Monthly Budgets</h2>

              {Object.keys(displayedBudgets).length === 0 && (
                <p className="budget-empty-message">
                  No rules were written for this month.
                </p>
              )}
              {Object.entries(displayedBudgets)
                .sort(([categoryA, limitA], [categoryB, limitB]) => {
                  const percentageA =
                    (getCategorySpending(categoryA) / Number(limitA)) * 100;

                  const percentageB =
                    (getCategorySpending(categoryB) / Number(limitB)) * 100;

                  return percentageA - percentageB;
                })
                .map(([category, limit]) => {
                  const spent = getCategorySpending(category);
                  const remaining = Number(limit) - spent;
                  const percentage = (spent / Number(limit)) * 100;
                  const progress = Math.min(percentage, 100);
                  const budgetStatus =
                    percentage >= 100
                      ? "danger"
                      : percentage >= 80
                        ? "warning"
                        : "safe";
                  const budgetMessage =
                    budgetStatus === "danger"
                      ? "YOU BROKE THE RULES."
                      : budgetStatus === "warning"
                        ? "The killer is getting closer..."
                        : "You're following the rules.";
                  return (
                    <div className="budget-item" key={category}>
                      <h3>{category}</h3>

                      <p>Monthly Limit: ${Number(limit).toFixed(2)}</p>
                      <p>Spent: ${spent.toFixed(2)}</p>
                      <p>Remaining: ${remaining.toFixed(2)}</p>

                      <div
                        className={`budget-progress ${budgetStatus}`}
                        role="progressbar"
                        aria-label={`${category} budget used`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(progress)}
                      >
                        <div
                          className="budget-progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <p className="budget-percentage">
                        {percentage.toFixed(0)}% of budget used
                      </p>
                      <p className={`budget-message ${budgetStatus}`}>
                        {budgetMessage}
                      </p>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {activePage === "reveal" && (
          <section className="page-section">
            <h1>The Reveal</h1>
            <p>Every expense tells a story.</p>

            <h2>Reports & Insights</h2>
            <p>Your financial reports will appear here.</p>
            <div className="achievement-section">
              <h2>
                Achievements —{" "}
                {Number(Boolean(unlockedAchievements.followedTheRules)) +
                  Number(Boolean(unlockedAchievements.firstBlood))}{" "}
                / 2 Unlocked
              </h2>

              <div className="achievement-progress">
                <div
                  className="achievement-progress-fill"
                  style={{
                    width: `${
                      ((Number(Boolean(unlockedAchievements.followedTheRules)) +
                        Number(Boolean(unlockedAchievements.firstBlood))) /
                        2) *
                      100
                    }%`,
                  }}
                />
              </div>

              <div
                className={`achievement-card ${unlockedAchievements.followedTheRules ? "unlocked" : "locked"}`}
              >
                <span className="achievement-icon">
                  {unlockedAchievements.followedTheRules ? "🏆" : "🔒"}
                </span>

                <div className="achievement-details">
                  <h3>Followed the Rules</h3>

                  <p>
                    {unlockedAchievements.followedTheRules
                      ? "You survived the month without breaking a single budget rule."
                      : "Complete a month with at least one expense and stay within every budget."}
                  </p>

                  <span className="achievement-status">
                    {unlockedAchievements.followedTheRules
                      ? "ACHIEVED"
                      : "LOCKED"}
                  </span>

                  {unlockedAchievements.followedTheRulesMonth && (
                    <p className="achievement-date">
                      Unlocked{" "}
                      {new Date(
                        `${unlockedAchievements.followedTheRulesMonth}-01T12:00:00`,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`achievement-card ${unlockedAchievements.firstBlood ? "unlocked" : "locked"}`}
              >
                <span className="achievement-icon">
                  {unlockedAchievements.firstBlood ? "🩸" : "🔒"}
                </span>

                <div className="achievement-details">
                  <h3>First Blood</h3>

                  <p>
                    {unlockedAchievements.firstBlood
                      ? "Every story starts somewhere. You recorded your first expense."
                      : "Record your first expense to unlock this achievement."}
                  </p>

                  <span className="achievement-status">
                    {unlockedAchievements.firstBlood ? "ACHIEVED" : "LOCKED"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
// Makes the app component available to import elsewhere in the project
export default App;
