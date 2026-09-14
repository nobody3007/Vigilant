import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState('dashboard')
  
  const cases = [
    {
      id: 'INV-0241',
      signal: 'Repeated award pattern',
      department: 'Public Works',
      value: '₹18.4 Cr',
      priority: 'High'
    },
    {
      id: 'INV-0238',
      signal: 'Unusual bid pricing',
      department: 'Health Services',
      value: '₹7.2 Cr',
      priority: 'High'
    },
    {
      id: 'INV-0235',
      signal: 'Vendor relationship',
      department: 'Transport',
      value: '₹4.8 Cr',
      priority: 'Medium'
    },
    {
      id: 'INV-0231',
      signal: 'Participation pattern',
      department: 'Education',
      value: '₹2.6 Cr',
      priority: 'Medium'
    }
  ]

  const tenders = [
    {
      id: 'TDR-10842',
      title: 'Road Infrastructure Package',
      department: 'Public Works',
      status: 'Under Review'
    },
    {
      id: 'TDR-10837',
      title: 'Medical Equipment Supply',
      department: 'Health Services',
      status: 'Analyzed'
    },
    {
      id: 'TDR-10831',
      title: 'Fleet Maintenance Services',
      department: 'Transport',
      status: 'Analyzed'
    },
    {
      id: 'TDR-10826',
      title: 'School Equipment Procurement',
      department: 'Education',
      status: 'Analyzed'
    }
  ]

  const vendors = [
    {
      id: 'VND-00482',
      name: 'Apex Infrastructure Ltd.',
      tenders: '18',
      awards: '7',
      value: '₹42.6 Cr'
    },
    {
      id: 'VND-00391',
      name: 'Meditech Supplies Pvt. Ltd.',
      tenders: '14',
      awards: '5',
      value: '₹21.8 Cr'
    },
    {
      id: 'VND-00276',
      name: 'National Fleet Services',
      tenders: '11',
      awards: '4',
      value: '₹16.2 Cr'
    },
    {
      id: 'VND-00194',
      name: 'Eastern Education Systems',
      tenders: '9',
      awards: '3',
      value: '₹8.7 Cr'
    }
  ]

  const signals = [
    {
      type: 'Repeated award pattern',
      description: 'Multiple awards involving the same vendor group.',
      priority: 'High',
      cases: '4 cases'
    },
    {
      type: 'Unusual bid pricing',
      description: 'Bid values showing an unusual relationship to peers.',
      priority: 'High',
      cases: '3 cases'
    },
    {
      type: 'Vendor relationship',
      description: 'Potentially relevant relationships between participants.',
      priority: 'Medium',
      cases: '5 cases'
    },
    {
      type: 'Participation pattern',
      description: 'Repeated or unusual participation across tenders.',
      priority: 'Medium',
      cases: '4 cases'
    }
  ]

  const navigation = [
    {
      id: 'dashboard',
      number: '01',
      label: 'Dashboard'
    },
    {
      id: 'investigations',
      number: '02',
      label: 'Investigations'
    },
    {
      id: 'tenders',
      number: '03',
      label: 'Tenders'
    },
    {
      id: 'vendors',
      number: '04',
      label: 'Vendors'
    },
    {
      id: 'network',
      number: '05',
      label: 'Network'
    },
    {
      id: 'evidence',
      number: '06',
      label: 'Evidence'
    }
  ]

  // Opens the Add Tender page
  const handleAddTender = () => {
    navigate('/add-tender')
  }

  return (
    <div className="dashboard-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <Link to="/" className="sidebar-brand">

          <div className="sidebar-logo">
            V
          </div>

          <div className="sidebar-brand-text">
            <strong>Vigilant</strong>
            <span>Procurement Intelligence</span>
          </div>

        </Link>


        <div className="sidebar-section">

          <div className="sidebar-label">
            WORKSPACE
          </div>

          <nav className="sidebar-nav">

            {navigation.map((item) => (
              <button
                key={item.id}
                className={`sidebar-link ${
                  activePage === item.id ? 'active' : ''
                }`}
                onClick={() => setActivePage(item.id)}
              >

                <span className="nav-icon">
                  {item.number}
                </span>

                <span>
                  {item.label}
                </span>

              </button>
            ))}

          </nav>

        </div>


        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-indicator"></span>

            <div>
              <strong>
                System operational
              </strong>

              <small>
                Analysis services active
              </small>
            </div>

          </div>


          <Link to="/" className="back-link">
            ← Entry page
          </Link>

        </div>

      </aside>


      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-main">


        {/* =========================
            TOPBAR
        ========================= */}

        <header className="dashboard-topbar">

          <div className="breadcrumb">
            VIGILANT
            <span>/</span>
            {navigation.find(
              (item) => item.id === activePage
            )?.label}
          </div>


          <div className="user-area">

            <div className="user-info">

              <strong>
                Authorized User
              </strong>

              <span>
                Government Investigation Team
              </span>

            </div>

            <div className="user-avatar">
              AU
            </div>

          </div>

        </header>


        {/* =========================
            DASHBOARD VIEW
        ========================= */}

        {activePage === 'dashboard' && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <div className="dashboard-eyebrow">
                  PROCUREMENT OVERSIGHT
                </div>

                <h1>
                  Investigation overview
                </h1>

                <p>
                  Procurement activity and signals requiring
                  authorized review.
                </p>

              </div>


              <div className="dashboard-heading-actions">

                <button
                  className="add-tender-button"
                  onClick={handleAddTender}
                >
                  <span>+</span>
                  Add tender information
                </button>

                <div className="date-display">

                  <span>
                    DATA UPDATED
                  </span>

                  <strong>
                    Today · 09:42
                  </strong>

                </div>

              </div>

            </section>


            {/* STATS */}

            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-top">
                  <span>ACTIVE SIGNALS</span>
                  <b>01</b>
                </div>

                <strong className="stat-number">
                  24
                </strong>

                <span className="stat-description">
                  Signals currently requiring review
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-top">
                  <span>HIGH PRIORITY</span>
                  <b>02</b>
                </div>

                <strong className="stat-number">
                  7
                </strong>

                <span className="stat-description">
                  Cases prioritized for closer examination
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-top">
                  <span>TENDERS ANALYZED</span>
                  <b>03</b>
                </div>

                <strong className="stat-number">
                  1,284
                </strong>

                <span className="stat-description">
                  Procurement records analyzed
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-top">
                  <span>VENDORS MAPPED</span>
                  <b>04</b>
                </div>

                <strong className="stat-number">
                  486
                </strong>

                <span className="stat-description">
                  Participants represented in the network
                </span>

              </div>

            </section>


            {/* PRIORITY CASES */}

            <section className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    INVESTIGATION QUEUE
                  </span>

                  <h2>
                    Priority cases
                  </h2>

                </div>

                <button
                  className="panel-link"
                  onClick={() => setActivePage('investigations')}
                >
                  View all →
                </button>

              </div>


              <div className="case-table">

                <div className="table-row table-header">

                  <span className="case-column">
                    CASE
                  </span>

                  <span className="signal-column">
                    SIGNAL
                  </span>

                  <span className="department-column">
                    DEPARTMENT
                  </span>

                  <span className="value-column">
                    VALUE
                  </span>

                  <span className="priority-column">
                    PRIORITY
                  </span>

                </div>


                {cases.map((item) => (

                  <div
                    key={item.id}
                    className="table-row case-row"
                  >

                    <span className="case-column case-id">
                      {item.id}
                    </span>

                    <span className="signal-column">
                      {item.signal}
                    </span>

                    <span className="department-column">
                      {item.department}
                    </span>

                    <span className="value-column">
                      {item.value}
                    </span>

                    <span className="priority-column">

                      <b
                        className={`priority-badge ${
                          item.priority.toLowerCase()
                        }`}
                      >
                        {item.priority}
                      </b>

                    </span>

                  </div>

                ))}

              </div>

            </section>


            {/* LOWER PANELS */}

            <section className="lower-panels">

              <div className="dashboard-panel lower-panel">

                <div className="panel-header">

                  <div>

                    <span className="panel-label">
                      PROCUREMENT ACTIVITY
                    </span>

                    <h2>
                      Recent tenders
                    </h2>

                  </div>

                  <button
                    className="panel-link"
                    onClick={() => setActivePage('tenders')}
                  >
                    View all →
                  </button>

                </div>


                <div className="tender-list">

                  {tenders.map((tender) => (

                    <div
                      className="tender-item"
                      key={tender.id}
                    >

                      <div className="tender-id">
                        {tender.id}
                      </div>

                      <div className="tender-main">

                        <strong>
                          {tender.title}
                        </strong>

                        <span>
                          {tender.department}
                        </span>

                      </div>

                      <div className="tender-status">
                        {tender.status}
                      </div>

                    </div>

                  ))}

                </div>

              </div>


              <div className="dashboard-panel lower-panel">

                <div className="panel-header">

                  <div>

                    <span className="panel-label">
                      SIGNAL DISTRIBUTION
                    </span>

                    <h2>
                      Review signals
                    </h2>

                  </div>

                </div>


                <div className="signal-list">

                  <div className="signal-summary-item">

                    <div className="signal-summary-top">
                      <span>Award patterns</span>
                      <strong>38%</strong>
                    </div>

                    <div className="signal-bar">
                      <span style={{ width: '38%' }}></span>
                    </div>

                  </div>


                  <div className="signal-summary-item">

                    <div className="signal-summary-top">
                      <span>Bid pricing</span>
                      <strong>27%</strong>
                    </div>

                    <div className="signal-bar">
                      <span style={{ width: '27%' }}></span>
                    </div>

                  </div>


                  <div className="signal-summary-item">

                    <div className="signal-summary-top">
                      <span>Relationships</span>
                      <strong>21%</strong>
                    </div>

                    <div className="signal-bar">
                      <span style={{ width: '21%' }}></span>
                    </div>

                  </div>


                  <div className="signal-summary-item">

                    <div className="signal-summary-top">
                      <span>Participation</span>
                      <strong>14%</strong>
                    </div>

                    <div className="signal-bar">
                      <span style={{ width: '14%' }}></span>
                    </div>

                  </div>

                </div>


                <div className="signal-note">
                  Signals indicate activity deserving closer
                  review. They are not determinations of wrongdoing.
                </div>

              </div>

            </section>

          </div>

        )}


        {/* =========================
            INVESTIGATIONS VIEW
        ========================= */}

        {activePage === 'investigations' && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <div className="dashboard-eyebrow">
                  INVESTIGATION MANAGEMENT
                </div>

                <h1>
                  Investigations
                </h1>

                <p>
                  Review and prioritize procurement signals
                  requiring authorized investigation.
                </p>

              </div>

            </section>


            <section className="stats-grid">

              <div className="stat-card">

                <div className="stat-top">
                  <span>ACTIVE CASES</span>
                  <b>01</b>
                </div>

                <strong className="stat-number">
                  24
                </strong>

                <span className="stat-description">
                  Open investigation signals
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-top">
                  <span>HIGH PRIORITY</span>
                  <b>02</b>
                </div>

                <strong className="stat-number">
                  7
                </strong>

                <span className="stat-description">
                  Cases requiring closer review
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-top">
                  <span>UNDER REVIEW</span>
                  <b>03</b>
                </div>

                <strong className="stat-number">
                  11
                </strong>

                <span className="stat-description">
                  Cases currently being examined
                </span>

              </div>


              <div className="stat-card">

                <div className="stat-top">
                  <span>RECENTLY REVIEWED</span>
                  <b>04</b>
                </div>

                <strong className="stat-number">
                  38
                </strong>

                <span className="stat-description">
                  Signals reviewed this month
                </span>

              </div>

            </section>


            <section className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    INVESTIGATION QUEUE
                  </span>

                  <h2>
                    Active cases
                  </h2>

                </div>

              </div>


              <div className="case-table">

                <div className="table-row table-header">

                  <span className="case-column">
                    CASE
                  </span>

                  <span className="signal-column">
                    SIGNAL
                  </span>

                  <span className="department-column">
                    DEPARTMENT
                  </span>

                  <span className="value-column">
                    VALUE
                  </span>

                  <span className="priority-column">
                    PRIORITY
                  </span>

                </div>


                {cases.map((item) => (

                  <div
                    key={item.id}
                    className="table-row case-row"
                  >

                    <span className="case-column case-id">
                      {item.id}
                    </span>

                    <span className="signal-column">
                      {item.signal}
                    </span>

                    <span className="department-column">
                      {item.department}
                    </span>

                    <span className="value-column">
                      {item.value}
                    </span>

                    <span className="priority-column">

                      <b
                        className={`priority-badge ${
                          item.priority.toLowerCase()
                        }`}
                      >
                        {item.priority}
                      </b>

                    </span>

                  </div>

                ))}

              </div>

            </section>

          </div>

        )}


        {/* =========================
            TENDERS VIEW
        ========================= */}

        {activePage === 'tenders' && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <div className="dashboard-eyebrow">
                  PROCUREMENT ACTIVITY
                </div>

                <h1>
                  Tenders
                </h1>

                <p>
                  Review procurement tenders and their
                  associated activity.
                </p>

              </div>

              <button
                className="add-tender-button"
                onClick={handleAddTender}
              >
                <span>+</span>
                Add tender information
              </button>

            </section>


            <section className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    PROCUREMENT RECORDS
                  </span>

                  <h2>
                    Recent tenders
                  </h2>

                </div>

              </div>


              <div className="tender-list">

                {tenders.map((tender) => (

                  <div
                    className="tender-item tender-large"
                    key={tender.id}
                  >

                    <div className="tender-id">
                      {tender.id}
                    </div>

                    <div className="tender-main">

                      <strong>
                        {tender.title}
                      </strong>

                      <span>
                        {tender.department}
                      </span>

                    </div>

                    <div className="tender-status">
                      {tender.status}
                    </div>

                  </div>

                ))}

              </div>

            </section>

          </div>

        )}


        {/* =========================
            VENDORS VIEW
        ========================= */}

        {activePage === 'vendors' && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <div className="dashboard-eyebrow">
                  VENDOR INTELLIGENCE
                </div>

                <h1>
                  Vendors
                </h1>

                <p>
                  Review vendors and their procurement
                  participation patterns.
                </p>

              </div>

            </section>


            <section className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    VENDOR DIRECTORY
                  </span>

                  <h2>
                    Mapped vendors
                  </h2>

                </div>

              </div>


              <div className="vendor-list">

                {vendors.map((vendor) => (

                  <div
                    className="vendor-item"
                    key={vendor.id}
                  >

                    <div className="vendor-id">
                      {vendor.id}
                    </div>

                    <div className="vendor-main">

                      <strong>
                        {vendor.name}
                      </strong>

                      <span>
                        Procurement participant
                      </span>

                    </div>

                    <div className="vendor-stat">
                      <small>TENDERS</small>
                      <strong>{vendor.tenders}</strong>
                    </div>

                    <div className="vendor-stat">
                      <small>AWARDS</small>
                      <strong>{vendor.awards}</strong>
                    </div>

                    <div className="vendor-value">
                      {vendor.value}
                    </div>

                  </div>

                ))}

              </div>

            </section>

          </div>

        )}


        {/* =========================
            NETWORK VIEW
        ========================= */}

        {activePage === 'network' && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <div className="dashboard-eyebrow">
                  RELATIONSHIP ANALYSIS
                </div>

                <h1>
                  Procurement network
                </h1>

                <p>
                  Explore relationships between vendors,
                  tenders, departments, and contracts.
                </p>

              </div>

            </section>


            <section className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    ENTITY RELATIONSHIPS
                  </span>

                  <h2>
                    Network overview
                  </h2>

                </div>

              </div>


              <div className="dashboard-network">

                <div className="network-card network-tender">

                  <span className="network-icon">
                    T
                  </span>

                  <div>
                    <strong>Tenders</strong>
                    <small>1,284 records</small>
                  </div>

                </div>


                <div className="network-line line-one"></div>


                <div className="network-card network-vendor">

                  <span className="network-icon">
                    V
                  </span>

                  <div>
                    <strong>Vendors</strong>
                    <small>486 participants</small>
                  </div>

                </div>


                <div className="network-line line-two"></div>


                <div className="network-card network-contract">

                  <span className="network-icon">
                    C
                  </span>

                  <div>
                    <strong>Contracts</strong>
                    <small>842 awards</small>
                  </div>

                </div>


                <div className="network-line line-three"></div>


                <div className="network-card network-department">

                  <span className="network-icon">
                    D
                  </span>

                  <div>
                    <strong>Departments</strong>
                    <small>38 authorities</small>
                  </div>

                </div>


                <div className="network-center">

                  <span>
                    SIGNAL
                  </span>

                  <strong>
                    Relationship analysis
                  </strong>

                  <small>
                    Connected procurement activity
                  </small>

                </div>

              </div>


              <div className="network-note">
                Relationships provide investigative context and
                should be interpreted alongside procurement records
                and available evidence.
              </div>

            </section>

          </div>

        )}


        {/* =========================
            EVIDENCE VIEW
        ========================= */}

        {activePage === 'evidence' && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <div className="dashboard-eyebrow">
                  INVESTIGATION MATERIAL
                </div>

                <h1>
                  Evidence
                </h1>

                <p>
                  Review records and supporting material
                  associated with procurement signals.
                </p>

              </div>

            </section>


            <section className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    EVIDENCE REPOSITORY
                  </span>

                  <h2>
                    Available evidence
                  </h2>

                </div>

              </div>


              <div className="evidence-list">

                <div className="evidence-item">

                  <div className="evidence-icon">
                    DOC
                  </div>

                  <div className="evidence-main">

                    <strong>
                      Tender participation records
                    </strong>

                    <span>
                      Supporting records associated with
                      procurement participation.
                    </span>

                  </div>

                  <span className="evidence-count">
                    284 records
                  </span>

                </div>


                <div className="evidence-item">

                  <div className="evidence-icon">
                    BID
                  </div>

                  <div className="evidence-main">

                    <strong>
                      Bid pricing records
                    </strong>

                    <span>
                      Historical bid values and comparative
                      pricing information.
                    </span>

                  </div>

                  <span className="evidence-count">
                    1,920 records
                  </span>

                </div>


                <div className="evidence-item">

                  <div className="evidence-icon">
                    AWD
                  </div>

                  <div className="evidence-main">

                    <strong>
                      Award records
                    </strong>

                    <span>
                      Procurement awards and associated
                      contract information.
                    </span>

                  </div>

                  <span className="evidence-count">
                    842 records
                  </span>

                </div>


                <div className="evidence-item">

                  <div className="evidence-icon">
                    REL
                  </div>

                  <div className="evidence-main">

                    <strong>
                      Relationship records
                    </strong>

                    <span>
                      Links between procurement entities
                      identified during analysis.
                    </span>

                  </div>

                  <span className="evidence-count">
                    3,482 links
                  </span>

                </div>

              </div>

            </section>


            <section className="dashboard-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-label">
                    SIGNAL CATEGORIES
                  </span>

                  <h2>
                    Review signals
                  </h2>

                </div>

              </div>


              <div className="evidence-signal-list">

                {signals.map((signal) => (

                  <div
                    className="evidence-signal-item"
                    key={signal.type}
                  >

                    <div className="evidence-signal-main">

                      <strong>
                        {signal.type}
                      </strong>

                      <span>
                        {signal.description}
                      </span>

                    </div>

                    <span
                      className={`priority-badge ${
                        signal.priority.toLowerCase()
                      }`}
                    >
                      {signal.priority}
                    </span>

                    <span className="evidence-cases">
                      {signal.cases}
                    </span>

                  </div>

                ))}

              </div>

            </section>

          </div>

        )}

      </main>

    </div>
  )
}

export default Dashboard