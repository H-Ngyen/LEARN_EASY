import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer';
import '../css/detailroadmap.css';
import logo from '../assets/logo.png';

// Các hằng số cho trình độ và thời gian
const LEVELS = ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'];
const DURATIONS = ['1 tháng', '3 tháng', '6 tháng'];

export default function DetailRoadmap() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Xử lý dữ liệu lộ trình từ state
  // Giải nén roadmap từ bên trong đối tượng nếu cần thiết
  const roadmapData = location.state?.roadmap || location.state || null;

  // Khai báo tất cả hooks ở cấp độ cao nhất
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleNodeClick = useCallback((_e, node) => {
    setSelected(node);
  }, []);

  const handleStatusChange = useCallback(
    (e) => {
      const newStatus = parseInt(e.target.value, 10);
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selected?.id ? { ...n, data: { ...n.data, status: newStatus } } : n
        )
      );
      setSelected((sel) =>
        sel ? { ...sel, data: { ...sel.data, status: newStatus } } : null
      );
    },
    [selected]
  );

  const progress = useMemo(() => {
    const total = nodes.length;
    if (total === 0) return 0;
    const doneCount = nodes.filter((n) => n.data.status === 2).length;
    return Math.round((doneCount / total) * 100);
  }, [nodes]);

  const styledNodes = useMemo(() => {
    return nodes.map((node) => {
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
  }, [nodes]);

  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const srcNode = nodes.find((n) => n.id === edge.source);
      return { ...edge, animated: srcNode?.data.status !== 2 };
    });
  }, [edges, nodes]);

  useEffect(() => {
    if (roadmapData) {
      console.log('Received roadmap data:', roadmapData);

      if (roadmapData.nodes && roadmapData.edges) {
        setNodes(
          roadmapData.nodes.map((n) => ({
            id: n.idNote || n.id,
            data: {
              label: n.data?.label || n.title || 'Nội dung',
              description: n.data?.description || n.content || 'Chi tiết nội dung',
              status: n.data?.status || 0,
            },
            position: n.position || { x: 0, y: 0 },
            draggable: true,
          }))
        );
        setEdges(
          roadmapData.edges.map((e) => ({
            id: e.idEdge || e.id || `e-${e.source}-${e.target}`,
            source: e.source,
            target: e.target,
            animated: true,
          }))
        );
      } else if (roadmapData.content) {
        try {
          let content = [];
          if (typeof roadmapData.content === 'string') {
            try {
              content = JSON.parse(roadmapData.content);
            } catch {
              content = roadmapData.content.split('\n').filter((item) => item.trim());
            }
          } else if (Array.isArray(roadmapData.content)) {
            content = roadmapData.content;
          }
          if (content.length > 0) {
            const newNodes = content.map((item, index) => {
              const title = typeof item === 'string' ? item : item.title || `Bước ${index + 1}`;
              const description = typeof item === 'object' ? item.description || '' : '';
              return {
                id: `node-${index}`,
                data: { label: title, description, status: 0 },
                position: { x: 100, y: 100 + index * 100 },
              };
            });
            const newEdges = [];
            for (let i = 0; i < newNodes.length - 1; i++) {
              newEdges.push({
                id: `edge-${i}`,
                source: newNodes[i].id,
                target: newNodes[i + 1].id,
                animated: true,
              });
            }
            setNodes(newNodes);
            setEdges(newEdges);
          }
        } catch (error) {
          console.error('Error parsing roadmap content:', error);
        }
      }
    }
  }, [roadmapData]);

  // Logic điều kiện sau khi khai báo tất cả hooks
  if (!roadmapData) {
    return (
      <div className="container">
        <p style={{ color: 'red' }}>Lỗi: Không tìm thấy dữ liệu lộ trình. Vui lòng quay lại trang chủ.</p>
        <button onClick={() => navigate('/')}>Quay lại</button>
      </div>
    );
  }

  // Xử lý các thuộc tính để hiển thị
  const roadmapTopic = roadmapData?.topic || 'Lộ trình học tập';
  
  // Xử lý level - chuyển từ chuỗi sang số nếu cần
  let levelIndex = 0;
  if (roadmapData.level !== undefined) {
    // Kiểm tra xem level có phải là số dưới dạng chuỗi không
    const levelValue = parseInt(roadmapData.level, 10);
    if (!isNaN(levelValue) && levelValue >= 0 && levelValue < LEVELS.length) {
      levelIndex = levelValue;
    }
  }
  const roadmapLevel = LEVELS[levelIndex];
  
  // Xử lý duration - chuyển từ chuỗi sang số nếu cần
  let durationIndex = 0;
  if (roadmapData.duration !== undefined) {
    // Kiểm tra xem duration có phải là số dưới dạng chuỗi không
    const durationValue = parseInt(roadmapData.duration, 10);
    if (!isNaN(durationValue) && durationValue >= 0 && durationValue < DURATIONS.length) {
      durationIndex = durationValue;
    }
  }
  const roadmapDuration = DURATIONS[durationIndex];
  
  const roadmapCreated = roadmapData?.created || new Date().toLocaleDateString();

  // JSX render chính
  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="LearnEasy Logo" width="24" height="24" />
          <span>LearnEasy</span>
        </div>
         <nav className="sidebar-nav">
          <a href="/" className="nav-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Trang chủ</span>
          </a>
          <a href="/list" className="nav-item active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span>Các lộ trình của tôi</span>
          </a>
          <a href="/community" className="nav-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Lộ trình cộng đồng</span>
          </a>
          <a href="/rank" className="nav-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <span>Bảng xếp hạng</span>
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
            <svg
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="page-title">{roadmapTopic}</h1>
          <div className="header-actions">
            <button className="btn btn-primary">
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Chia sẻ
            </button>
          </div>
        </header>

        {/* Tổng quan lộ trình */}
        <section className="roadmap-overview">
          <div className="roadmap-meta">
            <div className="meta-item">
              <span className="meta-label">Trình độ</span>
              <span className="meta-value">{roadmapLevel}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Thời gian dự kiến</span>
              <span className="meta-value">{roadmapDuration}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Ngày tạo</span>
              <span className="meta-value">{roadmapCreated}</span>
            </div>
          </div>
            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-title">Tiến độ hoàn thành</span>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-value"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

        </section>

        {/* Hiển thị sơ đồ lộ trình */}
        <section className="roadmap-visualization">
          <h2 className="roadmap-title">Sơ đồ lộ trình</h2>
          {nodes.length > 0 ? (
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
          ) : (
            <div className="empty-roadmap">
              <p>Chưa có dữ liệu lộ trình để hiển thị.</p>
            </div>
          )}

          {selected && (
            <div className="info-panel active">
              <div className="info-header">
                <h3 className="info-title">{selected.data.label}</h3>
                <button className="info-close" onClick={() => setSelected(null)}>
                  ×
                </button>
              </div>
              <div className="info-section">
                <div className="status-selector">
                  <label htmlFor="status-select">
                    <strong>Chọn trạng thái:</strong>{' '}
                  </label>
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
                <p>
                  <strong>Mô tả:</strong>{' '}
                  {selected.data.description || 'Không có mô tả'}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}