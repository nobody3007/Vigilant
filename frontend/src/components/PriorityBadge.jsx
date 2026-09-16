function PriorityBadge({ priority }) {
  return (
    <span className={`priority-badge priority-${priority.toLowerCase()}`}>
      <span className="priority-dot" />
      {priority}
    </span>
  )
}

export default PriorityBadge
