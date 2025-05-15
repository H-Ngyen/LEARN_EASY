import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer';
import '../css/detailroadmap.css';
import logo from '../assets/logo.png';

// Dữ liệu mẫu cho lộ trình
const roadmap = {
  id: 'roadmap1',
  idUser: 'user123',
  share: 1,
  topic: 'Competitive Programming',
  level: 1,
  duration: 2,
  created: '03/05/2025',
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

// Các hằng số cho trình độ và thời gian
const LEVELS = ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'];
const DURATIONS = ['1 tháng', '3 tháng', '6 tháng'];

export default function DetailRoadmap() {
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

  // Xử lý thay đổi nodes và edges trong React Flow
  const onNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  );
  const handleNodeClick = (_e, node) => setSelected(node);

  // Tính toán tiến độ hoàn thành
  const progress = useMemo(() => {
    const total = nodes.length;
    if (total === 0) return 0;
    const doneCount = nodes.filter(n => n.data.status === 2).length;
    return Math.round((doneCount / total) * 100);
  }, [nodes]);

  // Thay đổi trạng thái của node được chọn
  const handleStatusChange = (e) => {
    const newStatus = parseInt(e.target.value, 10);
    setNodes(nds =>
      nds.map(n =>
        n.id === selected.id
          ? { ...n, data: { ...n.data, status: newStatus } }
          : n
      )
    );
    setSelected(sel => ({
      ...sel,
      data: { ...sel.data, status: newStatus }
    }));
  };

  // Định kiểu cho nodes dựa trên trạng thái
  const styledNodes = nodes.map(node => {
    let background = 'var(--gray-100)';
    let color = 'var(--gray-500)';
    if (node.data.status === 1) {
      background = 'var(--warning)';
      color = 'black';
    }
    if (node.data.status === 2) {
      background = 'var(--success)';
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

  // Định kiểu cho edges: chỉ animated nếu source chưa hoàn thành
  const styledEdges = edges.map(edge => {
    const srcNode = nodes.find(n => n.id === edge.source);
    return { ...edge, animated: srcNode?.data.status !== 2 };
  });

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="RoadmapAI Logo" width="24" height="24" />
          <span>LearnEasy</span>
        </div>
        <nav className="sidebar-nav">
          <a href="/" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Trang chủ</span>
          </a>
          <a href="/list" className="nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
              <line x1={3} y1={9} x2={21} y2={9} />
              <line x1={9} y1={21} x2={9} y2={9} />
            </svg>
            <span>Các lộ trình của tôi</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Lộ trình phổ biến</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <span>Bảng xếp hạng</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx={12} cy={12} r={3} />
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

      {/* Nội dung chính */}
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
              </svg>Chia sẻ
            </button>
          </div>
        </header>

        {/* Tổng quan lộ trình */}
        <section className="roadmap-overview">
          <div className="roadmap-meta">
            <div className="meta-item"><span className="meta-label">Trình độ</span><span className="meta-value">{LEVELS[roadmap.level]}</span></div>
            <div className="meta-item"><span className="meta-label">Thời gian dự kiến</span><span className="meta-value">{DURATIONS[roadmap.duration]}</span></div>
            <div className="meta-item"><span className="meta-label">Ngày tạo</span><span className="meta-value">{roadmap.created}</span></div>
          </div>
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-title">Tiến độ hoàn thành</span>
              <span className="progress-percentage">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-value" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        {/* Hiển thị sơ đồ lộ trình */}
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
              <div className="info-section">
                <div className="status-selector">
                  <label htmlFor="status-select"><strong>Chọn trạng thái:</strong> </label>
                  <select
                    id="status-select"
                    value={selected.data.status}
                    onChange={handleStatusChange}
                  >
                    <option value={0}>Todo</option>
                    <option value={1}>In Process</option>
                    <option value={2}>Done</option>
                  </select>
                </div>
                <p><strong>Mô tả:</strong> {selected.data.description}</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}