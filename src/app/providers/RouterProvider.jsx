import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../../pages/home/ui/HomePage'
import { AuthPage } from '../../pages/auth/ui/AuthPage'
import { StreamDetailPage } from '../../pages/stream-detail/ui/StreamDetailPage'

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/stream/:streamId" element={<StreamDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
