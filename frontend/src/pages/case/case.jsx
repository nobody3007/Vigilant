import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './case.css'

function Case() {
  const navigate = useNavigate()
  const { caseId } = useParams()

  const tenderId = caseId?.replace(/^INV-/, '')

  const [tender, setTender] = useState(null)
  const [evidence, setEvidence] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    let cancelled = false

    async function loadCase() {
      try {
        setLoading(true)
        setError('')

        const [tenderResponse, evidenceResponse] =
          await Promise.all([
            fetch(
              `http://127.0.0.1:8000/api/tenders/${tenderId}`
            ),
            fetch(
              `http://127.0.0.1:8000/api/tenders/${tenderId}/evidence`
            ),
          ])

        if (!tenderResponse.ok) {
          throw new Error('Tender not found')
        }

        const tenderData = await tenderResponse.json()

        let evidenceData = null

        if (evidenceResponse.ok) {
          evidenceData = await evidenceResponse.json()
        }

        if (!cancelled) {
          setTender(tenderData)
          setEvidence(evidenceData)
        }
      } catch (err) {
        console.error(err)

        if (!cancelled) {
          setError('Unable to load this investigation.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (tenderId) {
      loadCase()
    } else {
      setLoading(false)
      setError('Invalid investigation ID.')
    }

    return () => {
      cancelled = true
    }
  }, [tenderId])

  const score = Number(
    tender?.investigation_priority || 0
  )

  const priority =
    tender?.priority ||
    (
      score >= 75
        ? 'High'
        : score >= 50
          ? 'Medium'
          : 'Low'
    )

  const signals = useMemo(() => {
    if (!tender?.signals) return []

    return tender.signals.map((signal) => {
      if (typeof signal === 'string') {
        return {
          name: signal,
          description:
            'Derived procurement signal requiring investigator review.',
        }
      }

      return {
        name: signal.name || 'Procurement signal',
        description:
          signal.description ||
          signal.reason ||
          'Derived procurement signal requiring investigator review.',
      }
    })
  }, [tender])

  const evidenceItems = useMemo(() => {
    if (!evidence) return []

    if (Array.isArray(evidence)) {
      return evidence
    }

    if (Array.isArray(evidence.evidence)) {
      return evidence.evidence
    }

    if (Array.isArray(evidence.items)) {
      return evidence.items
    }

    if (Array.isArray(evidence.chain)) {
      return evidence.chain
    }

    return []
  }, [evidence])

  if (loading) {
    return (
      <div className="case-page">
        <div className="case-content">
          <div className="tab-content">
            Loading investigation...
          </div>
        </div>
      </div>
    )
  }

  if (error || !tender) {
    return (
      <div className="case-page">

        <header className="case-topbar">
          <div className="case-breadcrumb">
            <button
              className="back-button"
              onClick={() => navigate('/investigations')}
            >
              ?
            </button>

            <span className="breadcrumb-muted">
              INVESTIGATIONS
            </span>

            <span className="breadcrumb-separator">
              /
            </span>

            <strong>{caseId}</strong>
          </div>
        </header>

        <main className="case-content">
          <div className="tab-content">
            <div className="tab-title">
              <span>ERROR</span>
              <div>
                <h2>Case not found</h2>
                <p>
                  {error || 'This investigation could not be loaded.'}
                </p>
              </div>
            </div>

            <button
              className="dashboard-return"
              onClick={() => navigate('/investigations')}
            >
              ? Back to investigations
            </button>
          </div>
        </main>

      </div>
    )
  }

  const contractValue = Number(
    tender.contractValue || 0
  )

  const estimatedValue = Number(
    tender.estimatedValue || 0
  )

  const numberOfBidders =
    tender.numberOfBidders ?? '&mdash;'

  const vendor =
    tender.winningVendor || 'Unknown vendor'

  const department =
    tender.department || 'Unknown department'

  const category =
    tender.category || 'Unknown category'

  const location =
    tender.location || 'Unknown location'

  return (
    <div className="case-page">

      {/* TOP BAR */}
      <header className="case-topbar">

        <div className="case-breadcrumb">

          <button
            className="back-button"
            onClick={() => navigate('/investigations')}
          >
            ?
          </button>

          <span className="breadcrumb-muted">
            INVESTIGATIONS
          </span>

          <span className="breadcrumb-separator">
            /
          </span>

          <strong>{caseId}</strong>

        </div>

        <div className="case-top-actions">

          <span className="system-status">
            <span className="status-dot" />
            LIVE INVESTIGATION
          </span>

          <button
            className="dashboard-return"
            onClick={() => navigate('/investigations')}
          >
            All investigations
          </button>

        </div>

      </header>

      <main className="case-content">

        {/* CASE HEADER */}
        <section className="case-header">

          <div className="case-header-left">

            <div className="case-id-row">

              <span className="case-id">
                {caseId}
              </span>

              <span className="case-status">
                {priority.toUpperCase()} PRIORITY
              </span>

            </div>

            <h1>
              Tender {tender.tenderId}
            </h1>

            <p className="case-subtitle">
              {department}
              {' &middot; '}
              {category}
              {' &middot; '}
              {location}
            </p>

            <div className="case-meta">

              <div>
                <span className="meta-label">
                  WINNING VENDOR
                </span>
                <strong>{vendor}</strong>
              </div>

              <div>
                <span className="meta-label">
                  ESTIMATED VALUE
                </span>
                <strong>
                  ?{estimatedValue.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span className="meta-label">
                  CONTRACT VALUE
                </span>
                <strong>
                  ?{contractValue.toLocaleString('en-IN')}
                </strong>
              </div>

              <div>
                <span className="meta-label">
                  BIDDERS
                </span>
                <strong>
                  {numberOfBidders}
                </strong>
              </div>

            </div>

          </div>

          {/* PRIORITY */}
          <div className="priority-box">

            <span className="priority-label">
              INVESTIGATION PRIORITY
            </span>

            <div className="priority-score">
              <strong>
                {score.toFixed(1)}
              </strong>

              <span>/100</span>
            </div>

            <div className="priority-level">
              {priority.toUpperCase()}
            </div>

            <div className="priority-bar">
              <div
                className="priority-fill"
                style={{
                  width: `${Math.min(score, 100)}%`,
                }}
              />
            </div>

          </div>

        </section>

        {/* TABS */}
        <div className="case-tabs">

          <button
            className={
              activeTab === 'overview'
                ? 'active'
                : ''
            }
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>

          <button
            className={
              activeTab === 'signals'
                ? 'active'
                : ''
            }
            onClick={() => setActiveTab('signals')}
          >
            Signals
          </button>

          <button
            className={
              activeTab === 'evidence'
                ? 'active'
                : ''
            }
            onClick={() => setActiveTab('evidence')}
          >
            Evidence
          </button>

          <button
            onClick={() => navigate('/network')}
          >
            Relationship network
          </button>

        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>

            <section>

              <div className="section-heading">

                <div>
                  <span className="section-number">
                    01
                  </span>

                  <h2>
                    Why was this flagged?
                  </h2>
                </div>

                <span className="section-caption">
                  DERIVED SIGNALS
                </span>

              </div>

              <div className="flagged-grid">

                <div className="flagged-main">

                  <p className="explanation">
                    This investigation was prioritized because
                    multiple procurement signals were detected
                    in the available tender data. The signals
                    indicate activity that may deserve closer
                    investigator review.
                  </p>

                  <div className="signal-list">

                    {signals.length > 0 ? (
                      signals.map((signal, index) => (
                        <div
                          className="signal-row"
                          key={`${signal.name}-${index}`}
                        >

                          <div className="signal-number">
                            {String(index + 1).padStart(2, '0')}
                          </div>

                          <div className="signal-content">

                            <div className="signal-title-row">
                              <h3>
                                {signal.name}
                              </h3>
                            </div>

                            <p>
                              {signal.description}
                            </p>

                          </div>

                        </div>
                      ))
                    ) : (
                      <div className="signal-row">

                        <div className="signal-number">
                          01
                        </div>

                        <div className="signal-content">

                          <div className="signal-title-row">
                            <h3>
                              No major derived signal
                            </h3>
                          </div>

                          <p>
                            No specific derived signal was
                            returned for this tender.
                          </p>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

                <div className="interpretation-card">

                  <span className="interpretation-label">
                    INTERPRETATION
                  </span>

                  <h3>
                    Context matters.
                  </h3>

                  <p>
                    An unusual procurement pattern is not
                    automatically evidence of wrongdoing.
                    Vigilant combines multiple signals to help
                    investigators decide which cases deserve
                    closer examination.
                  </p>

                  <div className="interpretation-divider" />

                  <span className="interpretation-note">
                    SCORE = INVESTIGATION PRIORITY,
                    NOT PROBABILITY OF GUILT
                  </span>

                </div>

              </div>

            </section>

            {/* RELATED ENTITIES */}
            <section>

              <div className="section-heading">

                <div>
                  <span className="section-number">
                    02
                  </span>

                  <h2>
                    Related entities
                  </h2>
                </div>

                <span className="section-caption">
                  RELATIONSHIP CONTEXT
                </span>

              </div>

              <div className="entity-grid">

                <div className="entity-card primary-entity">

                  <span className="entity-type">
                    VENDOR
                  </span>

                  <h3>
                    {vendor}
                  </h3>

                  <p>
                    Winning vendor
                  </p>

                  <div className="entity-detail">

                    <span>
                      Vendor ID
                    </span>

                    <strong>
                      {tender.winningVendorId || '&mdash;'}
                    </strong>

                  </div>

                </div>

                <div className="entity-connector">
                  ?
                </div>

                <div className="entity-card">

                  <span className="entity-type">
                    TENDER
                  </span>

                  <h3>
                    {tender.tenderId}
                  </h3>

                  <p>
                    Procurement record
                  </p>

                  <div className="entity-detail">

                    <span>
                      Category
                    </span>

                    <strong>
                      {category}
                    </strong>

                  </div>

                </div>

                <div className="entity-connector">
                  ?
                </div>

                <div className="entity-card">

                  <span className="entity-type">
                    DEPARTMENT
                  </span>

                  <h3>
                    {department}
                  </h3>

                  <p>
                    Procuring authority
                  </p>

                  <div className="entity-detail">

                    <span>
                      Location
                    </span>

                    <strong>
                      {location}
                    </strong>

                  </div>

                </div>

              </div>

              <button
                className="open-network-button"
                onClick={() => navigate('/network')}
              >
                Open relationship graph ?
              </button>

            </section>

            {/* STATUS */}
            <section>

              <div className="status-card">

                <div>

                  <span className="status-label">
                    INVESTIGATION STATUS
                  </span>

                  <h3>
                    Requires investigator review
                  </h3>

                  <p>
                    Vigilant identifies signals for review;
                    final decisions remain with investigators.
                  </p>

                </div>

                <div className="status-actions">

                  <button
                    className="secondary-action"
                    onClick={() =>
                      setActiveTab('evidence')
                    }
                  >
                    View evidence
                  </button>

                  <button
                    className="primary-action"
                    onClick={() =>
                      navigate('/network')
                    }
                  >
                    Explore network
                  </button>

                </div>

              </div>

            </section>

          </>
        )}

        {/* SIGNALS */}
        {activeTab === 'signals' && (
          <section>

            <div className="section-heading">

              <div>
                <span className="section-number">
                  01
                </span>

                <h2>
                  Investigation signals
                </h2>
              </div>

              <span className="section-caption">
                WHY WAS THIS FLAGGED?
              </span>

            </div>

            <div className="tab-content">

              <div className="signal-list">

                {signals.map((signal, index) => (
                  <div
                    className="signal-row"
                    key={`${signal.name}-detail-${index}`}
                  >

                    <div className="signal-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="signal-content">

                      <div className="signal-title-row">
                        <h3>
                          {signal.name}
                        </h3>
                      </div>

                      <p>
                        {signal.description}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </div>

          </section>
        )}

        {/* EVIDENCE */}
        {activeTab === 'evidence' && (
          <section>

            <div className="section-heading">

              <div>
                <span className="section-number">
                  01
                </span>

                <h2>
                  Evidence
                </h2>
              </div>

              <span className="section-caption">
                TRACEABLE EVIDENCE
              </span>

            </div>

            <div className="tab-content">

              {evidenceItems.length > 0 ? (

                <div className="evidence-full-list">

                  {evidenceItems.map((item, index) => {

                    const label =
                      item.label ||
                      item.type ||
                      'Evidence'

                    const title =
                      item.title ||
                      item.name ||
                      'Derived evidence'

                    const value =
                      item.value ||
                      item.detail ||
                      'Available in analysis record'

                    const detail =
                      item.description ||
                      item.reason ||
                      ''

                    return (
                      <div
                        className="evidence-full-card"
                        key={`${label}-${index}`}
                      >

                        <div className="evidence-index">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className="evidence-full-content">

                          <span>
                            {label}
                          </span>

                          <h3>
                            {title}
                          </h3>

                          <strong>
                            {String(value)}
                          </strong>

                          {detail && (
                            <p>
                              {String(detail)}
                            </p>
                          )}

                        </div>

                        <div className="evidence-full-score">
                          &mdash;
                        </div>

                      </div>
                    )
                  })}

                </div>

              ) : (

                <div className="tab-title">

                  <span>
                    INFO
                  </span>

                  <div>
                    <h2>
                      Evidence data
                    </h2>

                    <p>
                      No structured evidence items were
                      returned for this tender.
                    </p>
                  </div>

                </div>

              )}

            </div>

          </section>
        )}

        <div className="status-card">

          <div>

            <span className="status-label">
              VIGILANT PRINCIPLE
            </span>

            <h3>
              Investigation support, not automated accusations.
            </h3>

            <p>
              Signals identify activity that deserves closer
              review. They do not establish wrongdoing.
            </p>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Case

