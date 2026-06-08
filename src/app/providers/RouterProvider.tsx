import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "@/pages/home";
import { StreamStudioPage } from "@/pages/stream/stream-studio";
import { StreamDetailPage } from "@/pages/stream/stream-detail";
import { UserPage } from "@/pages/user";

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserPage mode="login" />} />
        <Route path="/register" element={<UserPage mode="register" />} />
        <Route path="/stream/create" element={<StreamStudioPage />} />
        <Route path="/stream/:streamId" element={<StreamDetailPage />} />
        <Route path="/my-page" element={<UserPage mode="register" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
