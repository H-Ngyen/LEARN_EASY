import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/publicTopic.css';
import logo from '../assets/logo.png';

// Dummy data for community roadmap, updated to match API response
const dummyRoadmap = {
  id: 'roadmap1',
  coverUrl: 'https://via.placeholder.com/600x400?text=M%C3%AC+X%C3%A0o+B%C6%A1+T%E1%BB%8Fi', // Hình ảnh liên quan đến mì xào
  title: 'Hướng dẫn nấu món mì xào bơ tỏi',
  duration: '1 tháng', // Ánh xạ duration: "0" từ API
  category: 'Ẩm thực',
  description:
    'Học cách nấu món mì xào bơ tỏi thơm ngon trong 1 tháng, từ kỹ năng an toàn nhà bếp, chuẩn bị nguyên liệu, đến tạo nước sốt bơ tỏi và xào mì hoàn hảo.',
  tags: ['Ẩm thực', 'Nấu ăn', 'Mì xào'],
  levelLabel: 'Mới bắt đầu', // Ánh xạ level: "0" từ API
  author: {
    name: 'Trần Hưng',
    role: 'Đầu bếp chuyên nghiệp',
  },
};

export default function PublicTopicPage() {
  const [featured, setFeatured] = useState(null);
  const [popular, setPopular] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data
    setFeatured(dummyRoadmap);
    // For popular, you can list multiple dummy entries or reuse dummyRoadmap
    setPopular([dummyRoadmap, dummyRoadmap]);
  }, []);

  const renderTags = (tags) => tags.map((t, i) => <span key={i} className="tag">{t}</span>);

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

        {/* Featured Roadmap */}
        {featured && (
          <section className="roadmap-section featured">
            <div className="section-header">
              <h2>Lộ trình nổi bật</h2>
              <button className="link-btn" onClick={() => navigate('/community/all')}>
                Xem tất cả
              </button>
            </div>
            <div className="featured-card" onClick={() => navigate(`/detail/${featured.id}`)}>
              <div
                className="card-cover"
                style={{ backgroundImage: `url(${featured.coverUrl})` }}
              />
              <div className="card-content">
                <h3>{featured.title}</h3>
                <div className="meta">
                  <span>
                    <i className="icon-calendar" /> {featured.duration}
                  </span>
                  <span className="label">{featured.category}</span>
                </div>
                <p className="description">{featured.description}</p>
                <div className="tags">{renderTags(featured.tags)}</div>
                <div className="author">
                  <span className="label level">{featured.levelLabel}</span>
                  <div>
                    <p className="name">{featured.author.name}</p>
                    <p className="role">{featured.author.role}</p>
                  </div>
                </div>
                <button className="btn-view">Xem lộ trình</button>
              </div>
            </div>
          </section>
        )}

        {/* Popular Roadmaps */}
        {popular.length > 0 && (
          <section className="roadmap-section popular">
            <div className="section-header">
              <h2>Lộ trình phổ biến</h2>
              <button className="link-btn" onClick={() => navigate('/community/all')}>
                Xem tất cả
              </button>
            </div>
            <div className="grid-cards">
              {popular.map((rm, idx) => (
                <div
                  key={idx}
                  className="small-card"
                  onClick={() => navigate(`/detail/${rm.id}`)}
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
                      <span className="label">{rm.category}</span>
                    </div>
                    <div className="author">
                      <span className="label level">{rm.levelLabel}</span>
                      <div>
                        <p className="name">{rm.author.name}</p>
                        <p className="role">{rm.author.role}</p>
                      </div>
                    </div>
                    <button className="btn-view small">Xem lộ trình</button>
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