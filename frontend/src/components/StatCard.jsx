function StatCard({ label, value, description, index }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        <span className="stat-index">
          {String(index).padStart(2, '0')}
        </span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-description">
        {description}
      </div>
    </div>
  )
}

export default StatCard


