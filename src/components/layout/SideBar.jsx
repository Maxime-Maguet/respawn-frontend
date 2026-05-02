import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getLibrary } from "../../api/library";
import logo_Respawn from "../../assets/logo_Respawn.png";
import { Home, Library, Settings } from "lucide-react";

export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const user = useSelector((state) => state.user.value);
  const token = user.token;

  const { data: libraryData } = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibrary(),
    enabled: !!token,
  });

  const total = libraryData?.allData?.length ?? 0;
  const enCours =
    libraryData?.allData?.filter((g) => g.status === "en cours").length ?? 0;
  const termines =
    libraryData?.allData?.filter((g) => g.status === "terminé").length ?? 0;
  const abandonnes =
    libraryData?.allData?.filter((g) => g.status === "abandonné").length ?? 0;
  const pasEncore =
    libraryData?.allData?.filter((g) => g.status === "pas encore joué")
      .length ?? 0;

  const navItems = [
    { path: "/home", label: "Accueil", icon: <Home size={18} /> },
    { path: "/library", label: "Bibliothèque", icon: <Library size={18} /> },
  ];

  // const bottomItems = [
  //   { path: "/settings", label: "Paramètres", icon: <Settings size={18} /> },
  // ];

  return (
    <div className="relative flex shrink-0">
      <div
        className={`${expanded ? "w-56" : "w-20"} min-h-screen bg-[#0d1520] border-r border-[#2D4A63]/80 flex flex-col py-4 transition-all duration-300 overflow-hidden`}
      >
        {/* LOGO */}
        <div className="flex items-center px-3 mb-6 gap-3">
          <img
            className="w-10 shrink-0 cursor-pointer"
            src={logo_Respawn}
            onClick={() => navigate("/home")}
          />
          {expanded && (
            <span className="text-[#a78bfa] font-['Orbitron'] text-sm font-bold uppercase tracking-widest whitespace-nowrap">
              Respawn
            </span>
          )}
        </div>

        {/* NAV ITEMS */}
        <div className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path, { state: null })}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${
                location.pathname === item.path
                  ? "bg-violet-900/20 text-violet-400 border-l-2 border-violet-500"
                  : "text-[#4a6078] hover:bg-[#1C2D3E] hover:text-[#94A3B8]"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {expanded && (
                <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* STATS — juste sous les nav */}
        {expanded && token && (
          <div className="mx-3 mt-6 rounded-xl border border-[#2D4A63] bg-[#060a0f] p-3 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, #5B21B6, #0d9488)",
                }}
              >
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-[#F1F5F8] text-xs font-semibold truncate">
                {user.username?.charAt(0).toUpperCase() +
                  user.username?.slice(1)}
              </span>
            </div>
            <div className="h-px bg-[#1a2d40]" />
            <div className="flex flex-col gap-2">
              {[
                { label: "Total", value: total, color: "text-[#a78bfa]" },
                { label: "En cours", value: enCours, color: "text-[#0d9488]" },
                { label: "Terminés", value: termines, color: "text-[#F1F5F8]" },
                {
                  label: "Abandonnés",
                  value: abandonnes,
                  color: "text-red-400",
                },
                {
                  label: "Pas encore joué",
                  value: pasEncore,
                  color: "text-[#4a6078]",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center"
                >
                  <span className="text-[#4a6078] text-xs">{stat.label}</span>
                  <span className={`${stat.color} text-xs font-bold`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1.5 rounded-full bg-[#1a2d40] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width:
                    total > 0
                      ? `${Math.round((termines / total) * 100)}%`
                      : "0%",
                  background: "linear-gradient(90deg, #5B21B6, #0d9488)",
                }}
              />
            </div>
            <span className="text-[#4a6078] text-xs text-center">
              {total > 0 ? Math.round((termines / total) * 100) : 0}% complétés
            </span>
          </div>
        )}

        {/* BOTTOM */}
        {/* <div className="mt-auto px-2 flex flex-col gap-1">
          {bottomItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path, { state: null })}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                location.pathname === item.path
                  ? "bg-violet-900/20 text-violet-400"
                  : "text-[#4a6078] hover:bg-[#1C2D3E] hover:text-[#94A3B8]"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {expanded && (
                <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div> */}
      </div>

      {/* TOGGLE TAB — grande, rectangulaire, bord droit */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-16 rounded-r-lg bg-[#1C2D3E] border border-l-0 border-[#2D4A63] hover:bg-[#5B21B6]/30 hover:border-[#7C3AED]/60 transition-all duration-200 cursor-pointer flex items-center justify-center z-10"
        style={{ boxShadow: "4px 0 12px rgba(0,0,0,0.4)" }}
      >
        <span className="text-[#a78bfa] text-xs font-bold">
          {expanded ? "‹" : "›"}
        </span>
      </button>
    </div>
  );
}
