import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
} from 'react-flow-renderer';
import '../css/detailroadmap.css';
import logo from '../assets/logo.png';
import RoadMapApi from '../api/RoadMapApi';

// Các hằng số cho trình độ và thời gian
const LEVELS = ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'];
const DURATIONS = ['1 tháng', '3 tháng', '6 tháng'];

export default function DetailRoadmap() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { getRoadmapById, updateRoadmap } = RoadMapApi();

  const [roadmap, setRoadmap] = useState(location.state?.roadmap || location.state || null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(!roadmap);
  const [error, setError] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  // Debounce timer for saving changes
  useEffect(() => {
    if (!pendingChanges) return;

    const timer = setTimeout(async () => {
      try {
        const updatedRoadmap = {
          id: roadmap.id,
          nodes: nodes.map((node) => ({
            idNote: node.id,
            data: {
              label: node.data.label,
              description: node.data.description,
              status: node.data.status,
            },
            position: node.position,
          })),
          edges: edges.map((edge) => ({
            idEdge: edge.id,
            source: edge.source,
            target: edge.target,
          })),
        };

        // Cập nhật lên server
        await updateRoadmap(roadmap.id, updatedRoadmap);

        // Fetch lại dữ liệu từ server để đồng bộ
        const refreshedData = await getRoadmapById(id);
        setRoadmap(refreshedData);
        setPendingChanges(false);
      } catch (err) {
        console.error('Failed to save or refresh roadmap changes:', err);
        setError('Failed to save or refresh changes: ' + err.message);
      }
    }, 0); 

    return () => clearTimeout(timer);
  }, [pendingChanges, nodes, edges, roadmap, updateRoadmap, id, getRoadmapById]);

  useEffect(() => {
    if (!roadmap && id) {
      const fetchRoadmap = async () => {
        try {
          const data = await getRoadmapById(id);
          setRoadmap(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchRoadmap();
    } else {
      setLoading(false);
    }
  }, [id, roadmap, getRoadmapById]);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        const updatedNodes = applyNodeChanges(changes, nds);
        setPendingChanges(true);
        return updatedNodes;
      });
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        const updatedEdges = applyEdgeChanges(changes, eds);
        setPendingChanges(true);
        return updatedEdges;
      });
    },
    []
  );

  const handleNodeClick = useCallback((_e, node) => {
    setSelected(node);
  }, []);

  const handleStatusChange = useCallback(
    (e) => {
      const newStatus = parseInt(e.target.value, 10);
      setNodes((nds) => {
        const updatedNodes = nds.map((n) =>
          n.id === selected?.id ? { ...n, data: { ...n.data, status: newStatus } } : n
        );
        setPendingChanges(true);
        return updatedNodes;
      });
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
    console.log('Styling nodes with data:', nodes); // Log để kiểm tra dữ liệu nodes
    return nodes.map((node) => {
      let background = 'var(--gray-100)';
      let color = 'var(--gray-500)';
      if (node.data.status === 0) {
        background = 'var(--gray-100)';
        color = 'var(--gray-500)';
      } else if (node.data.status === 1) {
        background = 'var(--warning)';
        color = 'black';
      } else if (node.data.status === 2) {
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
    if (roadmap) {
      console.log('Received roadmap data:', roadmap);

      if (roadmap.nodes && roadmap.edges) {
        const newNodes = roadmap.nodes.map((n) => {
          const status = Number(n.data?.status ?? 0); // Đảm bảo status là số
          console.log(`Mapping node ${n.idNote} with status ${status}`); // Log để kiểm tra status
          return {
            id: n.idNote || n.id,
            data: {
              label: n.data?.label || n.title || 'Nội dung',
              description: n.data?.description || n.content || 'Chi tiết nội dung',
              status: status,
            },
            position: n.position || { x: 0, y: 0 },
            draggable: true,
          };
        });
        setNodes(newNodes);

        const newEdges = roadmap.edges.map((e) => ({
          id: e.idEdge || e.id || `e-${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          animated: true,
        }));
        setEdges(newEdges);
      }
    }
  }, [roadmap]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !roadmap) {
    return (
      <div className="container">
        <p style={{ color: 'red' }}>
          Lỗi: {error || 'Không tìm thấy dữ liệu lộ trình.'} Vui lòng quay lại trang chủ.
        </p>
        <button onClick={() => navigate('/')}>Quay lại</button>
      </div>
    );
  }

  const roadmapTopic = roadmap?.topic || 'Lộ trình học tập';
  const roadmapLevel = LEVELS[parseInt(roadmap.level)] || LEVELS[0];
  const roadmapDuration = DURATIONS[parseInt(roadmap.duration)] || DURATIONS[0];
  const roadmapCreated = roadmap?.createdAt
    ? new Date(roadmap.createdAt).toLocaleDateString()
    : roadmap.created;

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
              <div className="progress-value" style={{ width: `${progress}%` }}></div>
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
                  <strong>Mô tả:</strong> {selected.data.description || 'Không có mô tả'}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}