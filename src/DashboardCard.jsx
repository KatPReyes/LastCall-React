function DashboardCard({ title, description, amount }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <span className="dashboard-description">
        {description}
      </span>
      <p>{amount}</p>
    </div>
  );
}

export default DashboardCard;