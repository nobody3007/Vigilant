import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import './evidence.css'

function Evidence() {
  const navigate = useNavigate()
  const activePage = 'evidence'

  const evidence = [
    {
      id: 'EV-001',
      source: 'Procurement records',
      evidence: 'Vendor won 4 of the last 5 comparable tenders',
      derived: 'Repeated award concentration',
      contribution: '+18',
      strength: 'High',
    },
    {
      id: 'EV-002',
      source: 'Bid records',
      evidence: 'Winning bid was 14.8% above comparable market pricing',
      derived: 'Unusual bid pricing',
      contribution: '+15',
      strength: 'High',
    },
    {
      id: 'EV-003',
      source: 'Participation history',
      evidence: 'Same group of vendors repeatedly participated together',
      derived: 'Participation pattern',
      contribution: '+11',
      strength: 'Medium',
    },
    {
      id: 'EV-004',
      source: 'Vendor profile',
      evidence: 'Vendor specialization matches the tender category',
      derived: 'Specialist vendor context',
      contribution: '-7',
      strength: 'Context',
    },
  ]

  return (
    <div className="evidence-page">
      <Sidebar />

      <main className="evidence-main">
        <Topbar
          activePage={activePage}
          onAddTender={() => navigate('/add-tender')}
        />

        <div className="evidence-content">

          <section className="evidence-intro">
            <div>
              <div className="eyebrow">INVESTIGATION EVIDENCE</div>

              <h1>Why was this case flagged?</h1>

              <p>
                Review the evidence behind an investigation priority score.
                Each signal is linked back to the underlying procurement data.
              </p>
            </div>

            <button
              className="back-button"
              onClick={() => navigate('/investigations')}
            >
              ← Priority queue
            </button>
          </section>

          <section className="case-summary">

            <div>
              <span className="summary-label">CASE</span>
              <strong>INV-0241</strong>
            </div>

            <div>
              <span className="summary-label">TENDER</span>
              <strong>TDR-10842</strong>
            </div>

            <div>
              <span className="summary-label">DEPARTMENT</span>
              <strong>Public Works</strong>
            </div>

            <div>
              <span className="summary-label">PRIORITY</span>
              <strong className="priority-high">HIGH</strong>
            </div>

            <div className="score-box">
              <span className="summary-label">PRIORITY SCORE</span>

              <div>
                <strong>87</strong>
                <span>/ 100</span>
              </div>
            </div>

          </section>

          <section className="explanation-panel">

            <div className="panel-heading">
              <div>
                <span className="eyebrow">TRACEABILITY</span>

                <h2>Evidence → Signal → Priority</h2>
              </div>

              <span className="trace-status">
                4 contributing signals
              </span>
            </div>

            <div className="evidence-flow">

              <div className="flow-column">
                <div className="flow-title">
                  RAW EVIDENCE
                </div>

                <span>
                  Original procurement observations
                </span>
              </div>

              <div className="flow-arrow">→</div>

              <div className="flow-column">
                <div className="flow-title">
                  DERIVED SIGNAL
                </div>

                <span>
                  Pattern identified from evidence
                </span>
              </div>

              <div className="flow-arrow">→</div>

              <div className="flow-column">
                <div className="flow-title">
                  CONTRIBUTION
                </div>

                <span>
                  Effect on investigation priority
                </span>
              </div>

            </div>

            <div className="evidence-list">

              {evidence.map((item) => (
                <article
                  className="evidence-row"
                  key={item.id}
                >

                  <div className="evidence-id">
                    <span>{item.id}</span>
                    <small>{item.source}</small>
                  </div>

                  <div className="evidence-raw">
                    <span className="mobile-label">
                      RAW EVIDENCE
                    </span>

                    <p>{item.evidence}</p>
                  </div>

                  <div className="evidence-derived">
                    <span className="mobile-label">
                      DERIVED SIGNAL
                    </span>

                    <strong>{item.derived}</strong>
                  </div>

                  <div className="evidence-contribution">

                    <span className="mobile-label">
                      CONTRIBUTION
                    </span>

                    <strong
                      className={
                        item.contribution.startsWith('-')
                          ? 'negative'
                          : 'positive'
                      }
                    >
                      {item.contribution}
                    </strong>

                    <span
                      className={`strength ${item.strength.toLowerCase()}`}
                    >
                      {item.strength}
                    </span>

                  </div>

                </article>
              ))}

            </div>

          </section>

          <section className="interpretation-grid">

            <div className="interpretation-card">

              <span className="eyebrow">
                SYSTEM INTERPRETATION
              </span>

              <h2>
                Multiple signals increased priority
              </h2>

              <p>
                The case was prioritized because several independent
                procurement patterns appear together. No single signal is
                treated as proof of wrongdoing.
              </p>

              <div className="interpretation-points">

                <div>
                  <span>01</span>
                  <p>Repeated award concentration</p>
                </div>

                <div>
                  <span>02</span>
                  <p>
                    Unusual pricing relative to comparable tenders
                  </p>
                </div>

                <div>
                  <span>03</span>
                  <p>Recurring participation pattern</p>
                </div>

              </div>

            </div>

            <div className="context-card">

              <span className="eyebrow">
                CONTEXT CHECK
              </span>

              <h2>
                Evidence can reduce priority too
              </h2>

              <p>
                Not every unusual pattern is suspicious. Contextual evidence
                can explain an otherwise unusual observation.
              </p>

              <div className="context-signal">

                <div>
                  <span>Specialist vendor</span>

                  <small>
                    Vendor specialization matches the tender category.
                  </small>
                </div>

                <strong>-7</strong>

              </div>

              <div className="context-footer">
                Contextual evidence is retained for investigator review.
              </div>

            </div>

          </section>

          <section className="evidence-disclaimer">

            <strong>Investigator note</strong>

            <span>
              Priority indicates where review may be useful. It is not a
              finding of misconduct, corruption, or wrongdoing.
            </span>

          </section>

        </div>
      </main>
    </div>
  )
}

export default Evidence