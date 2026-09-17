import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

import './evidence.css'

function Evidence() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const requestedTenderId = searchParams.get('tender')

  const [tenders, setTenders] = useState([])
  const [selectedId, setSelectedId] = useState(
    requestedTenderId || ''
  )

  const [selectedTender, setSelectedTender] = useState(null)
  const [evidenceData, setEvidenceData] = useState(null)

  const [loadingTenders, setLoadingTenders] = useState(true)
  const [loadingEvidence, setLoadingEvidence] = useState(false)

  useEffect(() => {
    fetch(
      'https://vigilant-6sc2.vercel.app/api/tenders?limit=20'
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            'Unable to load procurement records'
          )
        }

        return response.json()
      })
      .then((data) => {
        const records = Array.isArray(data)
          ? data
          : []

        setTenders(records)

        if (requestedTenderId) {
          const requested = records.find(
            (item) =>
              item.tenderId === requestedTenderId
          )

          if (requested) {
            setSelectedId(requestedTenderId)
          } else if (records.length > 0) {
            setSelectedId(records[0].tenderId)
          }
        } else if (records.length > 0) {
          setSelectedId(records[0].tenderId)
        }
      })
      .catch((error) => {
        console.error(
          'Evidence records error:',
          error
        )

        setTenders([])
      })
      .finally(() => {
        setLoadingTenders(false)
      })
  }, [requestedTenderId])

  useEffect(() => {
    if (!selectedId) {
      setSelectedTender(null)
      setEvidenceData(null)
      return
    }

    const tender =
      tenders.find(
        (item) =>
          item.tenderId === selectedId
      ) || null

    setSelectedTender(tender)

    const loadEvidence = async () => {
      setLoadingEvidence(true)

      try {
        const response = await fetch(
          `https://vigilant-6sc2.vercel.app/api/tenders/${encodeURIComponent(
            selectedId
          )}/evidence`
        )

        if (!response.ok) {
          throw new Error(
            'Unable to load evidence'
          )
        }

        const data = await response.json()

        setEvidenceData(data)
      } catch (error) {
        console.error(
          'Evidence API error:',
          error
        )

        setEvidenceData(null)
      } finally {
        setLoadingEvidence(false)
      }
    }

    loadEvidence()
  }, [selectedId, tenders])

  const score = Number(
    selectedTender?.investigation_priority || 0
  )

  const priority =
    score >= 75
      ? 'HIGH'
      : score >= 50
        ? 'MEDIUM'
        : 'LOW'

  const formatCurrency = (value) => {
    const number = Number(value || 0)

    if (number >= 10000000) {
      return `?${(
        number / 10000000
      ).toFixed(2)} Cr`
    }

    if (number >= 100000) {
      return `?${(
        number / 100000
      ).toFixed(2)} L`
    }

    return `?${number.toLocaleString('en-IN')}`
  }

  const getEvidenceItems = () => {
    if (!evidenceData) return []

    if (Array.isArray(evidenceData)) {
      return evidenceData
    }

    if (Array.isArray(evidenceData.evidence)) {
      return evidenceData.evidence
    }

    if (
      Array.isArray(
        evidenceData.evidenceChain
      )
    ) {
      return evidenceData.evidenceChain
    }

    if (Array.isArray(evidenceData.items)) {
      return evidenceData.items
    }

    return []
  }

  const evidenceItems = getEvidenceItems()

  const fallbackEvidence =
    selectedTender
      ? [
          {
            label: 'RAW PROCUREMENT DATA',
            title: 'Contract value',
            value: formatCurrency(
              selectedTender.contractValue
            ),
            detail: `Estimated value: ${formatCurrency(
              selectedTender.estimatedValue
            )}. Observed contract value: ${formatCurrency(
              selectedTender.contractValue
            )}.`,
          },
          {
            label: 'PARTICIPATION DATA',
            title: 'Bidder participation',
            value: `${
              selectedTender.numberOfBidders || 0
            } bidders`,
            detail:
              'Number of bidders recorded for this procurement event.',
          },
          {
            label: 'VENDOR CONTEXT',
            title: 'Winning vendor',
            value:
              selectedTender.winningVendor ||
              'Not provided',
            detail: `Specialization: ${
              selectedTender.vendorSpecialization ||
              'Not provided'
            }.`,
          },
        ]
      : []

  const displayEvidence =
    evidenceItems.length > 0
      ? evidenceItems.map(
          (item, index) => ({
            number: String(
              index + 1
            ).padStart(2, '0'),

            label:
              item.label ||
              item.type ||
              'EVIDENCE',

            title:
              item.title ||
              item.name ||
              'Procurement evidence',

            value:
              item.value ??
              item.observation ??
              item.raw_value ??
              'Available',

            detail:
              item.detail ||
              item.description ||
              item.explanation ||
              'Evidence associated with this investigation.',

            score:
              item.score ||
              item.contribution ||
              '',
          })
        )
      : fallbackEvidence.map(
          (item, index) => ({
            ...item,
            number: String(
              index + 1
            ).padStart(2, '0'),
          })
        )

  if (loadingTenders) {
    return (
      <div className="evidence-page">

        <Sidebar />

        <main className="evidence-main">

          <Topbar
            activePage="evidence"
            onAddTender={() =>
              navigate('/add-tender')
            }
          />

          <div className="evidence-loading">
            Loading evidence repository...
          </div>

        </main>

      </div>
    )
  }

  if (!selectedTender) {
    return (
      <div className="evidence-page">

        <Sidebar />

        <main className="evidence-main">

          <Topbar
            activePage="evidence"
            onAddTender={() =>
              navigate('/add-tender')
            }
          />

          <div className="evidence-empty">

            <span className="evidence-eyebrow">
              EVIDENCE VIEW
            </span>

            <h1>
              No procurement evidence
            </h1>

            <p>
              No analyzed procurement records are
              currently available.
            </p>

            

          </div>

        </main>

      </div>
    )
  }

  return (
    <div className="evidence-page">

      <Sidebar />

      <main className="evidence-main">

        <Topbar
          activePage="evidence"
          onAddTender={() =>
            navigate('/add-tender')
          }
        />

        <div className="evidence-body">

          <header className="evidence-page-header">

            <div>

              <span className="evidence-eyebrow">
                VIGILANT / EVIDENCE
              </span>

              <h1>
                Evidence Repository
              </h1>

              <p>
                Trace investigation signals back to
                the underlying procurement evidence.
              </p>

            </div>

            <div className="evidence-live">
              <span />
              LIVE DATA
            </div>

          </header>

          <section className="evidence-selector">

            <div>

              <span className="section-label">
                SELECT RECORD
              </span>

              <h2>
                Investigation evidence
              </h2>

              <p>
                Select a procurement record to inspect
                its underlying evidence and derived
                signals.
              </p>

            </div>

            <select
              value={selectedTender.tenderId}
              onChange={(event) =>
                setSelectedId(
                  event.target.value
                )
              }
            >

              {tenders.map((tender) => (
                <option
                  key={tender.tenderId}
                  value={tender.tenderId}
                >
                  {tender.tenderId} &mdash;{' '}
                  {tender.winningVendor}
                </option>
              ))}

            </select>

          </section>

          <section className="evidence-case">

            <div className="evidence-case-main">

              <div className="case-kicker">
                SELECTED TENDER
              </div>

              <div className="case-title-row">

                <div>

                  <h2>
                    {selectedTender.tenderId}
                  </h2>

                  <p>
                    {selectedTender.category}
                    {' &middot; '}
                    {selectedTender.department}
                    {' &middot; '}
                    {selectedTender.location}
                  </p>

                </div>

                <div className="score-box">

                  <span>
                    INVESTIGATION PRIORITY
                  </span>

                  <strong>
                    {score.toFixed(1)}
                    <small>/100</small>
                  </strong>

                  <em
                    className={priority.toLowerCase()}
                  >
                    {priority}
                  </em>

                </div>

              </div>

            </div>

            <div className="case-action">

              <button
                onClick={() =>
                  navigate(
                    `/case/INV-${selectedTender.tenderId}`
                  )
                }
              >
                View investigation ?
              </button>

            </div>

          </section>

          <section className="evidence-section">

            <div className="section-header">

              <div>

                <span>01</span>

                <div>

                  <h2>
                    Underlying procurement record
                  </h2>

                  <p>
                    The source fields used by the
                    analysis pipeline.
                  </p>

                </div>

              </div>

              <small>
                RAW EVIDENCE
              </small>

            </div>

            <div className="raw-grid">

              <div>
                <span>TENDER ID</span>
                <strong>
                  {selectedTender.tenderId}
                </strong>
              </div>

              <div>
                <span>DEPARTMENT</span>
                <strong>
                  {selectedTender.department}
                </strong>
              </div>

              <div>
                <span>CATEGORY</span>
                <strong>
                  {selectedTender.category}
                </strong>
              </div>

              <div>
                <span>LOCATION</span>
                <strong>
                  {selectedTender.location}
                </strong>
              </div>

              <div>
                <span>WINNING VENDOR</span>
                <strong>
                  {selectedTender.winningVendor}
                </strong>
              </div>

              <div>
                <span>VENDOR SPECIALIZATION</span>
                <strong>
                  {selectedTender.vendorSpecialization}
                </strong>
              </div>

              <div>
                <span>ESTIMATED VALUE</span>
                <strong>
                  {formatCurrency(
                    selectedTender.estimatedValue
                  )}
                </strong>
              </div>

              <div>
                <span>CONTRACT VALUE</span>
                <strong>
                  {formatCurrency(
                    selectedTender.contractValue
                  )}
                </strong>
              </div>

              <div>
                <span>NUMBER OF BIDDERS</span>
                <strong>
                  {selectedTender.numberOfBidders}
                </strong>
              </div>

            </div>

          </section>

          <section className="evidence-section">

            <div className="section-header">

              <div>

                <span>02</span>

                <div>

                  <h2>
                    Evidence chain
                  </h2>

                  <p>
                    Raw evidence ? derived signal ?
                    investigation context.
                  </p>

                </div>

              </div>

              <small>
                TRACEABLE SIGNALS
              </small>

            </div>

            {loadingEvidence ? (

              <div className="evidence-loading">
                Loading investigation evidence...
              </div>

            ) : (

              <div className="evidence-chain">

                {displayEvidence.map(
                  (item) => (
                    <article
                      className="evidence-card"
                      key={item.number}
                    >

                      <div className="evidence-card-top">

                        <span>
                          {item.number}
                        </span>

                        <span>
                          {item.label}
                        </span>

                      </div>

                      <h3>
                        {item.title}
                      </h3>

                      <strong>
                        {String(item.value)}
                      </strong>

                      <p>
                        {item.detail}
                      </p>

                      {item.score && (
                        <div
                          style={{
                            marginTop: '12px',
                            fontWeight: 700,
                          }}
                        >
                          Contribution:{' '}
                          {String(
                            item.score
                          ).startsWith('+')
                            ? item.score
                            : `+${item.score}`}
                        </div>
                      )}

                    </article>
                  )
                )}

              </div>

            )}

          </section>

          <section className="interpretation">

            <div className="interpretation-main">

              <span>
                03 &middot; INVESTIGATOR INTERPRETATION
              </span>

              <h2>
                Investigation Priority:{' '}
                {score.toFixed(1)}/100
              </h2>

              <p>
                This score indicates how valuable the
                record may be for further investigator
                review. It is not a finding of wrongdoing
                or a probability of guilt.
              </p>

            </div>

            <div className="interpretation-side">

              <div>

                <span>PRIORITY</span>

                <strong
                  className={priority.toLowerCase()}
                >
                  {priority}
                </strong>

              </div>

              <div>

                <span>CONTRACT VALUE</span>

                <strong>
                  {formatCurrency(
                    selectedTender.contractValue
                  )}
                </strong>

              </div>

            </div>

          </section>

          <section className="evidence-section">

            <div className="section-header">

              <div>

                <span>04</span>

                <div>

                  <h2>
                    Other analyzed records
                  </h2>

                  <p>
                    Select another procurement record
                    from the current analysis queue.
                  </p>

                </div>

              </div>

              <small>
                {tenders.length} RECORDS
              </small>

            </div>

            <div className="record-list">

              {tenders
                .filter(
                  (tender) =>
                    tender.tenderId !==
                    selectedTender.tenderId
                )
                .slice(0, 6)
                .map((tender) => {

                  const tenderScore =
                    Number(
                      tender.investigation_priority ||
                        0
                    )

                  const tenderPriority =
                    tenderScore >= 75
                      ? 'HIGH'
                      : tenderScore >= 50
                        ? 'MEDIUM'
                        : 'LOW'

                  return (
                    <button
                      className="record-row"
                      key={tender.tenderId}
                      onClick={() =>
                        setSelectedId(
                          tender.tenderId
                        )
                      }
                    >

                      <div>

                        <strong>
                          {tender.tenderId}
                        </strong>

                        <span>
                          {tender.category}
                        </span>

                      </div>

                      <div>

                        <span>
                          {tender.winningVendor}
                        </span>

                      </div>

                      <div>

                        <strong>
                          {tenderScore.toFixed(1)}
                        </strong>

                        <small
                          className={tenderPriority.toLowerCase()}
                        >
                          {tenderPriority}
                        </small>

                      </div>

                    </button>
                  )
                })}

            </div>

          </section>

          <div className="evidence-disclaimer">

            <div className="disclaimer-icon">
              i
            </div>

            <div>

              <strong>
                Evidence supports investigation &mdash; it
                does not establish wrongdoing.
              </strong>

              <p>
                A procurement record can be unusual for
                legitimate reasons. Investigators should
                evaluate multiple signals and surrounding
                context before drawing conclusions.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Evidence






