import { useLocation, useNavigate } from "react-router-dom";
import { Home, Library } from "lucide-react";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { path: "/home", label: "Accueil", icon: Home },
    { path: "/library", label: "Bibliothèque", icon: Library },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#2D4A63]/80 bg-[#0d1520] pb-[env(safe-area-inset-bottom)] desktop:hidden">
      <div className="flex">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.path === "/home"
              ? location.pathname === "/home" ||
                location.pathname.startsWith("/game/")
              : location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path, { state: null })}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${
                active ? "text-violet-400" : "text-[#4a6078]"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
