import React from 'react';
import '../css/topiclist.css';
import logo from '../assets/logo.png';


// mapping cho level và duration
const LEVELS = ['Mới bắt đầu', 'Trung cấp', 'Nâng cao'];
const DURATIONS = ['1 Tháng', '3 Tháng', '6 Tháng'];

export default function TopicListPage() {
  // chuyển dữ liệu thành mảng để render
  const roadmaps = [roadmapData].map(r => ({
    id: r.id,
    title: r.topic,
    duration: DURATIONS[r.duration],
    progress: r.progress / 100,
    tags: [LEVELS[r.level]],
    topics: r.nodes.length,
    created: r.created,
    share: r.share,
  }));

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="LearnEasy Logo" width="24" height="24" />
          <span>LearnEasy</span>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item">
            {/* Home icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Trang chủ</span>
          </a>
          <a href="#" className="nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span>Các lộ trình của tôi</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Lộ trình cộng đồng</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <span>Bảng xếp hạng</span>
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
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

      <main className="main topic-list-page">
        <div className="page-header">
          <h1 className="page-title">Các lộ trình của tôi</h1>
          <button className="btn btn-primary create-button">+ Tạo lộ trình học tập</button>
        </div>

        <div className="roadmap-list">
          {roadmaps.map(r => (
            <div key={r.id} className="roadmap-card">
              <div className="roadmap-header">
                <h2 className="roadmap-title">{r.title}</h2>
                <div className="meta">
                  <span className="roadmap-duration">📅 {r.duration}</span>
                  <span className={r.share ? 'share-public' : 'share-private'}>
                    {r.share ? '🌐 Đã chia sẻ' : '🔒 Riêng tư'}
                  </span>
                </div>
              </div>
              <div className="info-row">
                <span className="created-date">Tạo: {r.created}</span>
                <span className="topic-count">{r.topics} chủ đề</span>
              </div>
              <div className="progress-section">
                <div className="progress-label">Tiến độ</div>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${r.progress * 100}%` }} />
                </div>
                <div className="progress-percent">{Math.round(r.progress * 100)}%</div>
              </div>
              <div className="tags">
                {r.tags.map(tag => (<span key={tag} className="tag">{tag}</span>))}
              </div>
              <div className="card-footer">
                <button className="btn continue-button">Tiếp tục</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}