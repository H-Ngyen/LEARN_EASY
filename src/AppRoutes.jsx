import { Routes, Route } from 'react-router-dom';

import Home from './pages/HomePage';
import Detail from './pages/DetailRoadmapPage';
import TopicList from './pages/TopicListPage';
import Login from './pages/LoginPage';
import Public from './pages/publicTopicPage';
import Rank from './pages/RankingPage';
import Register from './pages/RegisterPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/list" element={<TopicList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/community" element={<Public />} />
      <Route path="/rank" element={<Rank />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}