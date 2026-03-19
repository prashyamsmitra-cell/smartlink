import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/analytics/:shortCode" element={<AnalyticsPage />} />
        <Route path="*"                    element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
