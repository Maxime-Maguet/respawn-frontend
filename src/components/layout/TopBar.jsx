import {} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Bell, Search } from "lucide-react";
import Input from "../ui/Input";

export default function TopBar({ onSearch }) {
  const user = useSelector((state) => state.user.value.username);

  const [search, setSearch] = useState("");

  const handleKeyDown = (e) => {
    e.key === "Enter" && onSearch(search);
  };

  const date = new Date().getHours();
  return (
    <div className="h-16 flex items-center px-6 bg-[#0d1520] border-b border-[#2D4A63]/80">
      <div className="w-48 text-sm text-[#7b8799] tracking-wide whitespace-nowrap">
        {date < 12 ? "Bonjour" : "Bonsoir"}
        {"  "}
        <span className="text-sm font-bold text-white">
          {user.charAt(0).toUpperCase() + user.slice(1)}
        </span>
      </div>
      <div className="flex-1 flex justify-center items-center gap-3">
        <Input
          type={"text"}
          value={search}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={"Rechercher un jeu"}
          className="w-full max-w-md"
        />
        <Search
          size={18}
          className="text-[#94A3B8] active:scale-95 cursor-pointer"
          onClick={() => onSearch(search)}
        />
      </div>
      <div className="w-48 flex items-center justify-end gap-3">
        <Bell size={18} className="text-[#94A3B8]" />
        <div className="rounded-full w-8 h-8 bg-[#7C3AED] flex items-center justify-center text-sm font-bold text-white">
          {user.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
