import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo_Respawn from "../../assets/logo_Respawn.png";
import { Home, Library, Search, Settings } from "lucide-react";
export default function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { path: "/home", label: "Home", icon: <Home size={18} /> },
    { path: "/library", label: "Bibliothèque", icon: <Library size={18} /> },
    { path: "/search", label: "Recherche", icon: <Search size={18} /> },
  ];

  const bottomItems = [
    { path: "/settings", label: "Paramètres", icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-20 min-h-screen bg-[#0d1520] border-r border-[#2D4A63]/80 flex flex-col items-center py-4 ">
      <img className={"w-14 mb-4"} src={logo_Respawn} />
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path, { state: null })}
          className={
            location.pathname === item.path
              ? "block p-3 rounded-lg bg-violet-900/20 text-violet-400 border-l-2 border-violet-500 active:scale-95"
              : "block p-3 rounded-lg text-[#4a6078] hover:bg-[#1C2D3E] active:scale-95"
          }
        >
          {item.icon}
        </button>
      ))}
      <div className="mt-auto">
        {bottomItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path, { state: null })}
            className={
              location.pathname === item.path
                ? "block p-3 rounded-lg bg-violet-900/20 text-violet-400"
                : "block p-3 rounded-lg text-[#4a6078] hover:bg-[#1C2D3E]"
            }
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
