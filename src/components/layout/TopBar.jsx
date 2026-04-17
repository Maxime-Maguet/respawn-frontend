import {} from "lucide-react";
import { useState } from "react";

import Input from "../ui/Input";

export default function TopBar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleKeyDown = (e) => {
    e.key === "Enter" && onSearch(search);
  };
  return (
    <div className="h-16 flex items-center px-6 bg-[#0d1520] border-b border-[#2D4A63]/80">
      <Input
        type={"text"}
        value={search}
        onKeyDown={handleKeyDown}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={"Rechercher un jeu"}
      />
    </div>
  );
}
