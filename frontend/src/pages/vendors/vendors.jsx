import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import './vendors.css'

const API_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000'
  : 'https://vigilant-6sc2.vercel.app'

function Vendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 20

  useEffect(() => setPage(1), [search])

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ limit: String(LIMIT), skip: String((page - 1) * LIMIT) })
        if (search.trim()) params.set('search', search.trim())
        const response = await fetch(`${API_URL}/api/vendors?${params.toString()}`)
        if (!response.ok) throw new Error(`Vendor request failed: ${response.status}`)
        const data = await response.json()
        if (!cancelled) { setVendors(Array.isArray(data.items) ? data.items : []); setTotal(Number(data.total || 0)) }
      } catch (err) {
        console.error(err)
        if (!cancelled) { setVendors([]); setTotal(0) }
      } finally { if (!cancelled) setLoading(false) }
    }, 150)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [page, search])

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))
  const formatValue = (value) => { const n = Number(value || 0); return n >= 10000000 ? `Rs. ${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `Rs. ${(n / 100000).toFixed(2)} L` : `Rs. ${n.toLocaleString('en-IN')}` }

  const pages = totalPages <= 7 ? Array.from({length: totalPages}, (_, i) => i + 1) : page <= 4 ? [1,2,3,4,5,'...',totalPages] : page >= totalPages - 3 ? [1,'...',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages] : [1,'...',page-1,page,page+1,'...',totalPages]

  return <div className="vendors-page"><Sidebar /><main className="vendors-main"><Topbar activePage="vendors" /><div className="vendors-content">
    <section className="vendors-heading"><span>VENDOR INTELLIGENCE</span><h1>Vendors</h1><p>Review real procurement participants and their observed activity across the source dataset.</p></section>
    <section className="vendors-panel">
      <div className="vendors-panel-header"><div><span>VENDOR DIRECTORY</span><h2>Mapped vendors</h2></div><strong>{total.toLocaleString('en-IN')} vendors</strong></div>
      <div className="vendors-toolbar"><input placeholder="Search vendor or department..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      {loading ? <div className="vendors-state">Loading vendor records...</div> : vendors.length === 0 ? <div className="vendors-state">No vendor records found.</div> : <div className="vendors-table">
        <div className="vendors-table-head"><span>VENDOR</span><span>TENDERS</span><span>AWARDS</span><span>CONTRACT VALUE</span><span>HIGH PRIORITY</span><span>DEPARTMENTS</span></div>
        {vendors.map(v => <div className="vendors-table-row" key={v.name}><div><strong>{v.name}</strong><small>Procurement participant</small></div><b>{v.tenders}</b><b>{v.awards}</b><b>{formatValue(v.value)}</b><span className={v.highPriority > 0 ? 'vendor-alert' : 'vendor-normal'}>{v.highPriority}</span><div className="vendor-departments">{v.departments?.length ? v.departments.join(', ') : 'No department recorded'}</div></div>)}
      </div>}
      {!loading && total > 0 && <div className="vendor-pagination"><button disabled={page === 1} onClick={() => setPage(p => Math.max(1,p-1))}>Previous</button><div>{pages.map((p,i) => p === '...' ? <span key={`e-${i}`}>...</span> : <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>)}</div><button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages,p+1))}>Next</button></div>}
    </section>
    <div className="vendors-note"><b>Vendor activity is contextual evidence.</b><span>Participation, awards, and concentration should be reviewed alongside pricing, relationships, and underlying records.</span></div>
  </div></main></div>
}
export default Vendors
