import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId || !password) {
      alert("Please enter your User ID and password.");
      return;
    }

    // Temporary authentication
    navigate("/dashboard");
  };

  return (
    <div className="v-login-page">

      {/* Left decorative text */}
      <div className="v-login-side v-login-left">
        <span></span>
        <p>
          PROCUREMENT
          <br />
          INTELLIGENCE
        </p>
      </div>

      {/* Right decorative text */}
      <div className="v-login-side v-login-right">
        <span></span>
        <p>
          INVESTIGATION
          <br />
          CONSOLE
        </p>
      </div>

      {/* Login card */}
      <div className="v-login-card">

        {/* Brand */}
        <div className="v-login-brand">

          <img
            src="/vigilant_logo.png"
            alt="Vigilant"
            className="v-login-logo"
          />

          <div className="v-brand-copy">
            <strong>VIGILANT</strong>
            <span>PROCUREMENT INTELLIGENCE</span>
          </div>

        </div>

        {/* Divider */}
        <div className="v-login-divider"></div>

        {/* Heading */}
        <div className="v-login-heading">

          <span className="v-login-eyebrow">
            AUTHORIZED ACCESS
          </span>

          <h1>Sign in to Vigilant</h1>

          <p>
            Access the procurement investigation console
            using your authorized credentials.
          </p>

        </div>

        {/* Form */}
        <form
          className="v-login-form"
          onSubmit={handleSubmit}
        >

          {/* User ID */}
          <div className="v-login-field">

            <label htmlFor="userId">
              OFFICIAL EMAIL / USER ID
            </label>

            <div className="v-login-input-wrap">

              <span className="v-input-icon">
                ◌
              </span>

              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. officer@department.gov.in"
              />

            </div>

          </div>

          {/* Password */}
          <div className="v-login-field">

            <label htmlFor="password">
              PASSWORD
            </label>

            <div className="v-login-input-wrap">

              <span className="v-input-icon">
                ◈
              </span>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="v-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* Options */}
          <div className="v-login-options">

            <label className="v-remember">

              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(e.target.checked)
                }
              />

              <span>Remember this device</span>

            </label>

            <button
              type="button"
              className="v-forgot"
              onClick={() =>
                alert("Please contact your system administrator.")
              }
            >
              Forgot credentials?
            </button>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="v-login-button"
          >
            <span>Sign in</span>
            <span className="v-button-arrow">→</span>
          </button>

        </form>

        {/* Security section */}
        <div className="v-security">

          <div className="v-security-mark">
            !
          </div>

          <div>
            <strong>Restricted Government System</strong>

            <p>
              Access is limited to authorized personnel.
              All activity may be monitored and recorded.
            </p>
          </div>

        </div>

        {/* Request access */}
        <div className="v-request-access">

          <span>Need authorized access?</span>

          <button
            type="button"
            onClick={() => navigate("/signin")}
          >
            Request access
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;