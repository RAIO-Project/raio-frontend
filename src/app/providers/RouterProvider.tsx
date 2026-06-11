import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { HomePage } from "@/pages/home";
import { PaymentFailPage } from "@/pages/payment/fail";
import { PaymentSuccessPage } from "@/pages/payment/success";
import { StreamDetailPage } from "@/pages/stream/stream-detail";
import { StreamStudioPage } from "@/pages/stream/stream-studio";
import { UserPage } from "@/pages/user";
import { UserMyPage } from "@/pages/user/my-page";
import { AuthGateModal, PointChargeModal } from "@/widgets/payment/point-charge";
import { PaymentSuccessModal } from "@/widgets/payment/payment-success";

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
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* 페이지 이동과 무관하게 항상 마운트 — 위젯 iframe 유지 */}
      <PointChargeModal />
      <AuthGateModal />
      <PaymentSuccessModal />
    </BrowserRouter>
  );
}
