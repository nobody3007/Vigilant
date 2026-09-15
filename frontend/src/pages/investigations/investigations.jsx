import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import PriorityBadge from '../../components/PriorityBadge'
import { cases } from '../../data/mockData'

import './investigations.css'

function Investigations() {
  const navigate = useNavigate()

  const [activePage, setActivePage] = useState('investigations')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('score')

  const handleNavigation = (page) => {
    if (page === 'dashboard') {
      navigate('/dashboard')
      return
    }

    if (page === 'network') {
      navigate('/network')
      return
    }

    if (page === 'tenders') {
      setActivePage('tenders')
      return
    }

    if (page === 'vendors') {
      setActivePage('vendors')
      return
    }

    if (page === 'evidence') {
      setActivePage('evidence')
      return
    }

    if (page === 'investigations') {
      setActivePage('investigations')
    }
  }

  const filteredCases = useMemo(() => {
    let result = [...cases]

    if (filter !== 'all') {
      result = result.filter(
        (item) =>
          item.priority?.toLowerCase() === filter.toLowerCase()
      )
    }

    if (search.trim()) {
      const query = search.toLowerCase()

      result = result.filter((item) => {
        return (
          item.id?.toLowerCase().includes(query) ||
          item.signal?.toLowerCase().includes(query) ||
          item.department?.toLowerCase().includes(query) ||
          item.vendor?.toLowerCase().includes(query)
        )
      })
    }

    if (sortBy === 'score') {
      result.sort((a, b) => (b.score || 0) - (a.score || 0))
    }

    if (sortBy === 'value') {
      const getNumber = (value) =>
        Number(String(value || '').replace(/[^\d.]/g, '')) || 0

      result.sort(
        (a, b) => getNumber(b.value) - getNumber(a.value)
      )
    }

    if (sortBy === 'priority') {
      const order = {
        high: 3,
        medium: 2,
        low: 1,
      }

      result.sort(
        (a, b) =>
          (order[b.priority?.toLowerCase()] || 0) -
          (order[a.priority?.toLowerCase()] || 0)
      )
    }

    return result
  }, [filter, search, sortBy])

  const highCount = cases.filter(
    (item) => item.priority?.toLowerCase() === 'high'
  ).length

  const mediumCount = cases.filter(
    (item) => item.priority?.toLowerCase() === 'medium'
  ).length

  const lowCount = cases.filter(
    (item) => item.priority?.toLowerCase() === 'low'
  ).length

  return (
    <div className="investigations-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigation}
      />

      <main className="investigations-main">
        <Topbar
          activePage={activePage}
          onAddTender={() => navigate('/add-tender')}
        />

        <div className="investigations-content">

          <div className="investigations-header">
            <div>
              <div className="page-kicker">
                INVESTIGATION WORKSPACE
              </div>

              <h1>Priority Queue</h1>

              <p>
                Review procurement cases ranked by investigation priority
                and supporting signals.
              </p>
            </div>

            <div className="queue-status">
              <span className="status-dot"></span>
              LIVE QUEUE
            </div>
          </div>

          <div className="queue-stats">

            <div className="queue-stat-card">
              <div className="queue-stat-label">
                TOTAL CASES
              </div>

              <div className="queue-stat-value">
                {cases.length}
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
                {highCount}
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
                {mediumCount}
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
                {lowCount}
              </div>

              <div className="queue-stat-note">
                Lower investigation urgency
              </div>
            </div>

          </div>

          <section className="queue-panel">

            <div className="queue-toolbar">

              <div className="queue-search">
                <span className="search-icon">⌕</span>

                <input
                  type="text"
                  placeholder="Search case ID, signal, department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>

                  <button
                    className={
                      filter === 'high'
                        ? 'filter-btn high active'
                        : 'filter-btn high'
                    }
                    onClick={() => setFilter('high')}
                  >
                    High
                  </button>

                  <button
                    className={
                      filter === 'medium'
                        ? 'filter-btn medium active'
                        : 'filter-btn medium'
                    }
                    onClick={() => setFilter('medium')}
                  >
                    Medium
                  </button>

                  <button
                    className={
                      filter === 'low'
                        ? 'filter-btn low active'
                        : 'filter-btn low'
                    }
                    onClick={() => setFilter('low')}
                  >
                    Low
                  </button>
                </div>

                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="score">Sort: Risk Score</option>
                  <option value="priority">Sort: Priority</option>
                  <option value="value">Sort: Contract Value</option>
                </select>

              </div>

            </div>

            <div className="queue-summary">
              <span>
                Showing <strong>{filteredCases.length}</strong> of{' '}
                <strong>{cases.length}</strong> investigations
              </span>

              <span className="queue-summary-right">
                Ranked by investigation priority
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

              {filteredCases.length > 0 ? (
                filteredCases.map((caseData) => (
                  <button
                    className="investigation-row"
                    key={caseData.id}
                    onClick={() =>
                      navigate(`/case/${caseData.id}`)
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

                      <span>/100</span>
                    </div>

                    <div className="investigation-value">
                      {caseData.value}
                    </div>

                    <div className="investigation-priority">
                      <PriorityBadge
                        priority={caseData.priority}
                      />
                    </div>

                    <div className="investigation-arrow">
                      →
                    </div>

                  </button>
                ))
              ) : (
                <div className="empty-queue">
                  <div className="empty-icon">⌕</div>

                  <h3>No investigations found</h3>

                  <p>
                    Try changing the priority filter or search term.
                  </p>
                </div>
              )}

            </div>

          </section>

          <div className="investigation-note">
            <div className="note-icon">i</div>

            <div>
              <strong>
                Investigation priority is not a finding.
              </strong>

              <span>
                Scores indicate cases that may warrant closer review.
                An anomaly alone does not establish wrongdoing.
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Investigations