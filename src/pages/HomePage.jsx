import '../css/home.css';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';
import CreateRoadMapApi from '../api/RoadMapApi';
import UserAPI from '../api/UserAPI';
import { useNavigate } from 'react-router-dom';

const { createRoadMap } = CreateRoadMapApi();
const { getUserId } = UserAPI();

export default function Home() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('0');
  const [duration, setDuration] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userName, setUserName] = useState('Người dùng'); // Default name
  const navigate = useNavigate();

  // Retrieve user data for display
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUserName(parsedUser.name || parsedUser.userName || 'Người dùng');
    }
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng
    navigate('/login'); // Chuyển hướng đến trang đăng nhập
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not logged in. Please log in to create a roadmap.');
      }

      const data = await createRoadMap({ topic, userId, level, duration });
      console.log('Full roadmap data:', JSON.stringify(data, null, 2));
      setSuccessMessage('Roadmap created successfully!');

      const roadmapId = data.roadmap?.id;
      if (!roadmapId) {
        throw new Error('Không tìm thấy ID lộ trình từ phản hồi API. Dữ liệu trả về: ' + JSON.stringify(data));
      }

      navigate(`/detail/${roadmapId}`, { state: data.roadmap });
    } catch (err) {
      setError(err.message || 'Failed to create roadmap');
    } finally {
      setLoading(false);
    }
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
          <a href="/" className="nav-item active">
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
          <a href="/list" className="nav-item">
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
          <a href="/performance" className="nav-item">
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
              <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9V3" />
            </svg>
            <span>Thống kê hiệu suất</span>
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
      <main className="main">
        <header className="page-header">
          <h1 className="page-title">Tạo lộ trình học tập mới</h1>
        </header>

        {/* Creator section */}
        <section className="creator-card">
          <form className="creator-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="topic-input">
                Chủ đề bạn muốn tạo lộ trình
              </label>
              <input
                type="text"
                id="topic-input"
                className="form-control"
                placeholder="Ví dụ: Học lập trình JavaScript từ cơ bản đến nâng cao"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="level-select">
                Trình độ
              </label>
              <select
                id="level-select"
                className="form-control"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="0">Mới bắt đầu</option>
                <option value="1">Trung cấp</option>
                <option value="2">Nâng cao</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="duration-select">
                Thời gian dự kiến
              </label>
              <select
                id="duration-select"
                className="form-control"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="0">1 tháng</option>
                <option value="1">3 tháng</option>
                <option value="2">6 tháng</option>
              </select>
            </div>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                'Đang tạo...'
              ) : (
                <>
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                  </svg>
                  Tạo lộ trình học tập
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}