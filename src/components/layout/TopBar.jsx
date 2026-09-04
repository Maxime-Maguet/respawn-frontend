import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Bell, Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { searchGames } from "../../api/game";
import Input from "../ui/Input";
import { toast } from "sonner";
import { logout } from "../../redux/slices/userSlice";
export default function TopBar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.value);

  const [search, setSearch] = useState("");
  const [openDropDown, setOpenDropDown] = useState(false);

  const isLibrary = location.pathname === "/library";

  useEffect(() => {
    setSearch("");
  }, [location.pathname]);

  const searchMutation = useMutation({
    mutationFn: searchGames,
    onSuccess: (data) => {
      navigate("/home", { state: { searchResults: data } });
    },
  });

  const handleSearch = () => {
    if (search.trim()) searchMutation.mutate({ page_size: 50, search });
  };

  const handleKeyDown = (e) => {
    e.key === "Enter" && handleSearch();
  };

  const handleLogOut = () => {
    dispatch(logout());
    toast("Vous êtes deconnecté", {
      style: {
        background: "#1C2D3E",
        border: "1px solid #0d9488",
        color: "#F1F5F8",
      },
    });
    navigate("/home");
  };

  const date = new Date().getHours();

  return (
    <div className="flex h-16 items-center gap-2 bg-[#0d1520] px-3 sm:gap-3 sm:px-6 border-b border-[#2D4A63]/80">
      {!isLibrary ? (
        <div className="hidden w-48 shrink-0 items-center gap-1 whitespace-nowrap lg:flex">
          {user.token && (
            <div>
              <span className="text-sm text-[#4a6078]">
                {date < 12 ? "Bonjour," : "Bonsoir,"}
              </span>
              {"  "}
              <span className="text-sm font-semibold text-[#F1F5F8]">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden w-48 shrink-0 items-center text-sm text-[#C084FC] font-semibold tracking-widest font-[Orbitron] whitespace-nowrap uppercase md:flex">
          Ma Bibliothèque
        </div>
      )}

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3">
        <Input
          type="text"
          value={search}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un jeu"
          className="w-full max-w-md"
        />
        <Search
          size={18}
          className="shrink-0 cursor-pointer text-[#94A3B8] active:scale-95"
          onClick={handleSearch}
        />
      </div>
      {user.token ? (
        <div className="flex shrink-0 items-center justify-end gap-2 sm:w-48 sm:gap-3">
          <Bell size={18} className="hidden text-[#94A3B8] sm:block" />
          <div className="relative">
            <div
              onClick={() => setOpenDropDown((prev) => !prev)}
              className="rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-white cursor-pointer hover:scale-110 transition-all duration-200 ring-2 ring-[#7C3AED]/40 hover:ring-[#a78bfa]/60"
              style={{
                background: "linear-gradient(135deg, #5B21B6, #0d9488)",
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            {openDropDown && (
              <div className="absolute right-0 top-11 w-48 rounded-xl border border-[#2D4A63] bg-[#0d1520] shadow-xl shadow-black/50 flex flex-col overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#1a2d40]">
                  <p className="text-xs text-[#4a6078] uppercase tracking-widest">
                    Connecté en tant que
                  </p>
                  <p className="text-sm font-semibold text-[#F1F5F8] mt-0.5">
                    {user.username.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => handleLogOut()}
                  className="px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200 cursor-pointer text-left"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex shrink-0 items-center justify-end sm:w-48">
          <button
            onClick={() => navigate("/signin")}
            className="cursor-pointer rounded-xl border border-[#7C3AED] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#a78bfa] transition-all duration-200 hover:border-[#a78bfa] hover:bg-[#5B21B6]/20 sm:px-4 sm:text-xs"
          >
            Connexion
          </button>
        </div>
      )}
    </div>
  );
}
