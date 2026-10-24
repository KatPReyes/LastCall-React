function getMonthKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
  ].join("-");
}

function TheReveal({
  revealMonth,
  setRevealMonth,
  totalMonthlySpending,
  spendingByCategory,
  previousMonthHasExpenses,
  currentMonthHasExpenses,
  spendingDifference,
  previousTrendMonth,
  currentTrendMonth,
  monthlySpendingTrends,
  unlockedAchievements,
}) {
  return (
    <section className="page-section">
      <h1>The Reveal</h1>
      <p>Every expense tells a story.</p>

      <div className="month-navigation">
        <button
          type="button"
          onClick={() => {
            const [year, month] = revealMonth.split("-").map(Number);
            const previous = new Date(year, month - 2, 1);
            setRevealMonth(getMonthKey(previous));
          }}
        >
          ←
        </button>

        <span>
          {new Date(`${revealMonth}-01T12:00:00`).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <button
          type="button"
          disabled={revealMonth >= getMonthKey()}
          onClick={() => {
            const [year, month] = revealMonth.split("-").map(Number);
            const next = new Date(year, month, 1);
            setRevealMonth(getMonthKey(next));
          }}
        >
          →
        </button>
      </div>

      <h2>Reports & Insights</h2>

      <div className="spending-report">
        <h3>
          Where the Money Went —{" "}
          {new Date(`${revealMonth}-01T12:00:00`).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <p className="spending-total">
          Total Spent:{" "}
          <strong>
            {totalMonthlySpending.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </strong>
        </p>

        {Object.keys(spendingByCategory).length === 0 ? (
          <p>No expenses recorded for this month.</p>
        ) : (
          Object.entries(spendingByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => (
              <div className="spending-report-row" key={category}>
                <div className="spending-report-info">
                  <span>{category}</span>
                  <span>
                    {amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>

                <div className="spending-bar">
                  <div
                    className="spending-bar-fill"
                    style={{
                      width: `${
                        (amount /
                          Object.values(spendingByCategory).reduce(
                            (total, value) => total + value,
                            0,
                          )) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))
        )}
      </div>

      <div className="spending-comparison">
        <h3>Compared with Previous Month</h3>

        {!previousMonthHasExpenses || !currentMonthHasExpenses ? (
          <p className="spending-unchanged">Not enough data to compare</p>
        ) : spendingDifference > 0 ? (
          <p className="spending-increase">
            ↑ ${spendingDifference.toFixed(2)} more
          </p>
        ) : spendingDifference < 0 ? (
          <p className="spending-decrease">
            ↓ ${Math.abs(spendingDifference).toFixed(2)} less
          </p>
        ) : (
          <p className="spending-unchanged">No change in spending</p>
        )}

        <p className="comparison-details">
          {previousTrendMonth.label}: ${previousTrendMonth.total.toFixed(2)} →{" "}
          {currentTrendMonth.label}: ${currentTrendMonth.total.toFixed(2)}
        </p>
      </div>

      <div className="spending-trends">
        <h3>Spending Trends</h3>
        <p>Your spending over the last six months.</p>

        <div className="trends-chart">
          {monthlySpendingTrends.map((item) => {
            const highestSpending = Math.max(
              ...monthlySpendingTrends.map((month) => month.total),
              1,
            );

            return (
              <div className="trend-column" key={item.month}>
                <div className="trend-bar-area">
                  <span className="trend-amount">
                    {item.total.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </span>

                  <div
                    className="trend-bar"
                    style={{
                      height: `${(item.total / highestSpending) * 100}%`,
                    }}
                    title={`${item.month}: ${item.total.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      },
                    )}`}
                  />
                </div>

                <span className="trend-month">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

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
              {unlockedAchievements.followedTheRules ? "ACHIEVED" : "LOCKED"}
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
  );
}

export default TheReveal;
