import { useNavigate } from "react-router-dom";

import { useStreamStore } from "@/entities/stream";
import { useUserStore } from "@/features/user";
import { formatPoint } from "@/shared";
import { usePointStore } from "@/widgets/payment/point-charge";

export function AppHeader() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.logout);
  const balance = usePointStore((state) => state.balance);
  const openCharge = usePointStore((state) => state.openCharge);
  const openAuth = usePointStore((state) => state.openAuth);
  const query = useStreamStore((state) => state.query);
  const setQuery = useStreamStore((state) => state.setQuery);
  const loadStreams = useStreamStore((state) => state.loadStreams);

  const openPointCharge = () => {
    if (token) openCharge();
    else openAuth();
  };

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-bg-2 px-4 py-3">
      <button
        onClick={() => navigate("/")}
        className="text-xl font-black tracking-tighter"
      >
        R<span className="text-accent">AI</span>O
      </button>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") void loadStreams();
        }}
        className="hidden max-w-sm flex-1 rounded-xl border border-border bg-bg-3 px-3 py-2 text-xs outline-none placeholder:text-white/25 focus:border-accent/40 sm:block"
        placeholder="스트리머 · 방송 · 태그 검색"
      />
      {token && (
        <button
          onClick={() => navigate("/stream/create")}
          className="hidden rounded-xl border border-border px-3 py-2 text-xs font-black text-white/50 hover:text-white md:block"
        >
          방송 만들기
        </button>
      )}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={openPointCharge}
          className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-black text-accent transition hover:border-accent/40 hover:bg-accent/15"
          aria-label="포인트 충전"
        >
          <span className="text-base leading-none">◎</span>
          {token ? formatPoint(balance) : "포인트 충전"}
          <span>＋</span>
        </button>

        {token ? (
          <div className="group relative">
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-cyan-600 text-xs font-black text-black">
              {user?.nickname?.[0] || "나"}
            </button>
            <div className="absolute right-0 top-11 z-50 hidden w-44 rounded-2xl border border-border bg-bg-3 p-2 shadow-2xl group-hover:block">
              <p className="px-3 py-2 text-[11px] text-white/40">
                {user?.nickname}
                <br />
                {user?.email}
              </p>
              <button
                onClick={signOut}
                className="w-full rounded-xl px-3 py-2 text-left text-xs font-bold text-white/55 hover:bg-bg-4 hover:text-white"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-black"
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
