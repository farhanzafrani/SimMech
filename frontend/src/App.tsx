import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import CourseCatalogPage from './pages/CourseCatalogPage'
import CoursePage from './pages/CoursePage'
import TopicPage from './pages/TopicPage'
import './styles/global.css'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/courses" replace />} />
        <Route path="courses" element={<CourseCatalogPage />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
        <Route path="courses/:courseId/topics/:topicId" element={<TopicPage />} />
        <Route path="*" element={<Navigate to="/courses" replace />} />
      </Route>
    </Routes>
  )
}

export default App
