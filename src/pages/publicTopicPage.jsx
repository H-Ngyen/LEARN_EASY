import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/publicTopic.css';
import logo from '../assets/logo.png';
import RoadMapApi from '../api/RoadMapApi';
import MyRoadmapApi from '../api/MyRoadmapApi';

const { getRoadmapCommunity } = RoadMapApi();
const { SaveRoadmapFromCommunityApi } = MyRoadmapApi();

export default function PublicTopicPage() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('Người dùng'); // Default name
  const navigate = useNavigate();

  // Hàm tạo gradient ngẫu nhiên với nhiều màu
  const getRandomGradient = () => {
    const getColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    // Tạo 2-3 màu ngẫu nhiên
    const colors = [getColor(), getColor(), getColor()];
    // Tạo gradient với góc ngẫu nhiên (0-360 độ)
    const angle = Math.floor(Math.random() * 360);
    return `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
  };

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
    localStorage.removeItem('user'); // Xóa thông tin người dùng
    navigate('/login'); // Chuyển hướng đến trang đăng nhập
  };

  // Fetch community roadmaps từ API
  useEffect(() => {
    const fetchCommunityRoadmaps = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRoadmapCommunity();
        console.log('API Response:', data);

        // Giả định API trả về data.roadmap hoặc data.roadmaps là một mảng các roadmap
        const roadmaps = Array.isArray(data.roadmaps) ? data.roadmaps : Array.isArray(data) ? data : [data] || [];

        // Ánh xạ dữ liệu từ API để khớp với cấu trúc UI
        const formattedRoadmaps = roadmaps.map((rm) => ({
          id: rm.id,
          coverUrl: rm.coverUrl || null,
          title: rm.topic || rm.title || 'Untitled Roadmap',
          duration: mapDuration(rm.duration),
          levelLabel: mapLevel(rm.level),
          author: {
            name: rm.author?.name || 'Unknown Author',
          },
          downloadCount: rm.downloadCount || 0, // Thêm downloadCount
          backgroundGradient: getRandomGradient(),
        }));

        console.log('Formatted roadmaps:', formattedRoadmaps);
        setPopular(formattedRoadmaps);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Không thể tải lộ trình cộng đồng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityRoadmaps();
  }, []);

  const handleViewRoadmap = async (roadmapId) => {
    try {
      // Lấy userId từ localStorage
      const user = localStorage.getItem('user');
      if (!user) {
        setError('Vui lòng đăng nhập để sao chép lộ trình.');
        return;
      }

      const parsedUser = JSON.parse(user);
      const userId = parsedUser.userId;
      if (!userId) {
        setError('Không tìm thấy userId. Vui lòng đăng nhập lại.');
        return;
      }

      // Gọi API để sao chép roadmap
      const response = await SaveRoadmapFromCommunityApi({ id: roadmapId, userId });
      if (!response.success) {
        throw new Error(response.error || 'Không thể sao chép lộ trình.');
      }

      const newRoadmapId = response.roadmap.id;
      // Chuyển hướng đến trang chi tiết của roadmap mới
      navigate(`/detail/${newRoadmapId}`);
    } catch (error) {
      setError(`Lỗi khi sao chép lộ trình: ${error.message}`);
    }
  };

  // Hàm ánh xạ duration từ API sang label
  const mapDuration = (duration) => {
    const durationMap = {
      '0': '1 tháng',
      '1': '3 tháng',
      '2': '6 tháng',
    };
    return durationMap[duration] || 'Không xác định';
  };

  // Hàm ánh xạ level từ API sang label
  const mapLevel = (level) => {
    const levelMap = {
      '0': 'Mới bắt đầu',
      '1': 'Trung cấp',
      '2': 'Nâng cao',
    };
    return levelMap[level] || 'Không xác định';
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
          <a href="/community" className="nav-item active">
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

      <main className="main">
        <div className="page-header">
          <h1>Lộ trình cộng đồng</h1>
        </div>

        {loading && <p>Đang tải lộ trình cộng đồng...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && popular.length === 0 && (
          <p>Không có lộ trình cộng đồng nào để hiển thị.</p>
        )}

        {!loading && !error && popular.length > 0 && (
          <section className="roadmap-section popular">
            <div className="grid-cards">
              {popular.map((rm, idx) => (
                <div key={idx} className="small-card">
                  <div
                    className="card-cover"
                    style={{
                      background: rm.coverUrl ? `url(${rm.coverUrl})` : rm.backgroundGradient,
                      backgroundSize: rm.coverUrl ? 'cover' : undefined,
                      backgroundPosition: rm.coverUrl ? 'center' : undefined,
                    }}
                  />
                  <div className="card-content">
                    <h4>{rm.title}</h4>
                    <div className="meta">
                      <span>
                        <i className="icon-calendar" /> {rm.duration}
                      </span>
                      <span>
                        <i className="icon-download" /> {rm.downloadCount} lượt tải
                      </span> {/* Hiển thị downloadCount */}
                    </div>
                    <div className="author">
                      <span className="label level">{rm.levelLabel}</span>
                      <div>
                        <p className="name">{rm.author.name}</p>
                      </div>
                    </div>
                    <button
                      className="btn-view small"
                      onClick={() => handleViewRoadmap(rm.id)}
                    >
                      Tải về
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
} 