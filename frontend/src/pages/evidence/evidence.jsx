import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

import './evidence.css'

const API_URL = 'https://vigilant-6sc2.vercel.app'

const SIGNAL_INFO = {
  'Price deviation': {
    field: 'current_price_vs_comparable_percent',
    description:
      'Contract price differs from comparable procurement prices.',
  },

  'High bid similarity': {
    field: 'bid_similarity_percent',
    description:
      'Bid values show a high degree of similarity.',
  },

  'Repeated participation pattern': {
    field: 'shared_tenders',
    description:
      'Vendors repeatedly appear together across procurement events.',
  },

  'High vendor win concentration': {
    field: 'historical_win_rate',
    description:
      'Historical vendor win rate is elevated.',
  },

  'Strong network relationship': {
    field: 'network_relationship_strength',
    description:
      'The record has strong historical network relationships.',
  },

  'Market price movement': {
    field: 'market_price_increase',
    description:
      'Market movement may explain part of the observed price change.',
  },
}

function formatEvidenceValue(signalName, value, unit) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return 'Not available'
  }

  if (unit === '%') {
    return `${number.toFixed(2)}%`
  }

  if (unit === 'strength') {
    return number.toFixed(3)
  }

  if (unit === 'shared tenders') {
    return `${Math.round(number)} shared tenders`
  }

  return number.toFixed(2)
}

function getSignalPriority(signal, tenderPriority) {
  const value = Number(signal?.value)

  if (
    signal?.name === 'High bid similarity' &&
    value >= 90
  ) {
    return 'High'
  }

  if (
    signal?.name === 'Price deviation' &&
    Math.abs(value) >= 10
  ) {
    return 'High'
  }

  if (
    signal?.name === 'Repeated participation pattern' &&
    value >= 15
  ) {
    return 'High'
  }

  if (
    signal?.name === 'High vendor win concentration' &&
    value >= 75
  ) {
    return 'High'
  }

  if (
    signal?.name === 'Strong network relationship' &&
    value >= 0.75
  ) {
    return 'High'
  }

  if (tenderPriority === 'High') {
    return 'Medium'
  }

  return 'Low'
}

function Evidence() {
  const navigate = useNavigate()

  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    let cancelled = false

    async function loadEvidence() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `${API_URL}/api/tenders?limit=100&skip=0`
        )

        if (!response.ok) {
          throw new Error(
            `Evidence request failed: ${response.status}`
          )
        }

        const data = await response.json()

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.items)
            ? data.items
            : []

        if (!cancelled) {
          setTenders(items)
        }
      } catch (err) {
        console.error('Evidence API error:', err)

        if (!cancelled) {
          setError(
            'Unable to load analyzed procurement evidence.'
          )
          setTenders([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadEvidence()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setVisibleCount(20)
  }, [search])

  const evidenceRecords = useMemo(() => {
    const records = []

    tenders.forEach((tender) => {
      const signals = Array.isArray(tender.signals)
        ? tender.signals
        : []

      signals.forEach((signal, index) => {
        if (!signal || typeof signal !== 'object') {
          return
        }

        const signalName =
          signal.name || 'Procurement anomaly signal'

        const info = SIGNAL_INFO[signalName]

        records.push({
          id: `${tender.tenderId}-${signalName}-${index}`,
          tenderId: tender.tenderId,
          department: tender.department,
          category: tender.category,
          location: tender.location,
          tenderPriority: tender.priority || 'Low',
          score: Number(
            tender.investigation_priority || 0
          ),
          signalName,
          value: signal.value,
          unit: signal.unit,
          description:
            signal.description ||
            info?.description ||
            'Observed procurement signal.',
          field:
            info?.field ||
            'procurement_signal',
          signalPriority: getSignalPriority(
            signal,
            tender.priority
          ),
        })
      })
    })

    return records
  }, [tenders])

  const filteredEvidence = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return evidenceRecords
    }

    return evidenceRecords.filter((record) =>
      [
        record.tenderId,
        record.department,
        record.category,
        record.location,
        record.signalName,
        record.description,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    )
  }, [evidenceRecords, search])

  const visibleEvidence = filteredEvidence.slice(
    0,
    visibleCount
  )

  const highCount = evidenceRecords.filter(
    (item) => item.signalPriority === 'High'
  ).length

  const mediumCount = evidenceRecords.filter(
    (item) => item.signalPriority === 'Medium'
  ).length

  const signalCount = evidenceRecords.length

  const handleOpenCase = (tenderId) => {
    if (tenderId) {
      navigate(`/case/${tenderId}`)
    }
  }

  return (
    <div
      className="evidence-page"
      style={{
        '--navy': '#111827',
        '--navy-light': '#1b2736',
        '--navy-active': '#243447',
        '--blue': '#1769aa',
        '--blue-light': '#2b91c8',
        '--page': '#f4f6f8',
        '--white': '#ffffff',
        '--text': '#18232d',
        '--text-secondary': '#5f6d77',
        '--text-muted': '#84919a',
        '--border': '#dce2e6',
      }}
    >
      <Sidebar />

      <main className="evidence-main">
        <Topbar activePage="evidence" />

        <div
          className="evidence-content"
          style={{
            padding: '34px 48px 50px',
            background: '#f4f6f8',
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          {/* PAGE HEADER */}
          <section
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '28px',
              gap: '30px',
            }}
          >
            <div>
              <div
                style={{
                  color: '#1769aa',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  marginBottom: '9px',
                }}
              >
                EVIDENCE REPOSITORY
              </div>

              <h1
                style={{
                  margin: 0,
                  color: '#18232d',
                  fontSize: '30px',
                  fontWeight: 700,
                  letterSpacing: '-0.7px',
                }}
              >
                Procurement Evidence
              </h1>

              <p
                style={{
                  margin: '8px 0 0',
                  color: '#5f6d77',
                  fontSize: '13px',
                }}
              >
                Trace observed procurement signals back to
                the underlying analyzed records.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#5f6d77',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '1px',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#2b91c8',
                  display: 'inline-block',
                }}
              />
              LIVE MONITORING
            </div>
          </section>

          {/* SUMMARY */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, minmax(0, 1fr))',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #dce2e6',
                borderRadius: '6px',
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  color: '#84919a',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1.2px',
                }}
              >
                ANALYZED RECORDS
              </div>

              <strong
                style={{
                  display: 'block',
                  marginTop: '7px',
                  color: '#18232d',
                  fontSize: '24px',
                }}
              >
                {loading ? '—' : tenders.length}
              </strong>

              <span
                style={{
                  color: '#84919a',
                  fontSize: '10px',
                }}
              >
                procurement records loaded
              </span>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #dce2e6',
                borderRadius: '6px',
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  color: '#84919a',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1.2px',
                }}
              >
                OBSERVED SIGNALS
              </div>

              <strong
                style={{
                  display: 'block',
                  marginTop: '7px',
                  color: '#18232d',
                  fontSize: '24px',
                }}
              >
                {loading ? '—' : signalCount}
              </strong>

              <span
                style={{
                  color: '#84919a',
                  fontSize: '10px',
                }}
              >
                traceable signals
              </span>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #dce2e6',
                borderRadius: '6px',
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  color: '#84919a',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1.2px',
                }}
              >
                HIGH-PRIORITY SIGNALS
              </div>

              <strong
                style={{
                  display: 'block',
                  marginTop: '7px',
                  color: '#b43d3d',
                  fontSize: '24px',
                }}
              >
                {loading ? '—' : highCount}
              </strong>

              <span
                style={{
                  color: '#84919a',
                  fontSize: '10px',
                }}
              >
                requiring closer review
              </span>
            </div>
          </section>

          {/* MAIN EVIDENCE PANEL */}
          <section
            style={{
              background: '#ffffff',
              border: '1px solid #dce2e6',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {/* PANEL HEADER */}
            <div
              style={{
                padding: '20px 22px',
                borderBottom: '1px solid #e9edef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#1769aa',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '1.4px',
                  }}
                >
                  TRACEABLE PROCUREMENT SIGNALS
                </div>

                <h2
                  style={{
                    margin: '6px 0 0',
                    color: '#18232d',
                    fontSize: '18px',
                  }}
                >
                  Evidence records
                </h2>
              </div>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search evidence..."
                style={{
                  width: '250px',
                  height: '36px',
                  border: '1px solid #dce2e6',
                  borderRadius: '5px',
                  padding: '0 12px',
                  outline: 'none',
                  color: '#18232d',
                  background: '#fafbfc',
                  fontSize: '11px',
                }}
              />
            </div>

            {/* ERROR */}
            {error && (
              <div
                style={{
                  margin: '18px 22px',
                  padding: '14px 16px',
                  border: '1px solid #f0d1d1',
                  borderRadius: '5px',
                  background: '#faecec',
                  color: '#9c3838',
                  fontSize: '11px',
                }}
              >
                {error}
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: '#84919a',
                  fontSize: '12px',
                }}
              >
                Loading analyzed procurement evidence...
              </div>
            )}

            {/* NO RESULTS */}
            {!loading &&
              !error &&
              filteredEvidence.length === 0 && (
                <div
                  style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: '#1769aa',
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '1.5px',
                      marginBottom: '9px',
                    }}
                  >
                    EVIDENCE VIEW
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      color: '#18232d',
                      fontSize: '20px',
                    }}
                  >
                    No evidence matches your search
                  </h3>

                  <p
                    style={{
                      margin: '8px 0 0',
                      color: '#84919a',
                      fontSize: '11px',
                    }}
                  >
                    Try a different tender ID, department,
                    location, or signal.
                  </p>
                </div>
              )}

            {/* EVIDENCE LIST */}
            {!loading &&
              filteredEvidence.length > 0 && (
                <div>
                  {visibleEvidence.map((record) => (
                    <div
                      key={record.id}
                      style={{
                        padding: '17px 22px',
                        borderBottom:
                          '1px solid #e9edef',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '18px',
                      }}
                    >
                      {/* TYPE */}
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          flexShrink: 0,
                          border:
                            '1px solid #cbdde9',
                          borderRadius: '5px',
                          background: '#f1f7fb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1769aa',
                          fontSize: '8px',
                          fontWeight: 800,
                          letterSpacing: '0.5px',
                        }}
                      >
                        {record.signalName ===
                        'High bid similarity'
                          ? 'BID'
                          : record.signalName ===
                              'Price deviation'
                            ? 'VAL'
                            : record.signalName ===
                                'Repeated participation pattern'
                              ? 'PAT'
                              : record.signalName ===
                                  'Strong network relationship'
                                ? 'NET'
                                : record.signalName ===
                                    'High vendor win concentration'
                                  ? 'WIN'
                                  : 'SIG'}
                      </div>

                      {/* MAIN INFO */}
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <strong
                            style={{
                              color: '#18232d',
                              fontSize: '12px',
                            }}
                          >
                            {record.signalName}
                          </strong>

                          <span
                            style={{
                              color: '#1769aa',
                              fontSize: '9px',
                              fontWeight: 700,
                            }}
                          >
                            {record.tenderId}
                          </span>
                        </div>

                        <div
                          style={{
                            marginTop: '5px',
                            color: '#84919a',
                            fontSize: '10px',
                          }}
                        >
                          {record.department || 'Department unavailable'}
                          {' • '}
                          {record.category || 'Category unavailable'}
                          {' • '}
                          {record.location || 'Location unavailable'}
                        </div>

                        <div
                          style={{
                            marginTop: '6px',
                            color: '#5f6d77',
                            fontSize: '10px',
                          }}
                        >
                          {record.description}
                        </div>
                      </div>

                      {/* VALUE */}
                      <div
                        style={{
                          width: '120px',
                          textAlign: 'right',
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            color: '#84919a',
                            fontSize: '8px',
                            fontWeight: 700,
                            letterSpacing: '0.8px',
                          }}
                        >
                          OBSERVED VALUE
                        </div>

                        <strong
                          style={{
                            display: 'block',
                            marginTop: '5px',
                            color: '#18232d',
                            fontSize: '13px',
                          }}
                        >
                          {formatEvidenceValue(
                            record.signalName,
                            record.value,
                            record.unit
                          )}
                        </strong>

                        <span
                          style={{
                            display: 'block',
                            marginTop: '3px',
                            color: '#aeb8be',
                            fontSize: '8px',
                          }}
                        >
                          {record.field}
                        </span>
                      </div>

                      {/* PRIORITY */}
                      <div
                        style={{
                          width: '68px',
                          textAlign: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '5px 8px',
                            borderRadius: '4px',
                            fontSize: '8px',
                            fontWeight: 800,
                            letterSpacing: '0.4px',
                            color:
                              record.signalPriority ===
                              'High'
                                ? '#b43d3d'
                                : record.signalPriority ===
                                    'Medium'
                                  ? '#a4761c'
                                  : '#3f7d62',
                            background:
                              record.signalPriority ===
                              'High'
                                ? '#faecec'
                                : record.signalPriority ===
                                    'Medium'
                                  ? '#fbf4e2'
                                  : '#eaf4ef',
                          }}
                        >
                          {record.signalPriority}
                        </span>

                        <div
                          style={{
                            marginTop: '5px',
                            color: '#84919a',
                            fontSize: '8px',
                          }}
                        >
                          Score {record.score.toFixed(2)}
                        </div>
                      </div>

                      {/* CASE BUTTON */}
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenCase(record.tenderId)
                        }
                        style={{
                          border: '1px solid #cbd6dd',
                          background: '#ffffff',
                          color: '#1769aa',
                          borderRadius: '4px',
                          padding: '8px 10px',
                          fontSize: '9px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        VIEW CASE →
                      </button>
                    </div>
                  ))}
                </div>
              )}

            {/* LOAD MORE */}
            {!loading &&
              visibleCount < filteredEvidence.length && (
                <div
                  style={{
                    padding: '18px',
                    textAlign: 'center',
                    borderTop: '1px solid #e9edef',
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount(
                        (current) => current + 20
                      )
                    }
                    style={{
                      border: '1px solid #cbd6dd',
                      background: '#ffffff',
                      color: '#1769aa',
                      borderRadius: '4px',
                      padding: '9px 18px',
                      fontSize: '9px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    LOAD MORE EVIDENCE
                  </button>
                </div>
              )}

            {/* FOOTNOTE */}
            {!loading &&
              evidenceRecords.length > 0 && (
                <div
                  style={{
                    padding: '13px 22px',
                    background: '#fafbfc',
                    borderTop: '1px solid #e9edef',
                    color: '#84919a',
                    fontSize: '9px',
                    lineHeight: 1.5,
                  }}
                >
                  Evidence shown here is derived from the
                  analyzed procurement records and model
                  signals. An observed signal is not, by
                  itself, a finding of misconduct.
                </div>
              )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Evidence