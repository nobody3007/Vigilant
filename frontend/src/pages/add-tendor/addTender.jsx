import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './addTender.css'

function AddTender() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    tenderId: '',
    department: '',
    category: '',
    location: '',
    estimatedValue: '',
    contractValue: '',
    numberOfBidders: '',
    winningVendor: '',
    vendorSpecialization: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Prototype behaviour
    console.log('Tender Information:', formData)

    alert('Tender information added successfully.')

    navigate('/dashboard')
  }

  return (
    <div className="add-tender-page">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-logo">V</div>

          <div>
            <h2>Vigilant</h2>
            <span>Procurement Intelligence</span>
          </div>
        </div>

        <div className="sidebar-section-title">
          WORKSPACE
        </div>

        <nav className="sidebar-navigation">

          <button
            className="sidebar-link"
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-number">01</span>
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-number">02</span>
            <span>Investigations</span>
          </button>

          <button className="sidebar-link active">
            <span className="nav-number">03</span>
            <span>Tenders</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-number">04</span>
            <span>Vendors</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-number">05</span>
            <span>Network</span>
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate('/dashboard')}
          >
            <span className="nav-number">06</span>
            <span>Evidence</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">
            <div className="status-dot"></div>

            <div>
              <strong>System operational</strong>
              <span>Analysis services active</span>
            </div>
          </div>

          <button
            className="back-dashboard"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to dashboard
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="add-tender-main">

        {/* TOP BAR */}
        <header className="topbar">

          <div className="breadcrumb">
            <span>VIGILANT</span>
            <b>/</b>
            <span>Tenders</span>
            <b>/</b>
            <strong>Add Tender</strong>
          </div>

          <div className="authorized-user">

            <div className="user-details">
              <strong>Authorized User</strong>
              <span>Government Investigation Team</span>
            </div>

            <div className="user-avatar">
              AU
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <div className="add-tender-content">

          <div className="page-heading">

            <div>
              <div className="page-eyebrow">
                TENDERS
              </div>

              <h1>Add tender information</h1>

              <p>
                Enter procurement data for analysis and investigation screening.
              </p>
            </div>

            <button
              className="back-tenders-button"
              onClick={() => navigate('/dashboard')}
            >
              ← Back to tenders
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            {/* =========================
                01 TENDER INFORMATION
            ========================= */}

            <section className="form-section">

              <div className="section-header">

                <div className="section-number">
                  01
                </div>

                <div>
                  <h2>Tender Information</h2>
                  <p>Basic details about the tender.</p>
                </div>

              </div>

              <div className="form-fields four-fields">

                <div className="form-field">
                  <label>
                    Tender ID <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="tenderId"
                    value={formData.tenderId}
                    onChange={handleChange}
                    placeholder="e.g. TNDR-2026-0142"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Department <span>*</span>
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Public Works">Public Works</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Transport">Transport</option>
                    <option value="Urban Development">
                      Urban Development
                    </option>
                    <option value="Rural Development">
                      Rural Development
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label>
                    Category <span>*</span>
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Infrastructure">
                      Infrastructure
                    </option>
                    <option value="IT Services">
                      IT Services
                    </option>
                    <option value="Healthcare">
                      Healthcare
                    </option>
                    <option value="Construction">
                      Construction
                    </option>
                    <option value="Equipment">
                      Equipment
                    </option>
                    <option value="Consulting">
                      Consulting
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label>
                    Location <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. New Delhi, Delhi"
                    required
                  />
                </div>

              </div>

            </section>


            {/* =========================
                02 FINANCIAL INFORMATION
            ========================= */}

            <section className="form-section">

              <div className="section-header">

                <div className="section-number">
                  02
                </div>

                <div>
                  <h2>Financial Information</h2>
                  <p>Contract values and financial details.</p>
                </div>

              </div>

              <div className="form-fields two-fields">

                <div className="form-field">
                  <label>
                    Estimated Value (₹) <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="estimatedValue"
                    value={formData.estimatedValue}
                    onChange={handleChange}
                    placeholder="e.g. 10500000"
                    min="0"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Contract Value (₹) <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="contractValue"
                    value={formData.contractValue}
                    onChange={handleChange}
                    placeholder="e.g. 9800000"
                    min="0"
                    required
                  />
                </div>

              </div>

            </section>


            {/* =========================
                03 BIDDING ACTIVITY
            ========================= */}

            <section className="form-section half-section">

              <div className="section-header">

                <div className="section-number">
                  03
                </div>

                <div>
                  <h2>Bidding Activity</h2>
                  <p>Participation details for the tender.</p>
                </div>

              </div>

              <div className="form-fields">

                <div className="form-field">
                  <label>
                    Number of Bidders <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="numberOfBidders"
                    value={formData.numberOfBidders}
                    onChange={handleChange}
                    placeholder="e.g. 6"
                    min="1"
                    required
                  />
                </div>

              </div>

            </section>


            {/* =========================
                04 VENDOR INFORMATION
            ========================= */}

            <section className="form-section">

              <div className="section-header">

                <div className="section-number">
                  04
                </div>

                <div>
                  <h2>Vendor Information</h2>
                  <p>Winning vendor and related details.</p>
                </div>

              </div>

              <div className="form-fields two-fields">

                <div className="form-field">
                  <label>
                    Winning Vendor <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="winningVendor"
                    value={formData.winningVendor}
                    onChange={handleChange}
                    placeholder="e.g. Apex Infrastructure Ltd."
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    Vendor Specialization <span>*</span>
                  </label>

                  <select
                    name="vendorSpecialization"
                    value={formData.vendorSpecialization}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select specialization
                    </option>

                    <option value="Infrastructure">
                      Infrastructure
                    </option>

                    <option value="Construction">
                      Construction
                    </option>

                    <option value="IT Services">
                      IT Services
                    </option>

                    <option value="Healthcare">
                      Healthcare
                    </option>

                    <option value="Equipment Supply">
                      Equipment Supply
                    </option>

                    <option value="Consulting">
                      Consulting
                    </option>

                  </select>
                </div>

              </div>

            </section>


            {/* ACTIONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-button"
              >
                Add Tender
                <span>→</span>
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  )
}

export default AddTender