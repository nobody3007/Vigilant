import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import './evidence.css'

const API_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000'
  : 'https://vigilant-6sc2.vercel.app'

function Evidence() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
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
        const params = new URLSearchParams({limit:String(LIMIT),skip:String((page-1)*LIMIT)})
        if (search.trim()) params.set('search', search.trim())
        const response = await fetch(`${API_URL}/api/evidence?${params.toString()}`)
        if (!response.ok) throw new Error(`Evidence request failed: ${response.status}`)
        const data = await response.json()
        if (!cancelled) { setItems(Array.isArray(data.items) ? data.items : []); setTotal(Number(data.total || 0)) }
      } catch(err) { console.error(err); if(!cancelled){setItems([]);setTotal(0)} }
      finally { if(!cancelled) setLoading(false) }
    },150)
    return () => {cancelled=true;clearTimeout(timer)}
  },[page,search])

  const totalPages=Math.max(1,Math.ceil(total/LIMIT))
  const pages=totalPages<=7?Array.from({length:totalPages},(_,i)=>i+1):page<=4?[1,2,3,4,5,'...',totalPages]:page>=totalPages-3?[1,'...',totalPages-4,totalPages-3,totalPages-2,totalPages-1,totalPages]:[1,'...',page-1,page,page+1,'...',totalPages]
  const value=(item)=>item.unit?`${Number(item.value).toFixed(2)} ${item.unit}`:Number(item.value||0).toFixed(2)

  return <div className="evidence-page"><Sidebar/><main className="evidence-main"><Topbar activePage="evidence"/><div className="evidence-content">
    <section className="evidence-heading"><span>EVIDENCE REPOSITORY</span><h1>Evidence</h1><p>Trace investigation signals back to the underlying procurement features and source records.</p></section>
    <section className="evidence-panel">
      <div className="evidence-panel-header"><div><span>PROCUREMENT EVIDENCE</span><h2>Review evidence</h2></div><strong>{total.toLocaleString('en-IN')} evidence items</strong></div>
      <div className="evidence-toolbar"><input placeholder="Search tender, vendor, or signal..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      {loading?<div className="evidence-state">Loading evidence...</div>:items.length===0?<div className="evidence-state">No evidence records found.</div>:<div className="evidence-list">{items.map(item=><button className="evidence-row" key={item.id} onClick={()=>navigate(`/case/${item.tenderId}`)}><div><strong>{item.signal}</strong><small>{item.tenderId} · {item.vendor}</small></div><div><span>RAW FIELD</span><b>{item.field || 'Derived signal'}</b></div><div><span>OBSERVED</span><b>{value(item)}</b></div><div><span>PRIORITY</span><em className={`badge ${String(item.priority).toLowerCase()}`}>{item.priority}</em></div><p>{item.interpretation}</p></button>)}</div>}
      {!loading&&total>0&&<div className="evidence-pagination"><button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button><div>{pages.map((p,i)=>p==='...'?<span key={`e-${i}`}>...</span>:<button key={p} className={p===page?'active':''} onClick={()=>setPage(p)}>{p}</button>)}</div><button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button></div>}
    </section>
    <div className="evidence-note"><b>Evidence supports investigation; it does not establish wrongdoing.</b><span>Observed values and derived signals should be interpreted in context and reviewed by an authorized investigator.</span></div>
  </div></main></div>
}
export default Evidence
