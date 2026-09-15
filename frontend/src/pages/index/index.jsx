import { useNavigate } from 'react-router-dom'
import './index.css'


function Home() {
  const navigate = useNavigate()

  const handleSignIn = () => {
    navigate('/login')
  }

  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================= */}
      <header className="home-navbar">
        <div className="home-nav-inner">

          <div className="home-brand">

            <div className="home-brand-logo">
           <img src="/vigilant_logo.png" alt="Vigilant Logo" />
            </div>

            <div className="home-brand-text">
              <h2>Vigilant</h2>
              <span>Procurement Intelligence</span>
            </div>

          </div>


          <nav className="home-navigation">

            <button
              type="button"
              className="nav-item"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

            <a
              href="#how-it-works"
              className="nav-item"
            >
              How it works
            </a>

            <button
              type="button"
              className="nav-signin"
              onClick={handleSignIn}
            >
              Authorized Sign In
            </button>

          </nav>

        </div>
      </header>


      {/* =========================
          MAIN
      ========================= */}
      <main>

        {/* =========================
            HERO
        ========================= */}
        <section className="hero-section">

          <div className="hero-inner">

            {/* LEFT SIDE */}
            <div className="hero-content">

              <div className="eyebrow">
                GOVERNMENT PROCUREMENT OVERSIGHT
              </div>

              <h1>
                Identify what
                <br />
                deserves investigation.
              </h1>

              <p className="hero-description">
                Vigilant analyzes public procurement data and highlights
                unusual patterns, relationships and activity for authorized
                government investigators.
              </p>

              <button
                type="button"
                className="hero-button"
                onClick={handleSignIn}
              >
                <span>Authorized Sign In</span>
                <span className="button-arrow">→</span>
              </button>

              <p className="restricted-note">
                Restricted system • Authorized government personnel only
              </p>

            </div>


            {/* RIGHT SIDE - SIMPLE POINTS */}
            <div className="hero-features">

              <div className="hero-feature">
                <span className="feature-dot">•</span>
                <span>Detect unusual procurement patterns</span>
              </div>

              <div className="hero-feature">
                <span className="feature-dot">•</span>
                <span>Connect tenders, vendors and departments</span>
              </div>

              <div className="hero-feature">
                <span className="feature-dot">•</span>
                <span>Review evidence and supporting records</span>
              </div>

              <div className="hero-feature">
                <span className="feature-dot">•</span>
                <span>Prioritize cases for investigation</span>
              </div>

            </div>

          </div>

        </section>


        {/* =========================
            HOW IT WORKS
        ========================= */}
        <section
          className="how-section"
          id="how-it-works"
        >

          <div className="section-container">

            <div className="section-introduction">

              <div className="eyebrow">
                HOW IT WORKS
              </div>

              <h2>
                From data to investigation
              </h2>

              <p>
                Vigilant brings procurement information together and helps
                investigators focus on what deserves attention.
              </p>

            </div>


            <div className="process-list">

              <div className="process-item">

                <div className="process-number">
                  01
                </div>

                <div className="process-content">
                  <h3>Collect</h3>

                  <p>
                    Tender, bidder, vendor and contract information.
                  </p>
                </div>

                <div className="process-arrow">
                  →
                </div>

              </div>


              <div className="process-item">

                <div className="process-number">
                  02
                </div>

                <div className="process-content">
                  <h3>Analyze</h3>

                  <p>
                    Compare activity and identify unusual patterns.
                  </p>
                </div>

                <div className="process-arrow">
                  →
                </div>

              </div>


              <div className="process-item">

                <div className="process-number">
                  03
                </div>

                <div className="process-content">
                  <h3>Connect</h3>

                  <p>
                    Map relationships between procurement entities.
                  </p>
                </div>

                <div className="process-arrow">
                  →
                </div>

              </div>


              <div className="process-item last-process">

                <div className="process-number">
                  04
                </div>

                <div className="process-content">
                  <h3>Investigate</h3>

                  <p>
                    Prioritize cases and review supporting evidence.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            FINAL CTA
        ========================= */}
        <section className="final-cta">

          <div className="cta-container">

            <div className="cta-content">

              <div className="eyebrow">
                INVESTIGATION WITH CONTEXT
              </div>

              <h2>
                Review procurement activity with evidence,
                not assumptions.
              </h2>

              <p>
                Restricted government investigation platform.
              </p>

            </div>


            <button
              type="button"
              className="cta-button"
              onClick={handleSignIn}
            >
              <span>
                Enter Authorized Workspace
              </span>

              <span className="button-arrow">
                →
              </span>
            </button>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}
      <footer className="home-footer">

        <div className="footer-inner">

          <div className="footer-brand">
            <strong>Vigilant</strong>
            <span>Procurement Intelligence</span>
          </div>

          <div className="footer-right">
            Restricted government investigation platform.
          </div>

        </div>

      </footer>

    </div>
  )
}

export default Home