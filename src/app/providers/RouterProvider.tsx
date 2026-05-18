import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "@/pages/home";
import { StreamDetailPage } from "@/pages/stream/stream-detail";
import { UserPage } from "@/pages/user";

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserPage mode="login" />} />
        <Route path="/register" element={<UserPage mode="register" />} />
        <Route path="/stream/:streamId" element={<StreamDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
