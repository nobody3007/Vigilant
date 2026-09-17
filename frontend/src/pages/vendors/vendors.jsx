import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import './vendors.css'

function Vendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const LIMIT = 10

  // Use local FastAPI while developing.
  // Use deployed FastAPI for Vercel / other devices.
  const API_URL = import.meta.env.DEV
    ? 'https://vigilant-6sc2.vercel.app'
    : 'https://vigilant-6sc2.vercel.app'

  // Reset to first page when search changes
  useEffect(() => {
    setPage(1)
  }, [search])

  // Fetch vendors
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
          `${API_URL}/api/vendors?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error(
            `Failed to fetch vendors: ${response.status}`
          )
        }

        const data = await response.json()

        console.log('Vendors API response:', data)

        if (!cancelled) {
          const items = Array.isArray(data)
            ? data
            : Array.isArray(data.items)
              ? data.items
              : []

          setVendors(items)

          const totalCount = Array.isArray(data)
            ? data.length
            : Number(data.total ?? items.length)

          setTotal(totalCount)
        }
      } catch (error) {
        console.error('Vendors API error:', error)

        if (!cancelled) {
          setVendors([])
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

  const totalPages = Math.max(
    1,
    Math.ceil(total / LIMIT)
  )

  const formatValue = (value) => {
    const number = Number(value || 0)

    if (number >= 10000000) {
      return `?${(
        number / 10000000
      ).toFixed(2)} Cr`
    }

    if (number >= 100000) {
      return `?${(
        number / 100000
      ).toFixed(2)} L`
    }

    return `?${number.toLocaleString('en-IN')}`
  }

  return (
    <div className="vendors-page">

      <Sidebar />

      <main className="vendors-main">

        <Topbar activePage="vendors" />

        <div className="vendors-content">

          {/* PAGE HEADING */}
          <section className="vendors-heading">

            <div>

              <span className="vendors-eyebrow">
                VENDOR INTELLIGENCE
              </span>

              <h1>
                Vendors
              </h1>

              <p>
                Review procurement participants and
                their observed activity across analyzed
                tenders.
              </p>

            </div>

          </section>


          {/* VENDOR PANEL */}
          <section className="vendors-panel">

            {/* HEADER */}
            <div className="vendors-panel-header">

              <div>

                <span>
                  VENDOR DIRECTORY
                </span>

                <h2>
                  Mapped vendors
                </h2>

              </div>

              <div className="vendors-count">
                {total} vendors
              </div>

            </div>


            {/* SEARCH */}
            <div className="vendors-toolbar">

              <input
                type="text"
                placeholder="Search vendor or department..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            {/* LOADING */}
            {loading ? (

              <div className="vendors-state">
                Loading vendor records...
              </div>

            ) : vendors.length === 0 ? (

              /* EMPTY */
              <div className="vendors-state">
                No vendors found.
              </div>

            ) : (

              /* TABLE */
              <div className="vendors-table">

                {/* TABLE HEADER */}
                <div className="vendors-table-head">

                  <span>
                    VENDOR
                  </span>

                  <span>
                    TENDERS
                  </span>

                  <span>
                    AWARDS
                  </span>

                  <span>
                    CONTRACT VALUE
                  </span>

                  <span>
                    HIGH PRIORITY
                  </span>

                  <span>
                    DEPARTMENTS
                  </span>

                </div>


                {/* TABLE ROWS */}
                {vendors.map((vendor, index) => (

                  <div
                    className="vendors-table-row"
                    key={
                      vendor.name ||
                      vendor.vendor ||
                      index
                    }
                  >

                    {/* VENDOR */}
                    <div>

                      <strong>
                        {vendor.name ||
                          vendor.vendor ||
                          'Unknown vendor'}
                      </strong>

                      <small>
                        Procurement participant
                      </small>

                    </div>


                    {/* TENDERS */}
                    <strong>
                      {vendor.tenders ?? 0}
                    </strong>


                    {/* AWARDS */}
                    <strong>
                      {vendor.awards ?? 0}
                    </strong>


                    {/* VALUE */}
                    <strong>
                      {formatValue(
                        vendor.value ??
                        vendor.contractValue ??
                        0
                      )}
                    </strong>


                    {/* HIGH PRIORITY */}
                    <span
                      className={
                        Number(
                          vendor.highPriority || 0
                        ) > 0
                          ? 'vendor-alert'
                          : 'vendor-normal'
                      }
                    >
                      {vendor.highPriority ?? 0}
                    </span>


                    {/* DEPARTMENTS */}
                    <div className="vendor-departments">

                      {Array.isArray(
                        vendor.departments
                      ) &&
                      vendor.departments.length > 0
                        ? vendor.departments.join(', ')
                        : '—'}

                    </div>

                  </div>

                ))}

              </div>

            )}


            {/* PAGINATION */}
            <div className="vendor-pagination">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(
                      1,
                      current - 1
                    )
                  )
                }
              >
                &larr; Previous
              </button>


              <div className="vendor-page-numbers">

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
                        totalPages -
                        6 +
                        index

                    } else {

                      pageNumber =
                        page -
                        3 +
                        index

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

          </section>


          {/* DISCLAIMER */}
          <div className="vendors-disclaimer">

            <div className="vendors-disclaimer-icon">
              i
            </div>

            <div>

              <strong>
                Vendor activity is contextual evidence.
              </strong>

              <span>
                Participation, awards, or concentration
                alone do not establish wrongdoing and
                should be reviewed alongside other evidence.
              </span>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Vendors

