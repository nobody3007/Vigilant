import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'

import './tenders.css'

function Tenders() {
  const navigate = useNavigate()

  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const LIMIT = 10

  // Local backend during development,
  // deployed backend when running on Vercel.
  const API_URL = import.meta.env.DEV
    ? 'https://vigilant-6sc2.vercel.app'
    : 'https://vigilant-6sc2.vercel.app'

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams({
          limit: LIMIT,
          skip: (page - 1) * LIMIT,
        })

        if (search.trim()) {
          params.set('search', search.trim())
        }

        const response = await fetch(
          `${API_URL}/api/tenders?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch tenders: ${response.status}`)
        }

        const data = await response.json()

        if (!cancelled) {
          // Backend may return either an array
          // or { items: [...], total: ... }
          const items = Array.isArray(data)
            ? data
            : Array.isArray(data.items)
              ? data.items
              : []

          setTenders(items)

          setTotal(
            Number(
              data.total ??
              (Array.isArray(data) ? data.length : 0)
            )
          )
        }
      } catch (error) {
        console.error('Tenders API error:', error)

        if (!cancelled) {
          setTenders([])
          setTotal(0)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 200)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [page, search])

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  const getPriority = (score) => {
    const value = Number(score || 0)

    if (value >= 75) return 'High'
    if (value >= 50) return 'Medium'

    return 'Low'
  }

  const formatValue = (value) => {
    const number = Number(value || 0)

    if (number >= 10000000) {
      return `?${(number / 10000000).toFixed(2)} Cr`
    }

    if (number >= 100000) {
      return `?${(number / 100000).toFixed(2)} L`
    }

    return `?${number.toLocaleString('en-IN')}`
  }

  return (
    <div className="tenders-page">
      <Sidebar />

      <main className="tenders-main">
        <Topbar activePage="tenders" />

        <div className="tenders-content">

          <section className="tenders-heading">
            <span className="tenders-eyebrow">
              PROCUREMENT ACTIVITY
            </span>

            <h1>Tenders</h1>

            <p>
              Review procurement records and their associated investigation signals.
            </p>
          </section>

          <section className="tenders-panel">

            <div className="tenders-panel-header">
              <div>
                <span>PROCUREMENT RECORDS</span>
                <h2>All tenders</h2>
              </div>

              <div className="tenders-count">
                {total} records
              </div>
            </div>

            <div className="tenders-toolbar">
              <input
                type="text"
                placeholder="Search tender, vendor, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="tenders-state">
                Loading procurement records...
              </div>
            ) : tenders.length === 0 ? (
              <div className="tenders-state">
                No tender records found.
              </div>
            ) : (
              <div className="tenders-table">

                <div className="tenders-table-head">
                  <span>TENDER</span>
                  <span>DEPARTMENT</span>
                  <span>VENDOR</span>
                  <span>CONTRACT VALUE</span>
                  <span>SCORE</span>
                  <span>PRIORITY</span>
                </div>

                {tenders.map((tender) => {
                  const score = Number(
                    tender.investigation_priority || 0
                  )

                  const priority = getPriority(score)

                  return (
                    <button
                      className="tenders-table-row"
                      key={tender._id || tender.tenderId}
                      onClick={() =>
                        navigate(`/case/${tender.tenderId}`)
                      }
                    >
                      <div>
                        <strong>
                          {tender.tenderId}
                        </strong>

                        <small>
                          {tender.category} &middot; {tender.location}
                        </small>
                      </div>

                      <span>
                        {tender.department}
                      </span>

                      <span>
                        {tender.winningVendor}
                      </span>

                      <span>
                        {formatValue(tender.contractValue)}
                      </span>

                      <strong className="tender-score">
                        {score.toFixed(1)}
                      </strong>

                      <span
                        className={`tender-priority ${priority.toLowerCase()}`}
                      >
                        {priority}
                      </span>
                    </button>
                  )
                })}

              </div>
            )}

            <div className="tender-pagination">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
              >
                &larr; Previous
              </button>

              <div className="tender-page-numbers">

                {Array.from(
                  { length: Math.min(totalPages, 7) },
                  (_, index) => {
                    let pageNumber

                    if (totalPages <= 7) {
                      pageNumber = index + 1
                    } else if (page <= 4) {
                      pageNumber = index + 1
                    } else if (page >= totalPages - 3) {
                      pageNumber = totalPages - 6 + index
                    } else {
                      pageNumber = page - 3 + index
                    }

                    return (
                      <button
                        key={pageNumber}
                        className={
                          pageNumber === page
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          setPage(pageNumber)
                        }
                      >
                        {pageNumber}
                      </button>
                    )
                  }
                )}

              </div>

              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(totalPages, current + 1)
                  )
                }
              >
                Next &rarr;
              </button>

            </div>

          </section>

          <div className="tenders-disclaimer">

            <div className="tenders-disclaimer-icon">
              i
            </div>

            <div>

              <strong>
                Investigation support, not automated accusations.
              </strong>

              <span>
                Investigation Priority indicates records that may deserve
                closer review. It does not establish wrongdoing.
              </span>

            </div>

          </div>

        </div>
      </main>
    </div>
  )
}

export default Tenders
