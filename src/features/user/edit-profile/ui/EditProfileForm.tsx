import { useState } from "react";

import { useUserStore } from "@/features/user";

export function EditProfileForm() {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const refreshToken = useUserStore((state) => state.refreshToken);
  const setSession = useUserStore((state) => state.setSession);

  const [nickname, setNickname] = useState(user?.nickname ?? "");

  const handleSubmit = () => {
    if (!user || !token || !refreshToken) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    setSession(
      {
        ...user,
        nickname,
      },
      token,
      refreshToken,
    );

    alert("회원 정보가 수정되었습니다.");
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-bg-2 p-6">
      <h2 className="mb-5 text-lg font-black text-white">회원 정보 수정</h2>

      <div className="space-y-3">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임"
          className="w-full rounded-2xl border border-white/10 bg-bg-3 px-4 py-3 outline-none"
        />

        <button
          onClick={handleSubmit}
          className="rounded-2xl bg-accent px-5 py-3 font-bold text-black"
        >
          저장하기
        </button>
      </div>
    </section>
  );
}
