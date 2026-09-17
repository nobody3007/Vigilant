import { useNavigate } from "react-router-dom";
import "./index.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* =========================
          NAVBAR
         ========================= */}

      <header className="landing-nav">

        <div
          className="landing-brand"
          onClick={() => navigate("/")}
        >
          <img
            src="/vigilant_logo.png"
            alt="Vigilant"
          />

          <div>
            <strong>VIGILANT</strong>
            <span>PROCUREMENT INTELLIGENCE</span>
          </div>
        </div>

        <div className="landing-nav-actions">

          <button
            className="dashboard-link"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
            <span>&larr;</span>
          </button>

          <button
            className="signin-link"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>

        </div>

      </header>


      {/* =========================
          HERO
         ========================= */}

      <main>

        <section
          className="landing-hero"
          id="overview"
        >

          {/* LEFT SIDE */}

          <div className="hero-content">

            <div className="eyebrow">
              <span className="eyebrow-line"></span>
              PUBLIC PROCUREMENT INTELLIGENCE
            </div>

            <h1>
              Find the tenders
              <br />
              that <em>deserve a</em>
              <br />
              <em>closer look.</em>
            </h1>

            <p className="hero-description">
              Vigilant helps investigators examine procurement activity,
              connect related records, understand unusual patterns,
              and prioritize cases for review.
            </p>

            <div className="hero-actions">

              <button
                className="primary-action"
                onClick={() => navigate("/dashboard")}
              >
                <span>Open Dashboard</span>
              
              </button>

            </div>

            <div className="hero-note">

              <span className="note-mark">
                !
              </span>

              <span>
                A signal is not a finding. Vigilant supports
                investigation; it does not determine wrongdoing.
              </span>

            </div>

          </div>


          {/* RIGHT SIDE â€” PRODUCT PREVIEW */}

          <div className="hero-preview">

            <div className="preview-header">

              <div>
                <span className="preview-label">
                  INVESTIGATION QUEUE
                </span>

                <strong>
                  Priority cases
                </strong>
              </div>

              <span className="preview-status">
                24 ACTIVE SIGNALS
              </span>

            </div>

            <div className="preview-divider"></div>

            <div className="preview-table-head">
              <span>CASE</span>
              <span>SIGNAL</span>
              <span>SCORE</span>
              <span>PRIORITY</span>
            </div>

            <div className="preview-row">

              <span className="case-number">
                INV-0241
              </span>

              <span>
                Repeated award pattern
              </span>

              <strong>
                87
              </strong>

              <span className="priority high">
                HIGH
              </span>

            </div>

            <div className="preview-row">

              <span className="case-number">
                INV-0238
              </span>

              <span>
                Unusual bid pricing
              </span>

              <strong>
                81
              </strong>

              <span className="priority high">
                HIGH
              </span>

            </div>

            <div className="preview-row">

              <span className="case-number">
                INV-0235
              </span>

              <span>
                Vendor relationship
              </span>

              <strong>
                64
              </strong>

              <span className="priority medium">
                MEDIUM
              </span>

            </div>

            <div className="preview-row">

              <span className="case-number">
                INV-0231
              </span>

              <span>
                Participation pattern
              </span>

              <strong>
                58
              </strong>

              <span className="priority medium">
                MEDIUM
              </span>

            </div>

            <div className="preview-footer">

              <span>
                Signals â†’ context â†’ investigation
              </span>

              <button
                onClick={() => navigate("/investigations")}
              >
                View queue â†’
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;

