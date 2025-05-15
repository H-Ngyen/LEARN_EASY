import { Routes, Route } from 'react-router-dom';

import Home from './pages/HomePage';
import Detail from './pages/DetailRoadmapPage';
import TopicList from './pages/topicListPage';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail" element={<Detail />} />
      <Route path="/list" element={<TopicList />} />
    </Routes>
  );
}
