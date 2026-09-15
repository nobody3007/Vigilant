import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { cases } from '../../data/mockData'

import './case.css'

function Case() {
  const navigate = useNavigate()
  const { caseId } = useParams()

  const [activeTab, setActiveTab] = useState('overview')

  const caseData = cases.find(
    (item) => item.id === caseId
  )

  if (!caseData) {
    return (
      <div className="case-page">
        <header className="case-topbar">

          <div className="case-breadcrumb">
            <button
              className="back-button"
              onClick={() => navigate('/investigations')}
            >
              ←
            </button>

            <div>
              <span className="breadcrumb-muted">
                INVESTIGATIONS
              </span>

              <span className="breadcrumb-separator">
                /
              </span>

              <span>
                CASE NOT FOUND
              </span>
            </div>
          </div>

          <button
            className="dashboard-return"
            onClick={() => navigate('/investigations')}
          >
            Back to investigations
          </button>

        </header>

        <main className="case-content">
          <section className="tab-content">

            <div className="tab-title">
              <span>!</span>

              <div>
                <h2>Investigation not found</h2>

                <p>
                  The requested investigation does not exist
                  in the current dataset.
                </p>
              </div>
            </div>

          </section>
        </main>
      </div>
    )
  }

  /*
   * The current mock dataset only contains the basic case fields.
   * These additional details are temporary prototype content.
   * They will later come from the backend / investigation engine.
   */

  const caseDetails = {
    'INV-0241': {
      vendor: 'Apex Infrastructure Ltd.',
      tender: 'TDR-10842',
      title: 'Repeated Award Pattern',
      explanation:
        'This case was prioritized because multiple independent signals occur together around the same vendor and tender activity.',
      signals: [
        {
          number: '01',
          title: 'Repeated award pattern',
          description: 'Same vendor won 7 of 11 comparable tenders.',
          score: '+32',
          type: 'high',
        },
        {
          number: '02',
          title: 'Unusual participation',
          description:
            'Related vendors appeared repeatedly across the same tender group.',
          score: '+24',
          type: 'medium',
        },
        {
          number: '03',
          title: 'Price deviation',
          description:
            'Award value was 16.8% above the peer median.',
          score: '+18',
          type: 'medium',
        },
        {
          number: '04',
          title: 'Vendor concentration',
          description:
            'Award activity is concentrated among a small vendor group.',
          score: '+13',
          type: 'low',
        },
      ],
      evidence: [
        {
          label: 'RAW EVIDENCE',
          title: 'Award history',
          value: '7 awards / 11 tenders',
          detail:
            'Vendor won 63.6% of comparable tenders.',
          score: '+32',
        },
        {
          label: 'DERIVED SIGNAL',
          title: 'Repeated award pattern',
          value: 'High deviation',
          detail:
            'Award frequency is significantly above comparable vendors.',
          score: '+32',
        },
        {
          label: 'PRIORITY CONTRIBUTION',
          title: 'Investigation priority',
          value: '32 points',
          detail:
            'Largest individual contribution to the case score.',
          score: '+32',
        },
      ],
      entities: [
        {
          type: 'VENDOR',
          name: 'Apex Infrastructure Ltd.',
          id: 'VND-00482',
          detailLabel: 'Awards',
          detailValue: '7',
        },
        {
          type: 'TENDER',
          name: 'Road Infrastructure Package',
          id: 'TDR-10842',
          detailLabel: 'Department',
          detailValue: 'Public Works',
        },
        {
          type: 'DEPARTMENT',
          name: 'Public Works',
          id: 'DEPT-014',
          detailLabel: 'Location',
          detailValue: 'Central Region',
        },
      ],
      contextTitle:
        'Specialist vendors may naturally win more tenders.',
      contextDescription:
        'Apex Infrastructure Ltd. may have a genuine specialization in road infrastructure. An investigator should compare the vendor against similarly specialized suppliers before treating the award concentration as unusual.',
    },

    'INV-0238': {
      vendor: 'MedCore Equipment Pvt. Ltd.',
      tender: 'TDR-10837',
      title: 'Unusual Bid Pricing',
      explanation:
        'This case was prioritized because the observed award pricing differs materially from comparable procurement activity.',
      signals: [
        {
          number: '01',
          title: 'Unusual bid pricing',
          description:
            'Award pricing deviates significantly from comparable tenders.',
          score: '+34',
          type: 'high',
        },
        {
          number: '02',
          title: 'Price deviation',
          description:
            'Final contract value is above the observed peer range.',
          score: '+25',
          type: 'medium',
        },
        {
          number: '03',
          title: 'Participation pattern',
          description:
            'Participation differs from comparable procurement activity.',
          score: '+12',
          type: 'medium',
        },
        {
          number: '04',
          title: 'Vendor concentration',
          description:
            'Award activity shows concentration within a limited vendor group.',
          score: '+10',
          type: 'low',
        },
      ],
      evidence: [
        {
          label: 'RAW EVIDENCE',
          title: 'Contract pricing',
          value: '₹7.2 Cr',
          detail:
            'Award value differs from comparable procurement records.',
          score: '+34',
        },
        {
          label: 'DERIVED SIGNAL',
          title: 'Unusual bid pricing',
          value: 'High deviation',
          detail:
            'Observed pricing is outside the expected peer pattern.',
          score: '+34',
        },
        {
          label: 'PRIORITY CONTRIBUTION',
          title: 'Investigation priority',
          value: '34 points',
          detail:
            'Largest contribution to the current case score.',
          score: '+34',
        },
      ],
      entities: [
        {
          type: 'VENDOR',
          name: 'MedCore Equipment Pvt. Ltd.',
          id: 'VND-00371',
          detailLabel: 'Awards',
          detailValue: '6',
        },
        {
          type: 'TENDER',
          name: 'Medical Equipment Supply',
          id: 'TDR-10837',
          detailLabel: 'Department',
          detailValue: 'Health Services',
        },
        {
          type: 'DEPARTMENT',
          name: 'Health Services',
          id: 'DEPT-021',
          detailLabel: 'Location',
          detailValue: 'Central Region',
        },
      ],
      contextTitle:
        'Specialized equipment can legitimately command higher prices.',
      contextDescription:
        'Investigators should compare specifications, quantities, warranty requirements and other tender conditions before treating the price deviation as suspicious.',
    },

    'INV-0235': {
      vendor: 'TransitWorks Services',
      tender: 'TDR-10831',
      title: 'Vendor Relationship',
      explanation:
        'This case was prioritized because repeated relationships between participating vendors may warrant contextual review.',
      signals: [
        {
          number: '01',
          title: 'Vendor relationship',
          description:
            'Participating vendors show repeated interaction across tenders.',
          score: '+27',
          type: 'high',
        },
        {
          number: '02',
          title: 'Repeated participation',
          description:
            'The same vendor group appears across multiple procurement events.',
          score: '+19',
          type: 'medium',
        },
        {
          number: '03',
          title: 'Award concentration',
          description:
            'Awards are concentrated within a smaller participant group.',
          score: '+11',
          type: 'medium',
        },
        {
          number: '04',
          title: 'Price pattern',
          description:
            'Observed prices show some deviation from comparable activity.',
          score: '+7',
          type: 'low',
        },
      ],
      evidence: [
        {
          label: 'RAW EVIDENCE',
          title: 'Participation history',
          value: 'Repeated vendor interaction',
          detail:
            'The participating vendor group appears across multiple tenders.',
          score: '+27',
        },
        {
          label: 'DERIVED SIGNAL',
          title: 'Vendor relationship',
          value: 'Moderate relationship',
          detail:
            'Repeated interactions create a relationship signal for review.',
          score: '+27',
        },
        {
          label: 'PRIORITY CONTRIBUTION',
          title: 'Investigation priority',
          value: '27 points',
          detail:
            'Largest individual contribution to the case score.',
          score: '+27',
        },
      ],
      entities: [
        {
          type: 'VENDOR',
          name: 'TransitWorks Services',
          id: 'VND-00294',
          detailLabel: 'Tenders',
          detailValue: '14',
        },
        {
          type: 'TENDER',
          name: 'Fleet Maintenance Services',
          id: 'TDR-10831',
          detailLabel: 'Department',
          detailValue: 'Transport',
        },
        {
          type: 'DEPARTMENT',
          name: 'Transport',
          id: 'DEPT-008',
          detailLabel: 'Location',
          detailValue: 'South Region',
        },
      ],
      contextTitle:
        'Repeated participation can occur in specialized markets.',
      contextDescription:
        'A limited supplier pool or specialized service category can naturally create repeated interactions. Investigators should compare the observed relationship against the broader market.',
    },

    'INV-0231': {
      vendor: 'EduTech Systems',
      tender: 'TDR-10826',
      title: 'Participation Pattern',
      explanation:
        'This case was prioritized because the participation pattern differs from what is normally observed across comparable tenders.',
      signals: [
        {
          number: '01',
          title: 'Participation pattern',
          description:
            'Vendor participation differs from comparable tender groups.',
          score: '+26',
          type: 'high',
        },
        {
          number: '02',
          title: 'Repeated participation',
          description:
            'The vendor appears repeatedly across related procurement events.',
          score: '+17',
          type: 'medium',
        },
        {
          number: '03',
          title: 'Vendor concentration',
          description:
            'Participation is concentrated among a small supplier group.',
          score: '+9',
          type: 'medium',
        },
        {
          number: '04',
          title: 'Award pattern',
          description:
            'Award outcomes show some concentration within the category.',
          score: '+6',
          type: 'low',
        },
      ],
      evidence: [
        {
          label: 'RAW EVIDENCE',
          title: 'Participation history',
          value: 'Repeated participation',
          detail:
            'The vendor appears across related procurement events.',
          score: '+26',
        },
        {
          label: 'DERIVED SIGNAL',
          title: 'Participation pattern',
          value: 'Moderate deviation',
          detail:
            'Observed participation differs from the comparable baseline.',
          score: '+26',
        },
        {
          label: 'PRIORITY CONTRIBUTION',
          title: 'Investigation priority',
          value: '26 points',
          detail:
            'Largest individual contribution to the case score.',
          score: '+26',
        },
      ],
      entities: [
        {
          type: 'VENDOR',
          name: 'EduTech Systems',
          id: 'VND-00183',
          detailLabel: 'Tenders',
          detailValue: '11',
        },
        {
          type: 'TENDER',
          name: 'School Equipment Procurement',
          id: 'TDR-10826',
          detailLabel: 'Department',
          detailValue: 'Education',
        },
        {
          type: 'DEPARTMENT',
          name: 'Education',
          id: 'DEPT-017',
          detailLabel: 'Location',
          detailValue: 'East Region',
        },
      ],
      contextTitle:
        'A small supplier pool can explain participation concentration.',
      contextDescription:
        'Education procurement may involve vendors with specific product capabilities. Investigators should compare the supplier pool and tender requirements before escalating the case.',
    },
  }

  const details = caseDetails[caseData.id] || caseDetails['INV-0241']

  const priorityClass =
    caseData.priority?.toLowerCase() || 'medium'

  return (
    <div className="case-page">

      {/* TOP BAR */}
      <header className="case-topbar">

        <div className="case-breadcrumb">

          <button
            className="back-button"
            onClick={() => navigate('/investigations')}
          >
            ←
          </button>

          <div>
            <span className="breadcrumb-muted">
              INVESTIGATIONS
            </span>

            <span className="breadcrumb-separator">
              /
            </span>

            <span>{caseData.id}</span>
          </div>

        </div>

        <div className="case-top-actions">

          <span className="system-status">
            <span className="status-dot"></span>
            SYSTEM OPERATIONAL
          </span>

          <button
            className="dashboard-return"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

        </div>

      </header>


      <main className="case-content">

        {/* CASE HEADER */}
        <section className="case-header">

          <div className="case-header-left">

            <div className="case-id-row">
              <span className="case-id">
                CASE {caseData.id}
              </span>

              <span className="case-status">
                REQUIRES REVIEW
              </span>
            </div>

            <h1>{details.title}</h1>

            <p className="case-subtitle">
              Procurement activity requiring investigator review
            </p>

            <div className="case-meta">

              <div>
                <span className="meta-label">
                  DEPARTMENT
                </span>

                <strong>
                  {caseData.department}
                </strong>
              </div>

              <div>
                <span className="meta-label">
                  TENDER
                </span>

                <strong>
                  {details.tender}
                </strong>
              </div>

              <div>
                <span className="meta-label">
                  VENDOR
                </span>

                <strong>
                  {details.vendor}
                </strong>
              </div>

              <div>
                <span className="meta-label">
                  VALUE
                </span>

                <strong>
                  {caseData.value}
                </strong>
              </div>

            </div>

          </div>


          <div className={`priority-box ${priorityClass}`}>

            <span className="priority-label">
              INVESTIGATION PRIORITY
            </span>

            <div className="priority-score">
              <strong>{caseData.score}</strong>
              <span>/100</span>
            </div>

            <div className="priority-level">
              {caseData.priority?.toUpperCase()} PRIORITY
            </div>

            <div className="priority-bar">
              <div
                className="priority-fill"
                style={{
                  width: `${caseData.score}%`,
                }}
              />
            </div>

          </div>

        </section>


        {/* TABS */}
        <nav className="case-tabs">

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
              activeTab === 'evidence'
                ? 'active'
                : ''
            }
            onClick={() => setActiveTab('evidence')}
          >
            Evidence
          </button>

          <button
            className={
              activeTab === 'entities'
                ? 'active'
                : ''
            }
            onClick={() => setActiveTab('entities')}
          >
            Related Entities
          </button>

          <button
            className={
              activeTab === 'history'
                ? 'active'
                : ''
            }
            onClick={() => setActiveTab('history')}
          >
            Case History
          </button>

        </nav>


        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>

            {/* WHY FLAGGED */}
            <section className="flagged-section">

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
                  MODEL EXPLANATION
                </span>

              </div>


              <div className="flagged-grid">

                <div className="flagged-main">

                  <p className="explanation">
                    {details.explanation}
                  </p>

                  <div className="signal-list">

                    {details.signals.map((signal) => (
                      <div
                        className="signal-row"
                        key={signal.number}
                      >

                        <span className="signal-number">
                          {signal.number}
                        </span>

                        <div className="signal-content">

                          <div className="signal-title-row">

                            <h3>
                              {signal.title}
                            </h3>

                            <span
                              className={`signal-score ${signal.type}`}
                            >
                              {signal.score}
                            </span>

                          </div>

                          <p>
                            {signal.description}
                          </p>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>


                <aside className="interpretation-card">

                  <span className="interpretation-label">
                    INTERPRETATION
                  </span>

                  <h3>
                    Multiple signals reinforce each other.
                  </h3>

                  <p>
                    No single signal determines wrongdoing.
                    The case is prioritized because multiple
                    procurement patterns appear together.
                  </p>

                  <div className="interpretation-divider"></div>

                  <span className="interpretation-note">
                    UNUSUAL ≠ SUSPICIOUS ≠ CORRUPT
                  </span>

                </aside>

              </div>

            </section>


            {/* EVIDENCE CHAIN */}
            <section className="evidence-chain-section">

              <div className="section-heading">

                <div>
                  <span className="section-number">
                    02
                  </span>

                  <h2>
                    Evidence chain
                  </h2>
                </div>

                <span className="section-caption">
                  TRACEABLE SIGNALS
                </span>

              </div>


              <div className="evidence-chain">

                {details.evidence.map((item, index) => (
                  <div
                    className="evidence-step"
                    key={item.label}
                  >

                    <div className="evidence-step-label">
                      {item.label}
                    </div>

                    <div className="evidence-step-card">

                      <div className="evidence-step-top">
                        <span>
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <strong>
                          {item.score}
                        </strong>
                      </div>

                      <h3>
                        {item.title}
                      </h3>

                      <div className="evidence-value">
                        {item.value}
                      </div>

                      <p>
                        {item.detail}
                      </p>

                    </div>

                    {index < details.evidence.length - 1 && (
                      <div className="evidence-arrow">
                        →
                      </div>
                    )}

                  </div>
                ))}

              </div>

            </section>


            {/* RELATED ENTITIES */}
            <section className="entities-section">

              <div className="section-heading">

                <div>
                  <span className="section-number">
                    03
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

                {details.entities.map((entity, index) => (
                  <div
                    className="entity-wrapper"
                    key={entity.id}
                  >

                    {index > 0 && (
                      <div className="entity-connector">
                        →
                      </div>
                    )}

                    <div
                      className={`entity-card ${
                        index === 0
                          ? 'primary-entity'
                          : ''
                      }`}
                    >

                      <span className="entity-type">
                        {entity.type}
                      </span>

                      <h3>
                        {entity.name}
                      </h3>

                      <p>
                        {entity.id}
                      </p>

                      <div className="entity-detail">
                        <span>
                          {entity.detailLabel}
                        </span>

                        <strong>
                          {entity.detailValue}
                        </strong>
                      </div>

                    </div>

                  </div>
                ))}

              </div>


              <button
                className="open-network-button"
                onClick={() => navigate('/network')}
              >
                Open relationship graph
                <span>↗</span>
              </button>

            </section>


            {/* CONTEXT TO VERIFY */}
            <section className="context-section">

              <div className="section-heading">

                <div>
                  <span className="section-number">
                    04
                  </span>

                  <h2>
                    Context to verify
                  </h2>
                </div>

                <span className="section-caption">
                  INVESTIGATOR CHECK
                </span>

              </div>


              <div className="context-card">

                <div className="context-icon">
                  ?
                </div>

                <div className="context-content">

                  <span className="context-label">
                    WHY MIGHT THIS BE LEGITIMATE?
                  </span>

                  <h3>
                    {details.contextTitle}
                  </h3>

                  <p>
                    {details.contextDescription}
                  </p>

                </div>

                <button className="context-button">
                  Review comparable vendors →
                </button>

              </div>

            </section>


            {/* INVESTIGATION STATUS */}
            <section className="status-section">

              <div className="status-card">

                <div>

                  <span className="status-label">
                    CURRENT INVESTIGATION STATUS
                  </span>

                  <h3>
                    Requires investigator review
                  </h3>

                  <p>
                    This alert is a prioritization signal,
                    not a determination of wrongdoing.
                  </p>

                </div>

                <div className="status-actions">

                  <button className="secondary-action">
                    Mark for review
                  </button>

                  <button className="primary-action">
                    Start investigation
                  </button>

                </div>

              </div>

            </section>

          </>
        )}


        {/* EVIDENCE TAB */}
        {activeTab === 'evidence' && (
          <section className="tab-content">

            <div className="tab-title">

              <span>02</span>

              <div>
                <h2>
                  Evidence repository
                </h2>

                <p>
                  Raw evidence and derived signals
                  contributing to this case.
                </p>
              </div>

            </div>


            <div className="evidence-full-list">

              {details.evidence.map((item, index) => (
                <div
                  className="evidence-full-card"
                  key={item.label}
                >

                  <div className="evidence-index">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="evidence-full-content">

                    <span>
                      {item.label}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                    <strong>
                      {item.value}
                    </strong>

                    <p>
                      {item.detail}
                    </p>

                  </div>

                  <div className="evidence-full-score">
                    {item.score}
                  </div>

                </div>
              ))}

            </div>

          </section>
        )}


        {/* ENTITIES TAB */}
        {activeTab === 'entities' && (
          <section className="tab-content">

            <div className="tab-title">

              <span>03</span>

              <div>
                <h2>
                  Related entities
                </h2>

                <p>
                  Entities connected to the selected
                  investigation.
                </p>
              </div>

            </div>


            <div className="entity-list">

              {details.entities.map((entity) => (
                <div
                  className="entity-list-row"
                  key={entity.id}
                >

                  <span>
                    {entity.type}
                  </span>

                  <strong>
                    {entity.name}
                  </strong>

                  <small>
                    {entity.id}
                  </small>

                </div>
              ))}

            </div>

          </section>
        )}


        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <section className="tab-content">

            <div className="tab-title">

              <span>04</span>

              <div>
                <h2>
                  Case history
                </h2>

                <p>
                  Timeline of events associated with
                  this investigation.
                </p>
              </div>

            </div>


            <div className="timeline">

              <div className="timeline-item">

                <span className="timeline-dot"></span>

                <div>

                  <span>
                    16 SEP 2026 · 09:42
                  </span>

                  <h3>
                    Case prioritized
                  </h3>

                  <p>
                    Investigation priority set to{' '}
                    {caseData.score}/100 after
                    multi-signal analysis.
                  </p>

                </div>

              </div>


              <div className="timeline-item">

                <span className="timeline-dot"></span>

                <div>

                  <span>
                    15 SEP 2026 · 18:20
                  </span>

                  <h3>
                    Primary signal detected
                  </h3>

                  <p>
                    {caseData.signal} was identified
                    during procurement analysis.
                  </p>

                </div>

              </div>


              <div className="timeline-item">

                <span className="timeline-dot"></span>

                <div>

                  <span>
                    14 SEP 2026 · 14:08
                  </span>

                  <h3>
                    Procurement record analyzed
                  </h3>

                  <p>
                    Tender {details.tender} entered
                    the anomaly detection pipeline.
                  </p>

                </div>

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  )
}

export default Case