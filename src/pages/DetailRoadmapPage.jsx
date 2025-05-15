import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer';
import '../css/detailroadmap.css';
import logo from '../assets/logo.png';

// Updated mock roadmap data structure
const roadmap = {
  id: 'roadmap1',          // tổng ID
  idUser: 'user123',       // người sở hữu
  share: 1,                // 0: không chia sẻ, 1: chia sẻ
  topic: 'Competitive Programming',
  level: 1,     // 0:Mới bắt đầu, 1:Trung cấp, 2:Nâng cao
  duration: 2,  // 0:1 tháng, 1:3 tháng, 2:6 tháng
  created: '03/05/2025',
  progress: 15, // percent
  nodes: [
    { idNote: '1', data: { label: 'HTML & CSS', status: 2, description: 'HTML (Hypertext Markup Language) là ngôn ngữ đánh dấu tiêu chuẩn...' }, position: { x: 0, y: 0 } },
    { idNote: '2', data: { label: 'JavaScript cơ bản', status: 2, description: 'JavaScript cơ bản cho phép bạn tương tác với trang web...' }, position: { x: 250, y: 0 } },
    { idNote: '3', data: { label: 'ES6+', status: 2, description: 'ES6+ giới thiệu arrow functions, let/const, template literals...' }, position: { x: 500, y: 0 } },
    { idNote: '4', data: { label: 'ReactJS', status: 2, description: 'ReactJS là thư viện JavaScript để xây dựng giao diện người dùng...' }, position: { x: 250, y: 150 } },
    { idNote: '5', data: { label: 'State Management (Redux)', status: 1, description: 'Redux giúp quản lý state toàn cục trong ứng dụng React...' }, position: { x: 500, y: 150 } },
    { idNote: '6', data: { label: 'Node.js & Express', status: 0, description: 'Node.js & Express cho phép xây dựng backend bằng JavaScript...' }, position: { x: 250, y: 300 } },
    { idNote: '7', data: { label: 'Database (MongoDB)', status: 0, description: 'MongoDB là NoSQL database lưu trữ tài liệu JSON...' }, position: { x: 500, y: 300 } },
    { idNote: '8', data: { label: 'Deployment & DevOps', status: 0, description: 'CICD, Docker, Kubernetes để triển khai và vận hành...' }, position: { x: 375, y: 450 } },
  ],
  edges: [
    { idEdge: 'e1-2', source: '1', target: '2' },
    { idEdge: 'e2-3', source: '2', target: '3' },
    { idEdge: 'e3-4', source: '3', target: '4' },
    { idEdge: 'e4-5', source: '4', target: '5' },
    { idEdge: 'e4-6', source: '4', target: '6' },
    { idEdge: 'e6-7', source: '6', target: '7' },
    { idEdge: 'e5-8', source: '5', target: '8' },
    { idEdge: 'e7-8', source: '7', target: '8' },
  ],
};

const LEVELS = ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'];
const DURATIONS = ['1 tháng', '3 tháng', '6 tháng'];

export default function DetailRoadmap() {
  // Map idNote to id for React Flow compatibility
  const [nodes, setNodes] = useState(
    roadmap.nodes.map(n => ({
      id: n.idNote,
      data: n.data,
      position: n.position,
      draggable: true,
      style: {},
    }))
  );
  const [edges, setEdges] = useState(
    roadmap.edges.map(e => ({
      id: e.idEdge,
      source: e.source,
      target: e.target,
      animated: true,
    }))
  );
  const [selected, setSelected] = useState(null);

  const onNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  );

  // style nodes by status
  const styledNodes = nodes.map(node => {
    let background = 'var(--gray-100)'; // todo
    let color = 'var(--gray-500)';
    if (node.data.status === 1) {
      background = 'var(--warning)'; // in-process
      color = 'black';
    }
    if (node.data.status === 2) {
      background = 'var(--success)'; // done
      color = 'black';
    }
    return {
      ...node,
      style: {
        background,
        color,
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: 500,
        cursor: 'pointer',
      },
    };
  });

  const styledEdges = edges.map(edge => {
    const srcNode = nodes.find(n => n.id === edge.source);
    return { ...edge, animated: srcNode?.data.status !== 2 };
  });

  const handleNodeClick = (_e, node) => setSelected(node);

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="RoadmapAI Logo" width={24} height={24} />
          <span>RoadmapAI</span>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item">Trang chủ</a>
          <a href="#" className="nav-item active">Các lộ trình của tôi</a>
          <a href="#" className="nav-item">Lộ trình phổ biến</a>
          <a href="#" className="nav-item">Bảng xếp hạng</a>
          <a href="#" className="nav-item">Cài đặt</a>
        </nav>
        <div className="user-profile">
          <div className="avatar">NT</div>
          <div className="user-info">
            <div className="user-name">Người dùng</div>
            <div className="user-rank">Rank: Beginner</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="page-header">
          <button className="btn btn-outline" onClick={() => window.history.back()}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="page-title">{roadmap.topic}</h1>
          <div className="header-actions">
            <button className="btn btn-primary">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>Chỉnh sửa
            </button>
          </div>
        </header>

        {/* Roadmap Overview */}
        <section className="roadmap-overview">
          <div className="roadmap-meta">
            <div className="meta-item"><span className="meta-label">Trình độ</span><span className="meta-value">{LEVELS[roadmap.level]}</span></div>
            <div className="meta-item"><span className="meta-label">Thời gian dự kiến</span><span className="meta-value">{DURATIONS[roadmap.duration]}</span></div>
            <div className="meta-item"><span className="meta-label">Ngày tạo</span><span className="meta-value">{roadmap.created}</span></div>
          </div>
          <div className="progress-container">
            <div className="progress-header"><span className="progress-title">Tiến độ hoàn thành</span><span className="progress-percentage">{roadmap.progress}%</span></div>
            <div className="progress-bar"><div className="progress-value" style={{ width: `${roadmap.progress}%` }} /></div>
          </div>
        </section>

        <section className="roadmap-visualization">
          <h2 className="roadmap-title">Sơ đồ lộ trình</h2>
          <div className="mindmap-container">
            <ReactFlow
              nodes={styledNodes}
              edges={styledEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView
              attributionPosition="bottom-left"
            >
              <MiniMap />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
          {selected && (
            <div className="info-panel active">
              <div className="info-header">
                <h3 className="info-title">{selected.data.label}</h3>
                <button className="info-close" onClick={() => setSelected(null)}>×</button>
              </div>
              <div className="info-section"><p>{selected.data.description}</p></div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
