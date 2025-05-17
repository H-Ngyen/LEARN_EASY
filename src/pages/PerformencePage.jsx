import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import MyUserApi from '../api/MyUserApi';
import '../css/performance.css';

export default function PerformancePage() {
  const [performance, setPerformance] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [userName, setUserName] = useState('Người dùng');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchPerformance = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        const { getPerformanceFromUser } = MyUserApi();
        try {
          const response = await getPerformanceFromUser(user.userId);
          console.log(response.success);
          
          if (response.success) {
            setPerformance(response.performance);
          } else {
            setError(response.error || 'Failed to fetch performance');
          }
        } catch (err) {
          setError(err.message || 'An error occurred while fetching performance');
        }
      } else {
        setError('User not logged in');
      }
    };
    fetchPerformance();
  }, [timeRange]);

  // Lấy thông tin user từ localStorage và hiển thị
    useEffect(() => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || parsedUser.userName || 'Người dùng');
      }
    }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
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
          <a href="/performance" className="nav-item active">
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
          <h1 className="page-title">Thống kê hiệu suất học tập</h1>
        </header>

        <section className="performance-stats">
          {error ? (
            <p className="error-message" style={{ color: 'red' }}>{error}</p>
          ) : performance ? (
            <table className="performance-table">
              <thead>
                <tr>
                  <th>Chỉ số</th>
                  <th>Giá trị</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tổng số lộ trình</td>
                  <td>{performance.totalRoadmaps}</td>
                </tr>
                <tr>
                  <td>Số lộ trình hoàn thành</td>
                  <td>{performance.completedRoadmaps}</td>
                </tr>
                <tr>
                  <td>Tỷ lệ hoàn thành lộ trình</td>
                  <td>{performance.completionRate.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td>Thời gian thực tế</td>
                  <td>{performance.totalTimeSpent} phút</td>
                </tr>
                <tr>
                  <td>Thời gian dự kiến</td>
                  <td>{performance.totalEstimatedTime} phút</td>
                </tr>
                <tr>
                  <td>Thời gian tiết kiệm</td>
                  <td>{performance.timeSaved > 0 ? performance.timeSaved : 0} phút</td>
                </tr>
                <tr>
                  <td>Hiệu quả học tập</td>
                  <td>{performance.efficiency.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td>Điểm hiệu suất</td>
                  <td>{performance.performanceScore.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Đang tải thống kê...</p>
          )}
        </section>
      </main>
    </div>
  );
}