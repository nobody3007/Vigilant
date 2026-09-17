import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const navigation = [
    { id: 'dashboard', number: '01', label: 'Dashboard', path: '/dashboard' },
    { id: 'investigations', number: '02', label: 'Investigations', path: '/investigations' },
    { id: 'tenders', number: '03', label: 'Tenders', path: '/tenders' },
    { id: 'vendors', number: '04', label: 'Vendors', path: '/vendors' },
    { id: 'network', number: '05', label: 'Network', path: '/network' },
    { id: 'evidence', number: '06', label: 'Evidence', path: '/evidence' },
  ]

  const getActivePage = () => {
    if (location.pathname === '/dashboard') return 'dashboard'
    if (location.pathname === '/investigations') return 'investigations'
    if (location.pathname === '/tenders') return 'tenders'
    if (location.pathname === '/network') return 'network'
    if (location.pathname === '/evidence') return 'evidence'
    if (location.pathname.startsWith('/case/')) return 'investigations'

    return ''
  }

  const activePage = getActivePage()

  const handleNavigation = (item) => {
    navigate(item.path)
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <img
          src="/vigilant_logo.png"
          alt="Vigilant"
          className="brand-logo"
        />

        <div className="brand-copy">
          <strong>VIGILANT</strong>
          <span>PROCUREMENT INTELLIGENCE</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section-label">
        INVESTIGATE
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${
              activePage === item.id ? 'nav-item-active' : ''
            }`}
            onClick={() => handleNavigation(item)}
          >
            <span className="nav-number">
              {item.number}
            </span>

            <span className="nav-label">
              {item.label}
            </span>

            {activePage === item.id && (
              <span className="nav-active-indicator" />
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">

        <div className="system-status">
          <span className="status-indicator" />

          <div>
            <strong>System operational</strong>
            <span>All services running</span>
          </div>
        </div>

        <button
          className="sidebar-footer"
          onClick={() => navigate('/')}
        >
          <span className="footer-arrow">&larr;</span>
          <span>Entry page</span>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar






