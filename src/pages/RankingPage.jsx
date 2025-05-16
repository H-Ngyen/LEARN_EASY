import React, { useEffect, useState } from 'react';
import '../css/ranking.css';
import logo from '../assets/logo.png';
import UserAPI from '../api/UserAPI';

const { getUserId } = UserAPI();

export default function RankingPage() {
  const [rankingData, setRankingData] = useState([]);
  const [userName, setUserName] = useState('Người dùng');
  const [avatarInitial, setAvatarInitial] = useState('NT');
  const [userRank, setUserRank] = useState('Fresh');

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        const name = parsedUser.name || parsedUser.userName || 'Người dùng';
        setUserName(name);
        setAvatarInitial(name.charAt(0).toUpperCase());
      }
    }
  }, []);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const ranking = await UserAPI().getRanking();
        setRankingData(ranking);

        const currentUserId = getUserId();
        const currentUser = ranking.find(user => user.userId === currentUserId);
        if (currentUser) {
          setUserRank(currentUser.memberRank);
        }
      } catch (error) {
        console.error('Error fetching ranking:', error);
      }
    };
    fetchRanking();
  }, []);

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
          <a href="/rank" className="nav-item active">
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
          <div className="avatar">{avatarInitial}</div>
          <div className="user-info">
            <div className="user-name">{userName}</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="page-header">
          <h1>Bảng xếp hạng</h1>
        </div>

        <section className="ranking-section">
          <div className="section-header">
            <h2>Top người dùng</h2>
          </div>
          {rankingData.length > 0 ? (
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Tên</th>
                  <th>Cấp độ</th>
                  <th>Điểm số</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((user) => (
                  <tr key={user.rank}>
                    <td>{user.rank}</td>
                    <td>{user.name}</td>
                    <td>
                      <span className={`rank-label ${user.memberRank.toLowerCase()}`}>
                        {user.memberRank}
                      </span>
                    </td>
                    <td>{user.totalScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Không có dữ liệu xếp hạng để hiển thị.</p>
          )}
        </section>
      </main>
    </div>
  );
}