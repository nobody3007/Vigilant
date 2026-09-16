import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position, 
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './network.css'

const graphNodes = [
  {
    id: 'vendor-apex',
    type: 'vendor',
    position: { x: 80, y: 210 },
    data: {
      label: 'Apex Infrastructure Ltd.',
      id: 'VND-00482',
      type: 'VENDOR',
      meta: '7 awards · ₹42.6 Cr',
      risk: 'HIGH',
    },
  },
  {
    id: 'vendor-build',
    type: 'vendor',
    position: { x: 80, y: 430 },
    data: {
      label: 'BuildRight Contractors',
      id: 'VND-00317',
      type: 'VENDOR',
      meta: '5 awards · ₹28.1 Cr',
      risk: 'MEDIUM',
    },
  },
  {
    id: 'tender-road',
    type: 'tender',
    position: { x: 410, y: 120 },
    data: {
      label: 'Road Infrastructure Package',
      id: 'TDR-10842',
      type: 'TENDER',
      meta: '₹18.4 Cr',
      risk: 'HIGH',
    },
  },
  {
    id: 'tender-highway',
    type: 'tender',
    position: { x: 410, y: 370 },
    data: {
      label: 'Highway Maintenance Package',
      id: 'TDR-10791',
      type: 'TENDER',
      meta: '₹11.7 Cr',
      risk: 'MEDIUM',
    },
  },
  {
    id: 'department-public',
    type: 'department',
    position: { x: 770, y: 120 },
    data: {
      label: 'Public Works',
      id: 'DEPT-014',
      type: 'DEPARTMENT',
      meta: 'Central Region',
      risk: '—',
    },
  },
  {
    id: 'vendor-eastern',
    type: 'vendor',
    position: { x: 770, y: 370 },
    data: {
      label: 'Eastern Infra Systems',
      id: 'VND-00182',
      type: 'VENDOR',
      meta: '4 awards · ₹19.4 Cr',
      risk: 'MEDIUM',
    },
  },
  {
    id: 'contract-road',
    type: 'contract',
    position: { x: 1080, y: 120 },
    data: {
      label: 'Road Infrastructure Contract',
      id: 'CTR-00981',
      type: 'CONTRACT',
      meta: '₹18.4 Cr',
      risk: 'HIGH',
    },
  },
  {
    id: 'location-central',
    type: 'location',
    position: { x: 1080, y: 370 },
    data: {
      label: 'Central Region',
      id: 'LOC-021',
      type: 'LOCATION',
      meta: '12 related tenders',
      risk: '—',
    },
  },
]

const graphEdges = [
  {
    id: 'e1',
    source: 'vendor-apex',
    target: 'tender-road',
    label: 'WON',
    type: 'smoothstep',
    animated: true,
  },
  {
    id: 'e2',
    source: 'vendor-apex',
    target: 'tender-highway',
    label: 'PARTICIPATED',
    type: 'smoothstep',
  },
  {
    id: 'e3',
    source: 'vendor-build',
    target: 'tender-road',
    label: 'PARTICIPATED',
    type: 'smoothstep',
  },
  {
    id: 'e4',
    source: 'vendor-build',
    target: 'tender-highway',
    label: 'WON',
    type: 'smoothstep',
  },
  {
    id: 'e5',
    source: 'tender-road',
    target: 'department-public',
    label: 'AWARDED BY',
    type: 'smoothstep',
  },
  {
    id: 'e6',
    source: 'tender-highway',
    target: 'department-public',
    label: 'AWARDED BY',
    type: 'smoothstep',
  },
  {
    id: 'e7',
    source: 'department-public',
    target: 'contract-road',
    label: 'CONTRACT',
    type: 'smoothstep',
  },
  {
    id: 'e8',
    source: 'contract-road',
    target: 'location-central',
    label: 'LOCATED IN',
    type: 'smoothstep',
  },
  {
    id: 'e9',
    source: 'vendor-eastern',
    target: 'tender-highway',
    label: 'PARTICIPATED',
    type: 'smoothstep',
  },
  {
    id: 'e10',
    source: 'vendor-eastern',
    target: 'vendor-apex',
    label: 'REPEATED INTERACTION',
    type: 'smoothstep',
  },
]

function VendorNode({ data }) {
  return (
    <div className={`graph-node graph-vendor ${data.risk === 'HIGH' ? 'node-high' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <span className="node-type">{data.type}</span>
      <strong>{data.label}</strong>
      <span className="node-id">{data.id}</span>

      <div className="node-meta">
        <span>{data.meta}</span>
        {data.risk !== '—' && (
          <b className={`node-risk ${data.risk.toLowerCase()}`}>
            {data.risk}
          </b>
        )}
      </div>
    </div>
  )
}

function TenderNode({ data }) {
  return (
    <div className={`graph-node graph-tender ${data.risk === 'HIGH' ? 'node-high' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <span className="node-type">{data.type}</span>
      <strong>{data.label}</strong>
      <span className="node-id">{data.id}</span>

      <div className="node-meta">
        <span>{data.meta}</span>
        <b className={`node-risk ${data.risk.toLowerCase()}`}>
          {data.risk}
        </b>
      </div>
    </div>
  )
}

function DepartmentNode({ data }) {
  return (
    <div className="graph-node graph-department">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <span className="node-type">{data.type}</span>
      <strong>{data.label}</strong>
      <span className="node-id">{data.id}</span>

      <div className="node-meta">
        <span>{data.meta}</span>
      </div>
    </div>
  )
}

function ContractNode({ data }) {
  return (
    <div className="graph-node graph-contract">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <span className="node-type">{data.type}</span>
      <strong>{data.label}</strong>
      <span className="node-id">{data.id}</span>

      <div className="node-meta">
        <span>{data.meta}</span>
        <b className="node-risk high">HIGH</b>
      </div>
    </div>
  )
}

function LocationNode({ data }) {
  return (
    <div className="graph-node graph-location">
      <Handle type="target" position={Position.Left} />

      <span className="node-type">{data.type}</span>
      <strong>{data.label}</strong>
      <span className="node-id">{data.id}</span>

      <div className="node-meta">
        <span>{data.meta}</span>
      </div>
    </div>
  )
}

function Network() {
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode] = useState(null)
  const [search, setSearch] = useState('')

  const nodeTypes = useMemo(
    () => ({
      vendor: VendorNode,
      tender: TenderNode,
      department: DepartmentNode,
      contract: ContractNode,
      location: LocationNode,
    }),
    []
  )

  const filteredNodes = useMemo(() => {
    if (!search.trim()) return graphNodes

    const query = search.toLowerCase()

    return graphNodes.filter((node) => {
      return (
        node.data.label.toLowerCase().includes(query) ||
        node.data.id.toLowerCase().includes(query) ||
        node.data.type.toLowerCase().includes(query)
      )
    })
  }, [search])

  const filteredNodeIds = new Set(filteredNodes.map((node) => node.id))

  const filteredEdges = useMemo(() => {
    if (!search.trim()) return graphEdges

    return graphEdges.filter(
      (edge) =>
        filteredNodeIds.has(edge.source) &&
        filteredNodeIds.has(edge.target)
    )
  }, [search, filteredNodeIds])

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  return (
    <div className="network-page">

      {/* TOP BAR */}
      <header className="network-topbar">

        <div className="network-breadcrumb">
          <button
            className="network-back"
            onClick={() => navigate('/dashboard')}
          >
            ←
          </button>

          <div>
            <span>INVESTIGATIONS</span>
            <b>/</b>
            <strong>RELATIONSHIP GRAPH</strong>
          </div>
        </div>

        <div className="network-status">
          <span className="network-status-dot"></span>
          GRAPH ENGINE OPERATIONAL
        </div>

      </header>

      {/* PAGE CONTENT */}
      <main className="network-content">

        <div className="network-heading">

          <div>
            <span className="network-eyebrow">NETWORK ANALYSIS</span>

            <h1>Relationship graph</h1>

            <p>
              Explore connections between vendors, tenders, departments,
              contracts and locations.
            </p>
          </div>

          <div className="network-actions">

            <button
              className="network-reset"
              onClick={() => {
                setSearch('')
                setSelectedNode(null)
              }}
            >
              Reset view
            </button>

            <button
              className="network-dashboard"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

          </div>

        </div>

        {/* CONTROLS */}
        <div className="network-toolbar">

          <div className="network-search">

            <span>⌕</span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search vendor, tender, department..."
            />

          </div>

          <div className="network-legend">

            <span>
              <i className="legend-dot vendor-dot"></i>
              Vendor
            </span>

            <span>
              <i className="legend-dot tender-dot"></i>
              Tender
            </span>

            <span>
              <i className="legend-dot department-dot"></i>
              Department
            </span>

            <span>
              <i className="legend-dot contract-dot"></i>
              Contract
            </span>

            <span>
              <i className="legend-dot location-dot"></i>
              Location
            </span>

          </div>

        </div>

        {/* GRAPH + INSPECTOR */}
        <section className="network-workspace">

          <div className="network-graph">

            <div className="graph-header">

              <div>
                <span>LIVE RELATIONSHIP VIEW</span>
                <strong>
                  {filteredNodes.length} entities · {filteredEdges.length} relationships
                </strong>
              </div>

              <div className="graph-info">
                Click an entity to inspect
              </div>

            </div>

            <div className="graph-canvas">

              <ReactFlow
                nodes={filteredNodes}
                edges={filteredEdges}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                fitView
                fitViewOptions={{
                  padding: 0.2,
                }}
                minZoom={0.35}
                maxZoom={1.5}
                defaultEdgeOptions={{
                  style: {
                    stroke: '#9aa7b0',
                    strokeWidth: 1.5,
                  },
                  labelStyle: {
                    fill: '#71808b',
                    fontSize: 9,
                    fontWeight: 600,
                  },
                  labelBgStyle: {
                    fill: '#ffffff',
                    fillOpacity: 0.9,
                  },
                  labelBgPadding: [4, 3],
                  labelBgBorderRadius: 2,
                }}
              >

                <Background
                  gap={24}
                  size={1}
                  color="#dfe5e9"
                />

                <Controls
                  showInteractive={false}
                />

                <MiniMap
                  pannable
                  zoomable
                  nodeColor={(node) => {
                    if (node.type === 'vendor') return '#1769aa'
                    if (node.type === 'tender') return '#7a5c3e'
                    if (node.type === 'department') return '#596b78'
                    if (node.type === 'contract') return '#b43d3d'
                    return '#6f7f89'
                  }}
                />

              </ReactFlow>

            </div>

          </div>

          {/* INSPECTOR */}
          <aside className="network-inspector">

            {!selectedNode ? (
              <div className="inspector-empty">

                <div className="inspector-empty-icon">
                  +
                </div>

                <span>ENTITY INSPECTOR</span>

                <h3>Select an entity</h3>

                <p>
                  Click a node in the relationship graph to view its identity,
                  activity and investigation context.
                </p>

              </div>
            ) : (
              <div className="inspector-selected">

                <div className="inspector-top">

                  <span className="inspector-type">
                    {selectedNode.data.type}
                  </span>

                  <button
                    onClick={() => setSelectedNode(null)}
                  >
                    ×
                  </button>

                </div>

                <h2>{selectedNode.data.label}</h2>

                <span className="inspector-id">
                  {selectedNode.data.id}
                </span>

                <div className="inspector-risk-row">

                  <span>STATUS</span>

                  {selectedNode.data.risk !== '—' ? (
                    <b className={`inspector-risk ${selectedNode.data.risk.toLowerCase()}`}>
                      {selectedNode.data.risk}
                    </b>
                  ) : (
                    <b className="inspector-neutral">
                      CONTEXT
                    </b>
                  )}

                </div>

                <div className="inspector-divider"></div>

                <div className="inspector-detail">

                  <span>ACTIVITY</span>

                  <strong>{selectedNode.data.meta}</strong>

                </div>

                <div className="inspector-divider"></div>

                <div className="inspector-note">

                  <span>INVESTIGATOR NOTE</span>

                  <p>
                    Network relationships provide context for investigation.
                    Connection or centrality alone does not establish
                    wrongdoing.
                  </p>

                </div>

                {selectedNode.type === 'vendor' && (
                  <button
                    className="inspect-case"
                    onClick={() => navigate('/case/INV-0241')}
                  >
                    View related investigation →
                  </button>
                )}

              </div>
            )}

          </aside>

        </section>

        {/* FOOTNOTE */}
        <div className="network-disclaimer">

          <span>NETWORK INTERPRETATION</span>

          <p>
            Relationships represent observed procurement interactions.
            They are intended to support investigation and do not constitute
            evidence of corruption by themselves.
          </p>

        </div>

      </main>

    </div>
  )
}

export default Network