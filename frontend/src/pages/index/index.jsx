import { Link } from 'react-router-dom'
import './index.css'

function Home() {
  return (
    <div className="vigilant-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">
  <div className="nav-inner">

    <Link to="/" className="brand">
      <div className="brand-mark">
        V
      </div>

      <div>
        <div className="brand-name">
          Vigilant
        </div>

        <div className="brand-subtitle">
          Government Procurement Intelligence
        </div>
      </div>
    </Link>

    <div className="nav-links">

      <Link to="/dashboard">
        Dashboard
      </Link>

      <a href="#how-it-works">
        How it works
      </a>

      <Link to="/login" className="login-button">
        Authorized Sign In
        <span>→</span>
      </Link>

    </div>

  </div>
</nav>


      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="eyebrow">
            <span className="status-dot"></span>
            GOVERNMENT PROCUREMENT INTELLIGENCE
          </div>

          <h1>
            Identify what
            <br />
            <span>deserves investigation.</span>
          </h1>

          <p className="hero-description">
            Vigilant analyzes procurement activity, vendor relationships,
            bidding patterns, and available evidence to surface unusual
            activity for authorized human review.
          </p>

          <div className="hero-actions">

            <Link to="/login" className="primary-button">
              Authorized Sign In
              <b>→</b>
            </Link>

            <a
              href="#how-it-works"
              className="secondary-button"
            >
              See how it works
            </a>

          </div>

          <div className="restricted-note">
            <span>◆</span>
            RESTRICTED SYSTEM · AUTHORIZED GOVERNMENT PERSONNEL ONLY
          </div>

        </div>


        {/* =========================
            HERO VISUAL
        ========================= */}

        <div className="hero-visual">

          <div className="visual-header">

            <span>
              PROCUREMENT SIGNAL ANALYSIS
            </span>

            <div className="live-status">
              <i></i>
              LIVE ANALYSIS
            </div>

          </div>


          <div className="network">

            <div className="connection connection-one"></div>
            <div className="connection connection-two"></div>
            <div className="connection connection-three"></div>
            <div className="connection connection-four"></div>


            <div className="network-node node-tender">

              <div className="node-icon">
                T
              </div>

              <div>
                <strong>Tender</strong>
                <small>Procurement</small>
              </div>

            </div>


            <div className="network-node node-vendor">

              <div className="node-icon">
                V
              </div>

              <div>
                <strong>Vendor</strong>
                <small>Participant</small>
              </div>

            </div>


            <div className="network-node node-contract">

              <div className="node-icon">
                C
              </div>

              <div>
                <strong>Contract</strong>
                <small>Award</small>
              </div>

            </div>


            <div className="network-node node-department">

              <div className="node-icon">
                D
              </div>

              <div>
                <strong>Department</strong>
                <small>Authority</small>
              </div>

            </div>


            <div className="signal-card">

              <div className="signal-label">
                <span className="signal-dot"></span>
                INVESTIGATION SIGNAL
              </div>

              <strong>
                Unusual award pattern detected
              </strong>

              <div className="signal-meta">
                <span>
                  Priority
                </span>

                <b>
                  Review
                </b>
              </div>

            </div>

          </div>


          <div className="visual-footer">

            <span>Relationships</span>
            <span>Behaviour</span>
            <span>Pricing</span>
            <span>Evidence</span>

          </div>

        </div>

      </section>


      {/* =========================
          WHAT VIGILANT DOES
      ========================= */}

      <section
        className="content-section capabilities"
        id="platform"
      >

        <div className="section-heading">

          <span className="section-label">
            WHAT VIGILANT DOES
          </span>

          <h2>
            From procurement data
            <br />
            to investigation priorities.
          </h2>

        </div>


        <div className="card-grid">

          <div className="info-card">

            <span className="card-number">
              01
            </span>

            <h3>
              Detect
            </h3>

            <p>
              Identify unusual patterns across tenders,
              bids, awards, vendors, contracts, and payments.
            </p>

          </div>


          <div className="info-card">

            <span className="card-number">
              02
            </span>

            <h3>
              Connect
            </h3>

            <p>
              Map relationships between vendors, tenders,
              departments, contracts, and procurement activity.
            </p>

          </div>


          <div className="info-card">

            <span className="card-number">
              03
            </span>

            <h3>
              Explain
            </h3>

            <p>
              Surface the evidence and signals behind each
              flagged pattern so investigators can understand
              why it deserves attention.
            </p>

          </div>


          <div className="info-card">

            <span className="card-number">
              04
            </span>

            <h3>
              Prioritize
            </h3>

            <p>
              Organize signals by relevance and potential
              importance so limited investigative resources
              can focus where they matter most.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section
        className="process-section"
        id="how-it-works"
      >

        <div className="process-intro">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            From records
            <br />
            to review.
          </h2>

          <p>
            Vigilant brings procurement records together,
            analyzes relationships and patterns, and presents
            signals that can help authorized investigators
            decide where closer examination is warranted.
          </p>

        </div>


        <div className="process-list">

          <div className="process-item">

            <div className="process-icon">
              01
            </div>

            <div>

              <h3>
                Ingest procurement data
              </h3>

              <p>
                Tenders, bids, vendors, awards, contracts,
                and available payment records are brought
                into a common analytical view.
              </p>

            </div>

          </div>


          <div className="process-item">

            <div className="process-icon">
              02
            </div>

            <div>

              <h3>
                Analyze patterns
              </h3>

              <p>
                Statistical and relationship-based analysis
                identifies activity that differs from expected
                procurement behaviour.
              </p>

            </div>

          </div>


          <div className="process-item">

            <div className="process-icon">
              03
            </div>

            <div>

              <h3>
                Surface relationships
              </h3>

              <p>
                Connected vendors, tenders, departments,
                and contracts are mapped to provide broader
                investigative context.
              </p>

            </div>

          </div>


          <div className="process-item">

            <div className="process-icon">
              04
            </div>

            <div>

              <h3>
                Support investigation
              </h3>

              <p>
                Investigators receive prioritized signals and
                supporting evidence while retaining full
                responsibility for the final assessment.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          METHODOLOGY
      ========================= */}

      <section
        className="content-section methodology"
        id="methodology"
      >

        <div className="methodology-header">

          <span className="section-label">
            INVESTIGATION METHODOLOGY
          </span>

          <h2>
            Unusual does not mean corrupt.
          </h2>

          <p>
            Vigilant is designed to support investigation,
            not replace it. A detected anomaly is a signal
            for closer examination, not a determination of
            wrongdoing.
          </p>

        </div>


        <div className="card-grid">

          <div className="info-card">

            <span className="card-number">
              01
            </span>

            <h3>
              Signal
            </h3>

            <p>
              Detect activity that differs from established
              procurement patterns or expected behaviour.
            </p>

          </div>


          <div className="info-card">

            <span className="card-number">
              02
            </span>

            <h3>
              Context
            </h3>

            <p>
              Examine the surrounding tender, vendor,
              department, pricing, and relationship context.
            </p>

          </div>


          <div className="info-card">

            <span className="card-number">
              03
            </span>

            <h3>
              Evidence
            </h3>

            <p>
              Review the records and relationships that
              contributed to the signal.
            </p>

          </div>


          <div className="info-card">

            <span className="card-number">
              04
            </span>

            <h3>
              Human review
            </h3>

            <p>
              Authorized investigators determine whether
              further action or investigation is warranted.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="final-cta">

        <div>

          <span className="section-label">
            AUTHORIZED ACCESS
          </span>

          <h2>
            Review what
            <br />
            deserves attention.
          </h2>

        </div>


        <Link
          to="/login"
          className="primary-button large"
        >
          Enter Vigilant
          <b>→</b>
        </Link>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <div className="footer-brand">

          <div className="brand-mark small">
            V
          </div>

          <div>

            <strong>
              Vigilant
            </strong>

            <div>
              <span>
                Government Procurement Intelligence
              </span>
            </div>

          </div>

        </div>


        <div className="footer-right">

          <span>
            RESTRICTED GOVERNMENT SYSTEM
          </span>

          <span>
            AUTHORIZED PERSONNEL ONLY
          </span>

        </div>

      </footer>

    </div>
  )
}

export default Home