import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import CaseRow from '../../components/CaseRow'

import './dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const API_URL = import.meta.env.DEV
      ? 'https://vigilant-6sc2.vercel.app'
      : ''

    fetch(`${API_URL}/api/dashboard`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Dashboard API failed')
        }

        return res.json()
      })
      .then((result) => {
        setData(result)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <Topbar activePage="dashboard" />

          <div className="dashboard-content">
            Loading dashboard...
          </div>
        </main>
      </div>
    )
  }

  const summary = data.summary || {}
  const cases = data.priorityCases || []
  const recent = data.recentTenders || []
  const signals = data.signalDistribution || []

  const priority = (score) => {
    const s = Number(score || 0)

    if (s >= 75) return 'High'
    if (s >= 50) return 'Medium'

    return 'Low'
  }

  const money = (value) => {
    const n = Number(value || 0)
    return `Rs. ${(n / 10000000).toFixed(2)} Cr`
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <Topbar activePage="dashboard" />

        <div className="dashboard-content">

          {/* =========================
              STATS
          ========================== */}

          <section className="stats-grid">

            <div className="dashboard-stat stat-blue">
              <div className="stat-top">
                <span>ACTIVE SIGNALS</span>
                <small>01</small>
              </div>

              <strong>
                {Number(
                  summary.activeSignals || 0
                ).toLocaleString('en-IN')}
              </strong>

              <p>
                Detected signals across procurement records
              </p>
            </div>


            <div className="dashboard-stat stat-red">
              <div className="stat-top">
                <span>HIGH PRIORITY</span>
                <small>02</small>
              </div>

              <strong>
                {Number(
                  summary.highPriority || 0
                ).toLocaleString('en-IN')}
              </strong>

              <p>
                Cases prioritized for closer examination
              </p>
            </div>


            <div className="dashboard-stat">
              <div className="stat-top">
                <span>TENDERS ANALYZED</span>
                <small>03</small>
              </div>

              <strong>
                {Number(
                  summary.analyzedTenders || 0
                ).toLocaleString('en-IN')}
              </strong>

              <p>
                Procurement records analyzed
              </p>
            </div>


            <div className="dashboard-stat">
              <div className="stat-top">
                <span>VENDORS MAPPED</span>
                <small>04</small>
              </div>

              <strong>
                {Number(
                  summary.totalVendors || 0
                ).toLocaleString('en-IN')}
              </strong>

              <p>
                Winning vendors represented in the database
              </p>
            </div>

          </section>


          {/* =========================
              PRIORITY + RISK
          ========================== */}

          <section className="analytics-grid">

            <div className="dashboard-panel priority-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    INVESTIGATOR QUEUE
                  </span>

                  <h2>
                    Priority investigations
                  </h2>

                  <p>
                    Cases requiring closer review based on
                    observed procurement signals.
                  </p>
                </div>


                <button
                  className="text-button"
                  onClick={() =>
                    navigate('/investigations')
                  }
                >
                  View all investigations ?
                </button>

              </div>


              <div className="case-table">

                <div className="case-table-header">
                  <span>CASE</span>
                  <span>SIGNAL</span>
                  <span>SCORE</span>
                  <span>VALUE</span>
                  <span>PRIORITY</span>
                  <span></span>
                </div>


                {cases.slice(0, 5).map((tender) => {

                  const score = Number(
                    tender.investigation_priority || 0
                  )


                  return (
                    <CaseRow
                      key={
                        tender._id ||
                        tender.tenderId
                      }

                      caseData={{
                        id: `INV-${tender.tenderId}`,

                        tenderId:
                          tender.tenderId,

                        signal:
                          tender.signals?.[0]?.name ||
                          'Procurement anomaly signal',

                        score,

                        value:
                          money(
                            tender.contractValue
                          ),

                        priority:
                          priority(score),

                        vendor:
                          tender.winningVendor,

                        department:
                          tender.department,
                      }}

                      onClick={() => {

                        const tenderId =
                          tender.tenderId ||
                          tender.tender_id ||
                          tender.id


                        if (!tenderId) {
                          console.error(
                            'Missing tender ID:',
                            tender
                          )

                          return
                        }


                        navigate(
                          `/case/INV-${tenderId}`
                        )
                      }}
                    />
                  )
                })}

              </div>

            </div>


            {/* =========================
                RISK DISTRIBUTION
            ========================== */}

            <div className="dashboard-panel risk-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    RISK DISTRIBUTION
                  </span>

                  <h2>
                    Priority breakdown
                  </h2>
                </div>

              </div>


              <div className="risk-summary">

                <div className="risk-total">

                  <strong>
                    {Number(
                      summary.analyzedTenders || 0
                    ).toLocaleString('en-IN')}
                  </strong>

                  <span>
                    tenders analyzed
                  </span>

                </div>


                <div className="risk-bars">

                  {[
                    [
                      'High',
                      summary.highPriority,
                      'risk-high'
                    ],

                    [
                      'Medium',
                      summary.mediumPriority,
                      'risk-medium'
                    ],

                    [
                      'Low',
                      summary.lowPriority,
                      'risk-low'
                    ],

                  ].map(
                    ([name, count, cls]) => {

                      const total =
                        Number(
                          summary.highPriority ||
                          0
                        ) +

                        Number(
                          summary.mediumPriority ||
                          0
                        ) +

                        Number(
                          summary.lowPriority ||
                          0
                        )


                      const width =
                        total
                          ? (
                              Number(
                                count || 0
                              ) /
                              total
                            ) * 100
                          : 0


                      return (
                        <div
                          className="risk-row"
                          key={name}
                        >

                          <div>
                            <span>
                              {name}
                            </span>

                            <strong>
                              {Number(
                                count || 0
                              ).toLocaleString(
                                'en-IN'
                              )}
                            </strong>
                          </div>


                          <div className="risk-track">

                            <div
                              className={
                                `risk-fill ${cls}`
                              }

                              style={{
                                width:
                                  `${width}%`,
                              }}
                            />

                          </div>

                        </div>
                      )
                    }
                  )}

                </div>

              </div>


              <div className="risk-note">
                Priority reflects the combination
                of observed signals, not a
                determination of wrongdoing.
              </div>

            </div>

          </section>


          {/* =========================
              RECENT TENDERS + SIGNALS
          ========================== */}

          <section className="lower-grid">

            {/* =========================
                RECENT TENDERS
            ========================== */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    RECENT ACTIVITY
                  </span>

                  <h2>
                    Recent tenders
                  </h2>
                </div>


                <button
                  className="text-button"
                  onClick={() =>
                    navigate('/tenders')
                  }
                >
                  View all ?
                </button>

              </div>


              <div className="tender-list">

                {recent.slice(0, 5).map(
                  (tender) => (

                    <button
                      className="tender-item"

                      key={
                        tender._id ||
                        tender.tenderId
                      }

                      onClick={() => {

                        const tenderId =
                          tender.tenderId ||
                          tender.tender_id ||
                          tender.id


                        if (!tenderId) {
                          console.error(
                            'Missing tender ID:',
                            tender
                          )

                          return
                        }


                        navigate(
                          `/case/INV-${tenderId}`
                        )
                      }}
                    >

                      <div className="tender-id">
                        {tender.tenderId}
                      </div>


                      <div className="tender-info">

                        <strong>
                          {
                            tender.category ||
                            'Procurement Tender'
                          }
                        </strong>

                        <span>
                          {tender.department}
                          {' · '}
                          {tender.location}
                        </span>

                      </div>


                      <div className="tender-value">
                        {money(
                          tender.contractValue
                        )}
                      </div>


                      <span
                        className={
                          `tender-status ${
                            priority(
                              tender.investigation_priority
                            ).toLowerCase()
                          }`
                        }
                      >
                        {priority(
                          tender.investigation_priority
                        )}
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>


            {/* =========================
                SIGNAL ANALYSIS
            ========================== */}

            <div className="dashboard-panel signal-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    SIGNAL ANALYSIS
                  </span>

                  <h2>
                    What is being detected?
                  </h2>
                </div>


                <button
                  className="text-button"
                  onClick={() =>
                    navigate('/evidence')
                  }
                >
                  Evidence ?
                </button>

              </div>


              <div className="signal-list">

                {signals.map(
                  (signal) => (

                    <div
                      className="signal-item"
                      key={signal.name}
                    >

                      <div className="signal-info">

                        <div>

                          <strong>
                            {signal.name}
                          </strong>

                          <span>
                            {Number(
                              signal.count || 0
                            ).toLocaleString(
                              'en-IN'
                            )}
                            {' '}
                            active cases
                          </span>

                        </div>


                        <b>
                          {signal.percentage}%
                        </b>

                      </div>


                      <div className="signal-track">

                        <div
                          className="signal-fill"

                          style={{
                            width:
                              `${signal.percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            </div>

          </section>


          {/* =========================
              DISCLAIMER
          ========================== */}

          <div className="dashboard-disclaimer">

            <div className="disclaimer-icon">
              i
            </div>


            <div>

              <strong>
                Investigation support, not automated accusations.
              </strong>

              <span>
                Signals identify activity that deserves
                closer review. They do not establish
                wrongdoing or corruption.
              </span>

            </div>

          </div>

        </div>
      </main>
    </div>
  )
}

export default Dashboard

