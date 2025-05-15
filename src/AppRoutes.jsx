import { Routes, Route } from 'react-router-dom';

import Home from './pages/HomePage';
import Detail from './pages/DetailRoadmapPage';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail" element={<Detail />} />
    </Routes>
  );
}
