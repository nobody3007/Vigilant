import PriorityBadge from './PriorityBadge'

function CaseRow({ caseData, onClick }) {
  return (
    <button className="case-row" onClick={onClick}>
      <div className="case-id">
        {caseData.id}
      </div>

      <div className="case-signal">
        <strong>{caseData.signal}</strong>
        <span>{caseData.department}</span>
      </div>

      <div className="case-score">
        <span>{caseData.score}</span>
        <small>/100</small>
      </div>

      <div className="case-value">
        {caseData.value}
      </div>

      <PriorityBadge priority={caseData.priority} />

      <div className="case-arrow">
        &rarr;
      </div>
    </button>
  )
}

export default CaseRow


