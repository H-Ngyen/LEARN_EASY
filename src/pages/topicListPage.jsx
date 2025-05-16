import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/topiclist.css';
import logo from '../assets/logo.png';
import RoadMapApi from '../api/RoadMapApi';
import UserAPI from '../api/UserAPI';

// Mapping cho level và duration
const LEVELS = ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'];
const DURATIONS = ['1 Tháng', '3 Tháng', '6 Tháng'];

const { getRoadmapsByUser } = RoadMapApi();
const { getUserId } = UserAPI();

// Hàm định dạng ngày thành dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() trả về 0-11
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function TopicListPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Người dùng'); // Default name
  const navigate = useNavigate();

  // Retrieve user data for display and fetch roadmaps
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          throw new Error('User not logged in');
        }
        const data = await getRoadmapsByUser(userId);
        setRoadmaps(data);

        const user = localStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setUserName(parsedUser.name || parsedUser.userName || 'Người dùng');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchRoadmaps();
  }, []); // Empty dependency array since getRoadmapsByUser and getUserId are stable

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng
    navigate('/login'); // Chuyển hướng đến trang đăng nhập
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          <div className="avatar">{userName.charAt(0)}</div>
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <button className="logout-button" onClick={handleLogout} title="Đăng xuất">
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
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
          {roadmaps.map((r) => {
            const display = {
              id: r.id,
              title: r.topic,
              duration: DURATIONS[r.duration] || 'Không xác định',
              progress: (r.nodes.filter(n => n.data.status === '2').length / r.nodes.length) * 100 || 0,
              tags: [LEVELS[r.level] || 'Không xác định'],
              topics: r.nodes.length,
              created: formatDate(r.createdAt), // Sử dụng hàm formatDate
              share: r.share === '1' ? '🌐 Đã chia sẻ' : '🔒 Riêng tư',
            };
            return (
              <div key={r.id} className="roadmap-card">
                <div className="roadmap-header">
                  <h2 className="roadmap-title">{display.title}</h2>
                  <div className="meta">
                    <span className="roadmap-duration">📅 {display.duration}</span>
                    <span className={r.share === '1' ? 'share-public' : 'share-private'}>
                      {display.share}
                    </span>
                  </div>
                </div>

                <div className="info-row">
                  <span className="created-date">Ngày tạo: {display.created}</span>
                  <span className="topic-count">{display.topics} chủ đề</span>
                </div>

                <div className="progress-section">
                  <div className="progress-label">Tiến độ</div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${display.progress}%` }} />
                  </div>
                  <div className="progress-percent">{Math.round(display.progress)}%</div>
                </div>

                <div className="tags">
                  {display.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                </div>

                <div className="card-footer">
                  <Link to={`/detail/${r.id}`} className="btn continue-button">
                    Tiếp tục
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}