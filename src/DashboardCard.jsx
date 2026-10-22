function DashboardCard({ title, amount}) {
    return (
        <div className ="dashboard-card">
            <h3>{title}</h3>
            <p>{amount}</p>
        </div>
    );
}

export default DashboardCard;