import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import StatCard from '../../components/StatCard'
import CaseRow from '../../components/CaseRow'

import {
  stats,
  cases,
  tenders,
  signalDistribution,
} from '../../data/mockData'

import './dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState('dashboard')

  const handleNavigation = (page) => {
    if (page === 'dashboard') {
      navigate('/dashboard')
      return
    }

    if (page === 'investigations') {
      navigate('/investigations')
      return
    }

    if (page === 'network') {
      navigate('/network')
      return
    }

    setActivePage(page)
  }

  const handleAddTender = () => {
    navigate('/add-tender')
  }

  const handleCaseClick = (caseData) => {
    navigate('/case/' + caseData.id)
  }

  return (
    <div className="dashboard-layout">

      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigation}
      />

      <main className="dashboard-main">

        <Topbar
          activePage={activePage}
          onAddTender={handleAddTender}
        />

        {activePage === 'dashboard' && (
          <div className="dashboard-content">

            {/* KPI SECTION */}
            <section className="stats-grid">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  description={stat.description}
                  index={index + 1}
                />
              ))}
            </section>


            {/* ACTIVITY + RISK */}
            <section className="analytics-grid">

              <div className="dashboard-panel activity-panel">

                <div className="panel-header">
                  <div>
                    <span className="panel-eyebrow">
                      PROCUREMENT ACTIVITY
                    </span>

                    <h2>Analysis activity</h2>
                  </div>

                  <span className="panel-period">
                    LAST 30 DAYS
                  </span>
                </div>

                <div className="activity-chart">

                  <div className="chart-y-axis">
                    <span>300</span>
                    <span>200</span>
                    <span>100</span>
                    <span>0</span>
                  </div>

                  <div className="chart-area">

                    <div className="chart-grid-line" />
                    <div className="chart-grid-line" />
                    <div className="chart-grid-line" />
                    <div className="chart-grid-line" />

                    <svg
                      className="activity-line"
                      viewBox="0 0 800 240"
                      preserveAspectRatio="none"
                    >
                      <polyline
                        points="
                          0,195
                          70,175
                          140,185
                          210,135
                          280,150
                          350,105
                          420,125
                          490,90
                          560,110
                          630,62
                          700,80
                          800,38
                        "
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <polyline
                        points="
                          0,225
                          70,215
                          140,220
                          210,195
                          280,205
                          350,180
                          420,188
                          490,165
                          560,174
                          630,145
                          700,152
                          800,130
                        "
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="6 7"
                        opacity="0.35"
                      />
                    </svg>

                    <div className="chart-x-axis">
                      <span>18 AUG</span>
                      <span>25 AUG</span>
                      <span>01 SEP</span>
                      <span>08 SEP</span>
                      <span>15 SEP</span>
                    </div>

                  </div>
                </div>

                <div className="chart-legend">
                  <span>
                    <i className="legend-solid" />
                    Tenders analyzed
                  </span>

                  <span>
                    <i className="legend-dashed" />
                    Signals generated
                  </span>
                </div>

              </div>


              <div className="dashboard-panel risk-panel">

                <div className="panel-header">
                  <div>
                    <span className="panel-eyebrow">
                      RISK DISTRIBUTION
                    </span>

                    <h2>Priority breakdown</h2>
                  </div>
                </div>

                <div className="risk-summary">

                  <div className="risk-total">
                    <strong>24</strong>
                    <span>active signals</span>
                  </div>

                  <div className="risk-bars">

                    <div className="risk-row">
                      <div>
                        <span>High</span>
                        <strong>7</strong>
                      </div>

                      <div className="risk-track">
                        <div
                          className="risk-fill risk-high"
                          style={{ width: '29%' }}
                        />
                      </div>
                    </div>

                    <div className="risk-row">
                      <div>
                        <span>Medium</span>
                        <strong>9</strong>
                      </div>

                      <div className="risk-track">
                        <div
                          className="risk-fill risk-medium"
                          style={{ width: '38%' }}
                        />
                      </div>
                    </div>

                    <div className="risk-row">
                      <div>
                        <span>Low</span>
                        <strong>8</strong>
                      </div>

                      <div className="risk-track">
                        <div
                          className="risk-fill risk-low"
                          style={{ width: '33%' }}
                        />
                      </div>
                    </div>

                  </div>

                </div>

                <div className="risk-note">
                  Priority reflects the combination of observed signals,
                  not a determination of wrongdoing.
                </div>

              </div>

            </section>


            {/* PRIORITY QUEUE */}
            <section className="dashboard-panel priority-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    INVESTIGATOR QUEUE
                  </span>

                  <h2>Priority investigations</h2>

                  <p>
                    Cases requiring the closest review based on current
                    procurement signals.
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() => navigate('/investigations')}
                >
                  View all investigations →
                </button>

              </div>

              <div className="case-table">

                <div className="case-table-header">
                  <span>CASE</span>
                  <span>SIGNAL</span>
                  <span>SCORE</span>
                  <span>VALUE</span>
                  <span>PRIORITY</span>
                  <span />
                </div>

                {cases.map((caseData) => (
                  <CaseRow
                    key={caseData.id}
                    caseData={caseData}
                    onClick={() => handleCaseClick(caseData)}
                  />
                ))}

              </div>

            </section>


            {/* LOWER SECTION */}
            <section className="lower-grid">

              {/* RECENT TENDERS */}
              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <span className="panel-eyebrow">
                      RECENT ACTIVITY
                    </span>

                    <h2>Recent tenders</h2>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActivePage('tenders')}
                  >
                    View all →
                  </button>

                </div>

                <div className="tender-list">

                  {tenders.map((tender) => (
                    <div
                      className="tender-item"
                      key={tender.id}
                    >

                      <div className="tender-id">
                        {tender.id}
                      </div>

                      <div className="tender-info">
                        <strong>{tender.title}</strong>
                        <span>{tender.department}</span>
                      </div>

                      <div className="tender-value">
                        {tender.value}
                      </div>

                      <span
                        className={`tender-status ${
                          tender.status
                            .toLowerCase()
                            .replaceAll(' ', '-')
                        }`}
                      >
                        {tender.status}
                      </span>

                    </div>
                  ))}

                </div>

              </div>


              {/* SIGNAL DISTRIBUTION */}
              <div className="dashboard-panel">

                <div className="panel-header">

                  <div>
                    <span className="panel-eyebrow">
                      SIGNAL ANALYSIS
                    </span>

                    <h2>What is being detected?</h2>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActivePage('evidence')}
                  >
                    Evidence →
                  </button>

                </div>

                <div className="signal-list">

                  {signalDistribution.map((signal) => (
                    <div
                      className="signal-item"
                      key={signal.name}
                    >

                      <div className="signal-info">

                        <div>
                          <strong>{signal.name}</strong>

                          <span>
                            {signal.count} active cases
                          </span>
                        </div>

                        <b>{signal.percentage}%</b>

                      </div>

                      <div className="signal-track">
                        <div
                          className="signal-fill"
                          style={{
                            width: `${signal.percentage}%`,
                          }}
                        />
                      </div>

                    </div>
                  ))}

                </div>

              </div>

            </section>


            {/* DISCLAIMER */}
            <div className="dashboard-disclaimer">

              <div className="disclaimer-icon">
                i
              </div>

              <div>
                <strong>
                  Investigation support, not automated accusations.
                </strong>

                <span>
                  Signals identify activity that deserves closer review.
                  They do not establish wrongdoing or corruption.
                </span>
              </div>

            </div>

          </div>
        )}

        {activePage !== 'dashboard' && (
          <div className="placeholder-page">

            <div className="placeholder-number">
              {activePage === 'tenders' && '03'}
              {activePage === 'vendors' && '04'}
              {activePage === 'network' && '05'}
              {activePage === 'evidence' && '06'}
            </div>

            <span>MODULE UNDER CONSTRUCTION</span>

            <h2>
              {activePage.charAt(0).toUpperCase() +
                activePage.slice(1)}
            </h2>

            <p>
              This investigation module will be connected to the
              Vigilant analysis engine next.
            </p>

            <button
              className="back-dashboard-button"
              onClick={() => setActivePage('dashboard')}
            >
              ← Back to dashboard
            </button>

          </div>
        )}

      </main>

    </div>
  )
}

export default Dashboard