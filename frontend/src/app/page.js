import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#080b14] text-white font-sans overflow-hidden">

      {/* Ambient Glows */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 w-[420px] h-[420px] rounded-full bg-purple-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute top-[40%] left-[55%] w-[300px] h-[300px] rounded-full bg-pink-600/8 blur-[80px]" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-[34px] h-[34px] rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-[17px] font-medium tracking-tight">Metaverse 2D</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-5 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-full"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm font-medium text-slate-200 bg-white/7 hover:bg-white/12 border border-white/15 rounded-full transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-12 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/12 border border-indigo-500/30 text-indigo-300 text-xs font-medium tracking-widest uppercase mb-8">
          <span className="relative flex h-[7px] w-[7px]">
            <span className="animate-ping absolute inset-0 rounded-full bg-indigo-400 opacity-70" />
            <span className="relative rounded-full h-[7px] w-[7px] bg-indigo-500" />
          </span>
          Beta now live
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(36px,6vw,68px)] font-bold leading-[1.08] tracking-[-1.5px] text-slate-100 mb-5">
          The virtual office
          <br />
          your team will{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            actually use
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-10">
          Walk around a 2D world, talk to people with proximity audio, and feel
          like you're actually together — without the commute.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-[15px] font-medium transition-all hover:-translate-y-0.5"
          >
            Enter the metaverse
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <a
            href="https://github.com/Shubham00097/Metaverse_2D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/9 border border-white/12 text-slate-200 text-[15px] font-medium transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.912.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            View on GitHub
          </a>
        </div>

        {/* Browser Preview Mockup */}
        <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/8 mb-20">
          {/* Browser Bar */}
          <div className="bg-[#111827] px-4 py-2.5 flex items-center gap-3 border-b border-white/6">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center">
              <span className="inline-block bg-white/5 rounded-md px-4 py-1 text-[11px] text-slate-500 font-mono">
                metaverse2d.app / world
              </span>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative bg-[#0d1526] h-[320px] overflow-hidden">
            {/* Grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Rooms */}
            <div className="absolute top-8 left-20 w-36 h-22 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center">
              <span className="text-[11px] font-medium text-indigo-400 text-center leading-tight">
                Conference
                <br />
                Room A
              </span>
            </div>
            <div className="absolute top-8 right-16 w-28 h-20 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
              <span className="text-[11px] font-medium text-purple-400">Lounge</span>
            </div>
            <div className="absolute bottom-10 left-16 w-40 h-24 rounded-xl border border-teal-500/25 bg-teal-500/10 flex items-center justify-center">
              <span className="text-[11px] font-medium text-teal-400">Open Office</span>
            </div>
            <div className="absolute bottom-10 right-20 w-28 h-20 rounded-xl border border-pink-500/25 bg-pink-500/10 flex items-center justify-center">
              <span className="text-[11px] font-medium text-pink-400">Stage</span>
            </div>

            {/* Avatars */}
            {/* Alex — with audio ripple */}
            <div className="absolute flex flex-col items-center gap-1" style={{ top: "54%", left: "33%" }}>
              <div className="relative">
                <span className="absolute inset-0 rounded-full border border-indigo-400/40 animate-ping" />
                <span className="absolute -inset-2 rounded-full border border-indigo-400/20 animate-ping [animation-delay:0.5s]" />
                <div className="relative w-7 h-7 rounded-full bg-indigo-500 border-2 border-white/20 flex items-center justify-center text-[11px] font-medium z-10">
                  A
                </div>
              </div>
              <span className="text-[10px] text-slate-400 bg-black/50 px-1.5 py-0.5 rounded">Alex</span>
            </div>

            {/* Jess */}
            <div className="absolute flex flex-col items-center gap-1" style={{ top: "43%", left: "44%" }}>
              <div className="w-7 h-7 rounded-full bg-pink-500 border-2 border-white/20 flex items-center justify-center text-[11px] font-medium">
                J
              </div>
              <span className="text-[10px] text-slate-400 bg-black/50 px-1.5 py-0.5 rounded">Jess</span>
            </div>

            {/* Kai */}
            <div className="absolute flex flex-col items-center gap-1" style={{ top: "60%", right: "27%" }}>
              <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white/20 flex items-center justify-center text-[11px] font-medium">
                K
              </div>
              <span className="text-[10px] text-slate-400 bg-black/50 px-1.5 py-0.5 rounded">Kai</span>
            </div>

            {/* Proximity dashed line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line
                x1="36%"
                y1="57%"
                x2="47%"
                y2="50%"
                stroke="rgba(99,102,241,0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-white/6 pt-12 mb-20">
          <div>
            <div className="text-3xl font-bold tracking-tight text-indigo-400">&lt; 50ms</div>
            <div className="text-sm text-slate-500 mt-1">Real-time latency</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-purple-400">WebRTC</div>
            <div className="text-sm text-slate-500 mt-1">Peer-to-peer audio</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-pink-400">100%</div>
            <div className="text-sm text-slate-500 mt-1">Open source</div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-24">
        <p className="text-center text-xs text-slate-600 uppercase tracking-[0.08em] font-medium mb-3">
          Built different
        </p>
        <h2 className="text-center text-[clamp(22px,3.5vw,34px)] font-semibold text-slate-200 tracking-tight mb-2">
          Everything your remote team needs
        </h2>
        <p className="text-center text-[15px] text-slate-500 mb-12">
          No heavy clients, no paywalls — just open a browser and walk in.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="group p-6 rounded-2xl bg-white/3 border border-white/8 hover:bg-white/6 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3 className="text-[15px] font-medium text-slate-200 mb-2">Interactive map</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Move your avatar freely with WASD. Watch teammates move in real-time via Socket.io — no lag, no jitter.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/3 border border-white/8 hover:bg-white/6 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 flex items-center justify-center mb-5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.5">
                <path strokeLinecap="round" d="M12 1v11M9 18.5A5 5 0 007 14V8h10v6a5 5 0 00-2 4.5M9 21h6" />
              </svg>
            </div>
            <h3 className="text-[15px] font-medium text-slate-200 mb-2">Proximity audio</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Walk up to a colleague and their voice gets louder. Walk away and it fades — just like a real office floor.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/3 border border-white/8 hover:bg-white/6 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-teal-500/15 flex items-center justify-center mb-5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <h3 className="text-[15px] font-medium text-slate-200 mb-2">Persistent identity</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Sign up once, pick your avatar color, and your presence persists every time you return to the world.
            </p>
          </div>

          <div className="group p-6 rounded-2xl bg-white/3 border border-white/8 hover:bg-white/6 transition-all hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-pink-500/15 flex items-center justify-center mb-5">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.5">
                <path strokeLinecap="round" d="M3 12a9 9 0 1018 0 9 9 0 00-18 0M12 3v9l4 4" />
              </svg>
            </div>
            <h3 className="text-[15px] font-medium text-slate-200 mb-2">Always-on rooms</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Dedicated spaces for standups, focus work, and social hangouts. No scheduling — just walk in.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/6 py-8 text-center">
        <p className="text-[13px] text-slate-700">
          Built for the future of remote work · Open source · Free to use
        </p>
      </footer>

    </div>
  );
}