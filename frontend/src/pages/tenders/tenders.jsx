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

  // Show 20 tenders on each page
  const LIMIT = 20

  // Local backend during development,
  // deployed backend when running the Vercel site.
  const API_URL = import.meta.env.DEV
    ? 'http://127.0.0.1:8000'
    : 'https://vigilant-6sc2.vercel.app'

  // Reset to page 1 whenever the search changes
  useEffect(() => {
    setPage(1)
  }, [search])

  // Fetch tenders
  useEffect(() => {
    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams({
          limit: String(LIMIT),
          skip: String((page - 1) * LIMIT),
        })

        if (search.trim()) {
          params.set('search', search.trim())
        }

        const response = await fetch(
          `${API_URL}/api/tenders?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error(
            `Failed to fetch tenders: ${response.status}`
          )
        }

        const data = await response.json()

        if (!cancelled) {
          // Backend returns:
          // {
          //   items: [...],
          //   total: number
          // }

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

  // Total number of pages
  const totalPages = Math.max(
    1,
    Math.ceil(total / LIMIT)
  )

  const getPriority = (score) => {
    const value = Number(score || 0)

    if (value >= 75) {
      return 'High'
    }

    if (value >= 50) {
      return 'Medium'
    }

    return 'Low'
  }

  const formatValue = (value) => {
    const number = Number(value || 0)

    if (number >= 10000000) {
    return `Rs. ${(number / 10000000).toFixed(2)} Cr`
    }

    if (number >= 100000) {
  return `Rs. ${(number / 100000).toFixed(2)} L`
    }

    return `Rs. ${number.toLocaleString('en-IN')}`
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }

      return pages
    }

    // Beginning
    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }

    // End
    if (page >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }

    // Middle
    return [
      1,
      '...',
      page - 1,
      page,
      page + 1,
      '...',
      totalPages,
    ]
  }

  return (
    <div className="tenders-page">
      <Sidebar />

      <main className="tenders-main">
        <Topbar activePage="tenders" />

        <div className="tenders-content">

          {/* PAGE HEADER */}
          <section className="tenders-heading">
            <span className="tenders-eyebrow">
              PROCUREMENT ACTIVITY
            </span>

            <h1>Tenders</h1>

            <p>
              Review procurement records and their associated
              investigation signals.
            </p>
          </section>

          {/* TENDERS PANEL */}
          <section className="tenders-panel">

            {/* PANEL HEADER */}
            <div className="tenders-panel-header">
              <div>
                <span>PROCUREMENT RECORDS</span>

                <h2>All tenders</h2>
              </div>

              <div className="tenders-count">
                {total} records
              </div>
            </div>

            {/* SEARCH */}
            <div className="tenders-toolbar">
              <input
                type="text"
                placeholder="Search tender, vendor, department..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="tenders-state">
                Loading procurement records...
              </div>
            ) : tenders.length === 0 ? (
              /* EMPTY */
              <div className="tenders-state">
                No tender records found.
              </div>
            ) : (
              /* TABLE */
              <div className="tenders-table">

                {/* TABLE HEADER */}
                <div className="tenders-table-head">
                  <span>TENDER</span>

                  <span>DEPARTMENT</span>

                  <span>VENDOR</span>

                  <span>CONTRACT VALUE</span>

                  <span>PRIORITY SCORE</span>

                  <span>PRIORITY</span>
                </div>

                {/* TABLE ROWS */}
                {tenders.map((tender) => {

                  const score = Number(
                    tender.investigation_priority || 0
                  )

                  const priority = getPriority(score)

                  return (
                    <button
                      className="tenders-table-row"
                      key={
                        tender._id ||
                        tender.tenderId
                      }
                      onClick={() =>
                        navigate(
                          `/case/${tender.tenderId}`
                        )
                      }
                    >

                      {/* TENDER */}
                      <div>
                        <strong>
                          {tender.tenderId}
                        </strong>

                        <small>
                          {tender.category}
                          {' · '}
                          {tender.location}
                        </small>
                      </div>

                      {/* DEPARTMENT */}
                      <span>
                        {tender.department}
                      </span>

                      {/* VENDOR */}
                      <span>
                        {tender.winningVendor}
                      </span>

                      {/* CONTRACT VALUE */}
                      <span>
                        {formatValue(
                          tender.contractValue
                        )}
                      </span>

                      {/* SCORE */}
                      <strong className="tender-score">
                        {score.toFixed(2)}
                      </strong>

                      {/* PRIORITY */}
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

            {/* PAGINATION */}
            {!loading && total > 0 && (
              <div className="tender-pagination">

                {/* PREVIOUS */}
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                >
                  &larr; Previous
                </button>

                {/* PAGE NUMBERS */}
                <div className="tender-page-numbers">

                  {getPageNumbers().map(
                    (pageNumber, index) => {

                      // Ellipsis
                      if (pageNumber === '...') {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="pagination-ellipsis"
                          >
                            ...
                          </span>
                        )
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

                {/* NEXT */}
                <button
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                    )
                  }
                >
                  Next &rarr;
                </button>

              </div>
            )}

          </section>

          {/* DISCLAIMER */}
          <div className="tenders-disclaimer">

            <div className="tenders-disclaimer-icon">
              i
            </div>

            <div>

              <strong>
                Investigation support, not automated accusations.
              </strong>

              <span>
                Investigation Priority indicates records that may
                deserve closer review. It does not establish
                wrongdoing.
              </span>

            </div>

          </div>

        </div>
      </main>
    </div>
  )
}

export default Tenders