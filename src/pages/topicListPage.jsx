import React from 'react';
import { Link } from 'react-router-dom';
import '../css/topiclist.css';
import logo from '../assets/logo.png';

// Dữ liệu roadmap inline
const roadmap = {
  id: 'roadmap1',
  idUser: 'user123',
  share: 1,
  topic: 'Competitive Programming',
  level: 1,
  duration: 2,
  created: '03/05/2025',
  progress: 15,
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

// mapping cho level và duration
const LEVELS = ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'];
const DURATIONS = ['1 Tháng', '3 Tháng', '6 Tháng'];

export default function TopicListPage() {
  const r = roadmap;
  const display = {
    id: r.id,
    title: r.topic,
    duration: DURATIONS[r.duration],
    progress: r.progress / 100,
    tags: [LEVELS[r.level]],
    topics: r.nodes.length,
    created: r.created,
    share: r.share,
  };

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

      {/* Main Content */}
      <main className="main topic-list-page">
        <div className="page-header">
          <h1 className="page-title">Các lộ trình của tôi</h1>
          <Link to="/" className="btn btn-primary create-button">
            + Tạo lộ trình học tập
          </Link>
        </div>

        <div className="roadmap-list">
          <div className="roadmap-card">
            <div className="roadmap-header">
              <h2 className="roadmap-title">{display.title}</h2>
              <div className="meta">
                <span className="roadmap-duration">📅 {display.duration}</span>
                <span className={display.share ? 'share-public' : 'share-private'}>
                  {display.share ? '🌐 Đã chia sẻ' : '🔒 Riêng tư'}
                </span>
              </div>
            </div>

            <div className="info-row">
              <span className="created-date">Tạo: {display.created}</span>
              <span className="topic-count">{display.topics} chủ đề</span>
            </div>

            <div className="progress-section">
              <div className="progress-label">Tiến độ</div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${display.progress * 100}%` }} />
              </div>
              <div className="progress-percent">{Math.round(display.progress * 100)}%</div>
            </div>

            <div className="tags">
              {display.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>

            <div className="card-footer">
              <Link to={`/detail/`} className="btn continue-button">
                Tiếp tục
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
