import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges
} from 'react-flow-renderer';
import '../css/detailroadmap.css';
import logo from '../assets/logo.png';

// Sample roadmap data with status on nodes
const roadmap = {
  nodes: [
    { id: '1', data: { label: 'HTML & CSS', status: 'done' }, position: { x: 0, y: 0 } },
    { id: '2', data: { label: 'JavaScript cơ bản', status: 'done' }, position: { x: 0, y: 250 } },
    { id: '3', data: { label: 'ES6+', status: 'done' }, position: { x: 500, y: 0 } },
    { id: '4', data: { label: 'ReactJS', status: 'done' }, position: { x: 250, y: 150 } },
    { id: '5', data: { label: 'State Management (Redux)', status: 'in-process' }, position: { x: 500, y: 150 } },
    { id: '6', data: { label: 'Node.js & Express', status: 'todo' }, position: { x: 250, y: 300 } },
    { id: '7', data: { label: 'Database (MongoDB)', status: 'todo' }, position: { x: 500, y: 300 } },
    { id: '8', data: { label: 'Deployment & DevOps', status: 'todo' }, position: { x: 375, y: 450 } },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e3-4', source: '3', target: '4' },
    { id: 'e4-5', source: '4', target: '5' },
    { id: 'e4-6', source: '4', target: '6' },
    { id: 'e6-7', source: '6', target: '7' },
    { id: 'e5-8', source: '5', target: '8' },
    { id: 'e7-8', source: '7', target: '8' },
  ],
};

export default function DetailRoadmap() {
  // initialize with styled nodes and animated edges
  const [nodes, setNodes] = useState(
    roadmap.nodes.map(node => ({
      ...node,
      style: {
        background:
          node.data.status === 'todo'
            ? 'var(--gray-100)'
            : node.data.status === 'in-process'
            ? 'var(--warning)'
            : 'var(--success)',
        color: node.data.status === 'todo' ? 'var(--gray-500)' : 'white',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: 500,
      }
    }))
  );
  const [edges, setEdges] = useState(
    roadmap.edges.map(edge => ({
      ...edge,
      animated: true
    }))
  );

  const onNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="RoadmapAI Logo" width={24} height={24} />
          <span>RoadmapAI</span>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Trang chủ</span>
          </a>
          <a href="#" className="nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span>Các lộ trình của tôi</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Lộ trình phổ biến</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <span>Bảng xếp hạng</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Cài đặt</span>
          </a>
        </nav>
        <div className="user-profile">
          <div className="avatar">NT</div>
          <div className="user-info">
            <div className="user-name">Người dùng</div>
            <div className="user-rank">Rank: Beginner</div>
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="page-header">
          <button className="btn btn-outline mr-4" onClick={() => window.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="page-title">Lộ trình học Competitive Programming</h1>
          <div className="header-actions">
            <button className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Chia sẻ
            </button>
          </div>
        </header>
        <section className="roadmap-overview">
          <div className="roadmap-meta">
            <div className="meta-item">
              <span className="meta-label">Thời gian dự kiến</span>
              <span className="meta-value">6 tháng</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Ngày tạo</span>
              <span className="meta-value">03/05/2025</span>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-title">Tiến độ hoàn thành</span>
              <span className="progress-percentage">15%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-value" style={{ width: '15%' }} />
            </div>
          </div>
        </section>
        <section className="roadmap-visualization">
          <h2 className="roadmap-title">Sơ đồ lộ trình</h2>
          <div className="mindmap-container">
            <ReactFlow
              nodes={nodes}
              edges={edges.map(edge => ({ ...edge, animated: edge.animated && !(nodes.find(n => n.id === edge.source).data.status === 'done') }))}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              attributionPosition="bottom-left"
            >
              <MiniMap />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
        </section>
      </main>
    </div>
  );
}