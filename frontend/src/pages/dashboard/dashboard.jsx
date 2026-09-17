import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import './dashboard.css'

const API_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000'
  : 'https://vigilant-6sc2.vercel.app'

function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/dashboard`)
        if (!response.ok) throw new Error(`Dashboard request failed: ${response.status}`)
        const result = await response.json()
        if (!cancelled) setData(result)
      } catch (err) {
        console.error(err)
        if (!cancelled) setError('Dashboard data could not be loaded.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboard()
    return () => { cancelled = true }
  }, [])

  const summary = data?.summary || {
    totalTenders: 0,
    totalVendors: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    analyzedTenders: 0,
    activeSignals: 0,
  }

  const cases = Array.isArray(data?.priorityCases) ? data.priorityCases : []
  const recent = Array.isArray(data?.recentTenders) ? data.recentTenders : []
  const signals = Array.isArray(data?.signalDistribution) ? data.signalDistribution : []
  const totalPriority = summary.highPriority + summary.mediumPriority + summary.lowPriority || 1

  const formatValue = (value) => {
    const number = Number(value || 0)
    if (number >= 10000000) return `Rs. ${(number / 10000000).toFixed(2)} Cr`
    if (number >= 100000) return `Rs. ${(number / 100000).toFixed(2)} L`
    return `Rs. ${number.toLocaleString('en-IN')}`
  }

  const score = (item) => Number(item?.investigation_priority ?? item?.score ?? 0)

  return (
    <div className="dashboard-page">
      <Sidebar />
      <main className="dashboard-main">
        <Topbar activePage="dashboard" />

        <div className="dashboard-content">
          <section className="dashboard-heading">
            <div>
              <span className="dashboard-eyebrow">PROCUREMENT OVERSIGHT</span>
              <h1>Investigation Overview</h1>
              <p>Monitor procurement activity and prioritize records requiring closer review.</p>
            </div>
            <div className="live-status"><span /> LIVE MONITORING</div>
          </section>

          {loading ? (
            <div className="dashboard-state">Loading procurement analysis...</div>
          ) : error ? (
            <div className="dashboard-state error">{error}</div>
          ) : (
            <>
              <section className="stats-grid">
                <div className="stat-card blue"><span>ACTIVE SIGNALS</span><strong>{summary.activeSignals.toLocaleString('en-IN')}</strong><small>Derived signals across analyzed records</small></div>
                <div className="stat-card red"><span>HIGH PRIORITY</span><strong>{summary.highPriority.toLocaleString('en-IN')}</strong><small>Records prioritized for closer examination</small></div>
                <div className="stat-card"><span>TENDERS ANALYZED</span><strong>{summary.analyzedTenders.toLocaleString('en-IN')}</strong><small>Procurement records evaluated by the model</small></div>
                <div className="stat-card"><span>VENDORS MAPPED</span><strong>{summary.totalVendors.toLocaleString('en-IN')}</strong><small>Winning vendors represented in source data</small></div>
              </section>

              <section className="dashboard-grid">
                <div className="panel priority-panel">
                  <div className="panel-header">
                    <div><span>INVESTIGATOR QUEUE</span><h2>Priority investigations</h2><p>Highest-priority records based on the current model ranking.</p></div>
                    <button onClick={() => navigate('/investigations')}>View all investigations</button>
                  </div>
                  <div className="case-table">
                    <div className="case-head"><span>CASE</span><span>SIGNAL</span><span>SCORE</span><span>VALUE</span><span>PRIORITY</span></div>
                    {cases.slice(0, 7).map((item) => {
                      const s = score(item)
                      return <button className="case-row" key={item.tenderId} onClick={() => navigate(`/case/${item.tenderId}`)}>
                        <strong>INV-{item.tenderId}</strong>
                        <div><b>{item.signal}</b><small>{item.department}</small></div>
                        <strong>{s.toFixed(2)}<em>/100</em></strong>
                        <span>{formatValue(item.contractValue)}</span>
                        <span className={`badge ${String(item.priority || 'Low').toLowerCase()}`}>{item.priority}</span>
                      </button>
                    })}
                  </div>
                </div>

                <div className="panel risk-panel">
                  <div className="panel-header"><div><span>PRIORITY DISTRIBUTION</span><h2>Priority breakdown</h2></div></div>
                  <div className="risk-total"><strong>{summary.analyzedTenders.toLocaleString('en-IN')}</strong><span>tenders analyzed</span></div>
                  <div className="risk-list">
                    {[
                      ['High', summary.highPriority, 'high'],
                      ['Medium', summary.mediumPriority, 'medium'],
                      ['Low', summary.lowPriority, 'low'],
                    ].map(([label, value, cls]) => <div className="risk-item" key={label}><div><span>{label}</span><b>{value.toLocaleString('en-IN')}</b></div><div className="risk-track"><i className={cls} style={{width: `${(value / totalPriority) * 100}%`}} /></div></div>)}
                  </div>
                  <p className="panel-note">Priority is an investigation-support score, not a probability or finding of wrongdoing.</p>
                </div>
              </section>

              <section className="lower-grid">
                <div className="panel">
                  <div className="panel-header"><div><span>SIGNAL ANALYSIS</span><h2>Observed signals</h2></div></div>
                  <div className="signal-list">
                    {signals.map((item) => <div className="signal-item" key={item.name}><div><b>{item.name}</b><small>{item.count} records</small></div><div className="signal-track"><i style={{width: `${item.percentage}%`}} /></div><strong>{item.percentage}%</strong></div>)}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header"><div><span>PROCUREMENT RECORDS</span><h2>Recent tenders</h2></div><button onClick={() => navigate('/tenders')}>View all tenders</button></div>
                  <div className="recent-list">
                    {recent.map((item) => <button className="recent-row" key={item.tenderId} onClick={() => navigate(`/case/${item.tenderId}`)}><div><b>{item.tenderId}</b><small>{item.category} · {item.location}</small></div><span>{formatValue(item.contractValue)}</span><strong className={`badge ${String(item.priority || 'Low').toLowerCase()}`}>{item.priority}</strong></button>)}
                  </div>
                </div>
              </section>

              <div className="dashboard-disclaimer"><b>Investigation support, not automated accusations.</b><span>Signals and priority scores identify records for closer human review. They do not establish misconduct.</span></div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
