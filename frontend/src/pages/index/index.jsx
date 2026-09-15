import { useNavigate } from 'react-router-dom'
import './index.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <header className="landing-nav">
        <div className="landing-brand" onClick={() => navigate('/')}>
          <img src="/vigilant_logo.png" alt="Vigilant" />
          <div>
            <strong>VIGILANT</strong>
            <span>PROCUREMENT INTELLIGENCE</span>
          </div>
        </div>

        <nav className="landing-nav-links">
          <a href="#overview">Overview</a>
          <a href="#method">Method</a>
          <a href="#principles">Principles</a>
        </nav>

        <div className="landing-nav-actions">
          {/* DIRECT DASHBOARD LINK — KEEP THIS */}
          <button
            className="dashboard-link"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
            <span>↗</span>
          </button>

          <button
            className="signin-link"
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </div>
      </header>


      {/* HERO */}
      <main>

        <section className="landing-hero" id="overview">
          <div className="hero-content">

            <div className="eyebrow">
              <span className="eyebrow-line" />
              PUBLIC PROCUREMENT INTELLIGENCE
            </div>

            <h1>
              Find the tenders
              <br />
              that <em>deserve a closer look.</em>
            </h1>

            <p className="hero-description">
              Vigilant helps investigators examine procurement activity,
              connect related records, understand unusual patterns,
              and prioritize cases for review.
            </p>

            <div className="hero-actions">
              <button
                className="primary-action"
                onClick={() => navigate('/dashboard')}
              >
                Open Dashboard
                <span>→</span>
              </button>

              <a href="#method" className="secondary-action">
                See how it works
              </a>
            </div>

            <div className="hero-note">
              <span className="note-mark">!</span>
              <span>
                A signal is not a finding. Vigilant supports investigation;
                it does not determine wrongdoing.
              </span>
            </div>

          </div>

          {/* PRODUCT PREVIEW */}
          <div className="hero-preview">

            <div className="preview-header">
              <div>
                <span className="preview-label">INVESTIGATION QUEUE</span>
                <strong>Priority cases</strong>
              </div>

              <span className="preview-status">
                24 ACTIVE SIGNALS
              </span>
            </div>

            <div className="preview-divider" />

            <div className="preview-table-head">
              <span>CASE</span>
              <span>SIGNAL</span>
              <span>SCORE</span>
              <span>PRIORITY</span>
            </div>

            <div className="preview-row">
              <span className="case-number">INV-0241</span>
              <span>Repeated award pattern</span>
              <strong>87</strong>
              <span className="priority high">HIGH</span>
            </div>

            <div className="preview-row">
              <span className="case-number">INV-0238</span>
              <span>Unusual bid pricing</span>
              <strong>81</strong>
              <span className="priority high">HIGH</span>
            </div>

            <div className="preview-row">
              <span className="case-number">INV-0235</span>
              <span>Vendor relationship</span>
              <strong>64</strong>
              <span className="priority medium">MEDIUM</span>
            </div>

            <div className="preview-row">
              <span className="case-number">INV-0231</span>
              <span>Participation pattern</span>
              <strong>58</strong>
              <span className="priority medium">MEDIUM</span>
            </div>

            <div className="preview-footer">
              <span>Signals → context → investigation</span>
              <button onClick={() => navigate('/investigations')}>
                View queue →
              </button>
            </div>

          </div>
        </section>


        {/* METHOD */}
        <section className="method-section" id="method">

          <div className="section-heading">
            <div className="section-number">01</div>

            <div>
              <span className="section-kicker">
                INVESTIGATION METHOD
              </span>

              <h2>
                From an unusual record
                <br />
                to an explainable case.
              </h2>
            </div>

            <p>
              Procurement activity can look unusual for many legitimate
              reasons. Vigilant gives investigators the context needed
              to decide what actually deserves attention.
            </p>
          </div>


          <div className="method-grid">

            <div className="method-card">
              <span className="method-index">01</span>
              <div className="method-icon">◎</div>
              <h3>Detect</h3>
              <p>
                Identify unusual pricing, participation, awards,
                and other procurement signals.
              </p>
            </div>

            <div className="method-card">
              <span className="method-index">02</span>
              <div className="method-icon">◌</div>
              <h3>Correlate</h3>
              <p>
                Connect vendors, tenders, departments,
                locations, and repeated interactions.
              </p>
            </div>

            <div className="method-card">
              <span className="method-index">03</span>
              <div className="method-icon">⌁</div>
              <h3>Explain</h3>
              <p>
                Trace signals back to the underlying evidence
                instead of presenting a score without context.
              </p>
            </div>

            <div className="method-card">
              <span className="method-index">04</span>
              <div className="method-icon">→</div>
              <h3>Prioritize</h3>
              <p>
                Give investigators a focused queue so attention
                can go where it is most useful.
              </p>
            </div>

          </div>
        </section>


        {/* PRINCIPLES */}
        <section className="principles-section" id="principles">

          <div className="principles-left">
            <span className="section-kicker">
              DESIGN PRINCIPLE
            </span>

            <h2>
              Unusual does not
              <br />
              mean <em>suspicious.</em>
            </h2>

            <p>
              A procurement pattern can have a reasonable explanation.
              The system therefore focuses on combining signals,
              providing context, and showing the evidence behind
              every priority decision.
            </p>
          </div>

          <div className="principles-right">

            <div className="principle-row">
              <span>01</span>
              <div>
                <strong>Evidence first</strong>
                <p>
                  Every alert should be traceable to observable
                  procurement data.
                </p>
              </div>
            </div>

            <div className="principle-row">
              <span>02</span>
              <div>
                <strong>Multiple signals</strong>
                <p>
                  One unusual value should not automatically become
                  an investigation.
                </p>
              </div>
            </div>

            <div className="principle-row">
              <span>03</span>
              <div>
                <strong>Human review</strong>
                <p>
                  The investigator makes the final judgement,
                  not the system.
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* FINAL CTA */}
        <section className="landing-cta">

          <div>
            <span className="section-kicker">
              VIGILANT
            </span>

            <h2>
              Start with the
              <br />
              investigation queue.
            </h2>
          </div>

          <button
            className="cta-button"
            onClick={() => navigate('/dashboard')}
          >
            Open Dashboard
            <span>→</span>
          </button>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="landing-footer">

        <div className="footer-brand">
          <img src="/vigilant_logo.png" alt="Vigilant" />
          <span>VIGILANT</span>
        </div>

        <div className="footer-center">
          Procurement intelligence for informed investigation.
        </div>

        <div className="footer-right">
          <span>© 2026 Vigilant</span>
          <span>Investigation support system</span>
        </div>

      </footer>

    </div>
  )
}

export default Home