import { useState } from "react";
import { Link } from "react-router-dom";

import { createDonation } from "@/entities/donation";
import { usePaymentStore } from "@/entities/payment";
import { useUserStore } from "@/features/user";
import { usePointStore } from "@/features/payment/charge-point";
import { formatPoint, showToast } from "@/shared";

const DONATION_AMOUNTS = [100, 500, 1000, 5000];

interface DonationBoxProps {
  streamId: string;
  streamerId?: string; // 후원 수신자(receiverId)
}

export function DonationBox({ streamId, streamerId }: DonationBoxProps) {
  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const balance = usePaymentStore((state) => state.balance);
  const deductBalance = usePaymentStore((state) => state.deductBalance);
  const openCharge = usePointStore((state) => state.openCharge);
  const [amount, setAmount] = useState(500);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const donate = async () => {
    if (!token || !user) return; // 비로그인은 아래 CTA 로 막힘 (방어적)
    if (balance < amount) {
      openCharge();
      showToast("포인트가 부족합니다.", "error");
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      // 후원 발송(REST). 후원 메시지는 백엔드 브로드캐스트(STOMP)로 채팅에 표시됨 → 낙관적 push 안 함.
      await createDonation({
        streamId,
        senderId: String(user.id), // TODO(auth): 인증 붙으면 제거(토큰에서)
        receiverId: streamerId,
        amount,
        message: message.trim() || undefined,
        senderNickname: user.nickname || `유저${user.id}`, // TODO(auth): 제거
      });
      // TODO: 백엔드 지갑(포인트) 연동되면 로컬 차감 제거하고 잔액 재조회로 동기화
      deductBalance(amount);
      setMessage("");
      showToast(`${formatPoint(amount)} 후원 완료`, "success");
    } catch {
      showToast("후원에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-[2rem] border border-accent-2/20 bg-bg-2 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-black">후원하기</h3>
        {token && <span className="text-xs text-white/40">보유 {formatPoint(balance)}</span>}
      </div>

      {token ? (
        <>
          <div className="grid grid-cols-4 gap-2">
            {DONATION_AMOUNTS.map((item) => (
              <button
                key={item}
                onClick={() => setAmount(item)}
                className={`rounded-xl border py-2 text-xs font-black ${
                  amount === item
                    ? "border-accent-2 bg-accent-2/10 text-accent-2"
                    : "border-border bg-bg-3 text-white/45"
                }`}
              >
                {formatPoint(item)}
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, 100))}
            className="mt-3 h-20 w-full resize-none rounded-2xl border border-border bg-bg-3 p-3 text-sm outline-none placeholder:text-white/25 focus:border-accent-2/40"
            placeholder="응원 메시지"
          />
          <button
            onClick={donate}
            disabled={submitting}
            className="mt-3 w-full rounded-2xl bg-gradient-to-r from-accent-2 to-rose-600 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            💝 {formatPoint(amount)} {submitting ? "후원 중…" : "후원하기"}
          </button>
        </>
      ) : (
        <div className="rounded-2xl border border-border bg-bg-3 p-5 text-center text-xs text-white/40">
          후원하려면{" "}
          <Link className="font-black text-accent-2" to="/login">
            로그인
          </Link>
          하세요.
        </div>
      )}
    </section>
  );
}
