import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import PriorityBadge from '../../components/PriorityBadge'

import './investigations.css'

function Investigations() {
  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('score')

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const [stats, setStats] = useState({
    high: 0,
    medium: 0,
    low: 0,
    total: 0,
  })

  const [loading, setLoading] = useState(true)

  const LIMIT = 10

  useEffect(() => {
    setPage(1)
  }, [filter, search, sortBy])

  useEffect(() => {
    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams()

        params.set('limit', LIMIT)
        params.set(
          'skip',
          (page - 1) * LIMIT
        )

        if (filter !== 'all') {
          params.set('priority', filter)
        }

        if (search.trim()) {
          params.set('search', search.trim())
        }

        params.set('sortBy', sortBy)

        const response = await fetch(
          `https://vigilant-6sc2.vercel.app/api/investigations?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error(
            'Failed to fetch investigations'
          )
        }

        const data = await response.json()

        if (!cancelled) {
          setCases(
            Array.isArray(data.items)
              ? data.items
              : []
          )

          setTotal(
            Number(data.total || 0)
          )

          setStats(
            data.stats || {
              high: 0,
              medium: 0,
              low: 0,
              total: 0,
            }
          )
        }
      } catch (error) {
        console.error(
          'Investigations error:',
          error
        )

        if (!cancelled) {
          setCases([])
          setTotal(0)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 250)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [
    page,
    filter,
    search,
    sortBy,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(total / LIMIT)
  )

  const handleNavigation = (pageName) => {
    if (pageName === 'dashboard') {
      navigate('/dashboard')
      return
    }

    if (pageName === 'network') {
      navigate('/network')
      return
    }

    if (pageName === 'evidence') {
      navigate('/evidence')
      return
    }
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
    <div className="investigations-layout">

      <Sidebar
        activePage="investigations"
        onNavigate={handleNavigation}
      />

      <main className="investigations-main">

        <Topbar
          activePage="investigations"
          onAddTender={() =>
            navigate('/add-tender')
          }
        />

        <div className="investigations-content">

          {/* HEADER */}

          <div className="investigations-header">

            <div>

              <div className="page-kicker">
                INVESTIGATION WORKSPACE
              </div>

              <h1>
                Priority Queue
              </h1>

              <p>
                Review procurement cases ranked by
                investigation priority and supporting
                signals.
              </p>

            </div>

            <div className="queue-status">
              <span className="status-dot" />
              LIVE QUEUE
            </div>

          </div>


          {/* STATS */}

          <div className="queue-stats">

            <div className="queue-stat-card">

              <div className="queue-stat-label">
                TOTAL CASES
              </div>

              <div className="queue-stat-value">
                {stats.total}
              </div>

              <div className="queue-stat-note">
                Requiring review
              </div>

            </div>


            <div className="queue-stat-card high-card">

              <div className="queue-stat-label">
                HIGH PRIORITY
              </div>

              <div className="queue-stat-value">
                {stats.high}
              </div>

              <div className="queue-stat-note">
                Immediate attention
              </div>

            </div>


            <div className="queue-stat-card medium-card">

              <div className="queue-stat-label">
                MEDIUM PRIORITY
              </div>

              <div className="queue-stat-value">
                {stats.medium}
              </div>

              <div className="queue-stat-note">
                Requires review
              </div>

            </div>


            <div className="queue-stat-card low-card">

              <div className="queue-stat-label">
                LOW PRIORITY
              </div>

              <div className="queue-stat-value">
                {stats.low}
              </div>

              <div className="queue-stat-note">
                Lower investigation urgency
              </div>

            </div>

          </div>


          {/* QUEUE */}

          <section className="queue-panel">

            <div className="queue-toolbar">

              <div className="queue-search">

                <span className="search-icon">
                  ?
                </span>

                <input
                  type="text"
                  placeholder="Search case ID, signal, department..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              <div className="queue-controls">

                <div className="filter-group">

                  <button
                    className={
                      filter === 'all'
                        ? 'filter-btn active'
                        : 'filter-btn'
                    }
                    onClick={() =>
                      setFilter('all')
                    }
                  >
                    All
                  </button>

                  <button
                    className={
                      filter === 'high'
                        ? 'filter-btn high active'
                        : 'filter-btn high'
                    }
                    onClick={() =>
                      setFilter('high')
                    }
                  >
                    High
                  </button>

                  <button
                    className={
                      filter === 'medium'
                        ? 'filter-btn medium active'
                        : 'filter-btn medium'
                    }
                    onClick={() =>
                      setFilter('medium')
                    }
                  >
                    Medium
                  </button>

                  <button
                    className={
                      filter === 'low'
                        ? 'filter-btn low active'
                        : 'filter-btn low'
                    }
                    onClick={() =>
                      setFilter('low')
                    }
                  >
                    Low
                  </button>

                </div>


                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                >
                  <option value="score">
                    Sort: Risk Score
                  </option>

                  <option value="priority">
                    Sort: Priority
                  </option>

                  <option value="value">
                    Sort: Contract Value
                  </option>

                </select>

              </div>

            </div>


            <div className="queue-summary">

              <span>
                Showing{' '}
                <strong>
                  {cases.length}
                </strong>{' '}
                of{' '}
                <strong>
                  {total}
                </strong>{' '}
                investigations
              </span>

              <span className="queue-summary-right">
                Page {page} of {totalPages}
              </span>

            </div>


            <div className="case-table">

              <div className="case-table-header">
                <div>CASE</div>
                <div>PRIMARY SIGNAL</div>
                <div>RISK SCORE</div>
                <div>VALUE</div>
                <div>PRIORITY</div>
                <div></div>
              </div>


              {loading ? (

                <div className="empty-queue">

                  <h3>
                    Loading investigations...
                  </h3>

                  <p>
                    Fetching the next 10 cases.
                  </p>

                </div>

              ) : cases.length > 0 ? (

                cases.map((caseData) => (

                  <button
                    className="investigation-row"
                    key={caseData.id}
                    onClick={() =>
                      navigate(
                        `/case/${caseData.id}`
                      )
                    }
                  >

                    <div className="investigation-case">

                      <span className="investigation-case-id">
                        {caseData.id}
                      </span>

                      <span className="investigation-department">
                        {caseData.department}
                      </span>

                    </div>


                    <div className="investigation-signal">

                      <strong>
                        {caseData.signal}
                      </strong>

                      <span>
                        Procurement anomaly detected
                      </span>

                    </div>


                    <div className="investigation-score">

                      <strong>
                        {caseData.score}
                      </strong>

                      <span>
                        /100
                      </span>

                    </div>


                    <div className="investigation-value">
                      {formatValue(
                        caseData.value
                      )}
                    </div>


                    <div className="investigation-priority">

                      <PriorityBadge
                        priority={
                          caseData.priority
                        }
                      />

                    </div>


                    <div className="investigation-arrow">
                      ?
                    </div>

                  </button>

                ))

              ) : (

                <div className="empty-queue">

                  <div className="empty-icon">
                    ?
                  </div>

                  <h3>
                    No investigations found
                  </h3>

                  <p>
                    Try changing the priority
                    filter or search term.
                  </p>

                </div>

              )}

            </div>


            {/* PAGINATION */}

            <div className="investigation-pagination">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(1, current - 1)
                  )
                }
              >
                ? Previous
              </button>


              <div className="pagination-pages">

                {Array.from(
                  {
                    length: Math.min(
                      totalPages,
                      7
                    ),
                  },
                  (_, index) => {

                    let pageNumber

                    if (totalPages <= 7) {
                      pageNumber =
                        index + 1
                    } else if (page <= 4) {
                      pageNumber =
                        index + 1
                    } else if (
                      page >=
                      totalPages - 3
                    ) {
                      pageNumber =
                        totalPages - 6 + index
                    } else {
                      pageNumber =
                        page - 3 + index
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
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                  )
                }
              >
                Next ?
              </button>

            </div>

          </section>


          <div className="investigation-note">

            <div className="note-icon">
              i
            </div>

            <div>

              <strong>
                Investigation priority is not a finding.
              </strong>

              <span>
                Scores indicate cases that may warrant
                closer review. An anomaly alone does not
                establish wrongdoing.
              </span>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Investigations




