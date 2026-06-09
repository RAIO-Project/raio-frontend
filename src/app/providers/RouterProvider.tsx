import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "@/pages/home";
import { StreamStudioPage } from "@/pages/stream/stream-studio";
import { StreamDetailPage } from "@/pages/stream/stream-detail";
import { UserPage } from "@/pages/user";
import { UserMyPage } from "@/pages/user/my-page";

export function RouterProvider() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserPage mode="login" />} />
        <Route path="/register" element={<UserPage mode="register" />} />
        <Route path="/stream/create" element={<StreamStudioPage />} />
        <Route path="/stream/:streamId" element={<StreamDetailPage />} />
        <Route path="/my-page" element={<UserMyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
