import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

function Login() {
  const navigate = useNavigate()

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!userId || !password) {
      setError('Please enter your User ID and password.')
      return
    }

    setError('')

    // Prototype login
    navigate('/dashboard')
  }

  return (
    <div className="login-page">

      {/* Background side text */}
      <div className="login-side-text login-side-left">
        <span></span>
        <p>TRANSPARENT<br />PROCUREMENT</p>
      </div>

      <div className="login-side-text login-side-right">
        <span></span>
        <p>STRONGER<br />GOVERNANCE</p>
      </div>

      {/* Main Login Card */}
      <main className="login-card">

        {/* Logo */}
        <div className="login-brand">
          <div className="login-brand-mark">V</div>

          <h1>Vigilant</h1>

          <p>Government Procurement Intelligence</p>
        </div>

        <div className="login-divider"></div>

        {/* Login heading */}
        <div className="login-heading">
          <span className="login-label">AUTHORIZED ACCESS</span>

          <h2>Sign in to Vigilant</h2>

          <p>
            Access is restricted to authorized government
            personnel only.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* User ID */}
          <div className="form-group">
            <label htmlFor="userId">
              OFFICIAL EMAIL / USER ID
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.8-3.5 3.1-5.2 7-5.2s6.2 1.7 7 5.2" />
                </svg>
              </span>

              <input
                id="userId"
                type="text"
                placeholder="e.g. officer@department.gov.in"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />

            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              PASSWORD
            </label>

            <div className="input-wrapper">

              <span className="input-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="5" y="10" width="14" height="10" rx="1.5" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <circle cx="12" cy="15" r="1" />
                </svg>
              </span>

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5 0 8.5 4 9.5 8a12 12 0 0 1-3.1 5.2" />
                    <path d="M6.2 6.2C4.3 7.5 3.2 9.4 2.5 12c1 4 4.5 8 9.5 8 1 0 2-.2 2.9-.5" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                )}
              </button>

            </div>
          </div>

          {/* Options */}
          <div className="login-options">

            <label className="remember-option">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />

              <span className="custom-checkbox"></span>

              <span>Remember this device</span>
            </label>

            <button
              type="button"
              className="forgot-button"
              onClick={() => alert('Please contact your system administrator.')}
            >
              Forgot credentials?
            </button>

          </div>

          {/* Error */}
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Sign in */}
          <button
            type="submit"
            className="signin-button"
          >
            <span>Sign in</span>
            <span className="signin-arrow">&rarr;</span>
          </button>

        </form>

        {/* OR divider */}
        <div className="or-divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        {/* Restricted system notice */}
        <div className="restricted-box">

          <div className="restricted-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M12 3l8 3v5c0 4.7-3.2 8.3-8 10-4.8-1.7-8-5.3-8-10V6l8-3z" />
              <path d="M8.5 12l2.2 2.2 4.8-5" />
            </svg>
          </div>

          <div>
            <strong>Restricted Government System</strong>

            <p>
              Unauthorized access is prohibited and may be
              subject to legal action.
            </p>
          </div>

        </div>

      </main>

      {/* Faint building silhouettes */}
      <div className="building building-left">
        <div className="building-dome"></div>
        <div className="building-body"></div>
        <div className="building-columns"></div>
      </div>

      <div className="building building-right">
        <div className="building-tower"></div>
        <div className="building-body"></div>
        <div className="building-columns"></div>
      </div>

    </div>
  )
}

export default Login


