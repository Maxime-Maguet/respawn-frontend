import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Bell, Search } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { searchGames } from "../../api/game";
import Input from "../ui/Input";

export default function TopBar() {
  const user = useSelector((state) => state.user.value.username);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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

  const date = new Date().getHours();

  return (
    <div className="h-16 flex items-center px-6 bg-[#0d1520] border-b border-[#2D4A63]/80">
      {!isLibrary ? (
        <div className="w-48 shrink-0 flex items-center gap-1 whitespace-nowrap">
          <span className="text-sm text-[#4a6078]">
            {date < 12 ? "Bonjour," : "Bonsoir,"}
          </span>
          <span className="text-sm font-semibold text-[#F1F5F8]">
            {user.charAt(0).toUpperCase() + user.slice(1)}
          </span>
        </div>
      ) : (
        <div className="w-48 shrink-0 text-sm text-[#C084FC] font-semibold tracking-widest font-[Orbitron] whitespace-nowrap uppercase flex items-center">
          Ma Bibliothèque
        </div>
      )}

      <div className="flex-1 flex justify-center items-center gap-3">
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
          className="text-[#94A3B8] active:scale-95 cursor-pointer"
          onClick={handleSearch}
        />
      </div>

      <div className="w-48 shrink-0 flex items-center justify-end gap-3">
        <Bell size={18} className="text-[#94A3B8]" />
        <div className="rounded-full w-8 h-8 bg-[#7C3AED] flex items-center justify-center text-sm font-bold text-white">
          {user.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
