import BudgetForm from "./BudgetForm";

function getMonthKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
  ].join("-");
}

function TheRules({
  selectedMonth,
  setSelectedMonth,
  displayedBudgets,
  survivalStats,
  currentMonth,
  expenseCategories,
  setBudget,
  getCategorySpending,
}) {
  return (
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
        <BudgetForm categories={expenseCategories} onSetBudget={setBudget} />
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
  );
}

export default TheRules;
