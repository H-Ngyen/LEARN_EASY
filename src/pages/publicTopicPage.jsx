import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/publicTopic.css';
import logo from '../assets/logo.png';
import UserAPI from '../api/UserAPI';
import RoadMapApi from '../api/RoadMapApi';
import MyRoadmapApi from '../api/MyRoadmapApi';

const { getRoadmapCommunity } = RoadMapApi();
const { SaveRoadmapFromCommunityApi } = MyRoadmapApi();

export default function PublicTopicPage() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy thông tin user từ localStorage và hiển thị
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      const userName = parsedUser.name || parsedUser.userName || 'Người dùng';
      const avatarInitial = userName.charAt(0).toUpperCase();
      document.querySelector('.avatar').textContent = avatarInitial;
      document.querySelector('.user-name').textContent = userName;
    }
  }, []);

  // Fetch community roadmaps từ API
  useEffect(() => {
    const fetchCommunityRoadmaps = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRoadmapCommunity();
        console.log(data);

        // Giả định API trả về data.roadmap là một mảng các roadmap
        // Nếu API trả về data.roadmap là một object đơn, cần chuyển thành mảng
        const roadmaps = Array.isArray(data) ? data : [data];

        // Ánh xạ dữ liệu từ API để khớp với cấu trúc UI
        const formattedRoadmaps = roadmaps.map((rm) => ({
          id: rm.id,
          coverUrl: rm.coverUrl || 'https://via.placeholder.com/600x400?text=Default+Image', // Fallback image nếu không có
          title: rm.topic || rm.title || 'Untitled Roadmap',
          duration: mapDuration(rm.duration), // Ánh xạ duration
          levelLabel: mapLevel(rm.level), // Ánh xạ level
          author: {
            name: rm.author?.name || 'Unknown Author',
          },
        }));

        setPopular(formattedRoadmaps);
      } catch (error) {
        setError('Không thể tải lộ trình cộng đồng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityRoadmaps();
  }, []);

  const handleViewRoadmap = async (roadmapId) => {
    try {
      // console.log('roadmapId: ', roadmapId);
      // 
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
      // navigate(`/detail/${newRoadmapId}`);
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
                <div
                  key={idx}
                  className="small-card"
                  // onClick={() => navigate(`/detail/${rm.id}`)}
                >
                  <div
                    className="card-cover"
                    style={{ backgroundImage: `url(${rm.coverUrl})` }}
                  />
                  <div className="card-content">
                    <h4>{rm.title}</h4>
                    <div className="meta">
                      <span>
                        <i className="icon-calendar" /> {rm.duration}
                      </span>
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
                      Xem lộ trình
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