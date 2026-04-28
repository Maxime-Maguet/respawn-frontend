import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { discoverGames } from "../api/game";
import { useLocation, useNavigate } from "react-router-dom";
import GameCard from "../components/game/GameCard";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trending");

  const navItems = [
    { value: "trending", label: "Tendances" },
    { value: "recent", label: "Sorties" },
    { value: "upcoming", label: "Prochainement" },
  ];

  const activeButton = navItems.find((e) => e.value === activeTab)?.label;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["discover", activeTab],
    queryFn: () => discoverGames({ type: activeTab }),
  });

  const searchResults = location.state?.searchResults ?? [];

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#94A3B8]">Chargement...</p>
      </div>
    );
  if (isError)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-400">Erreur</p>
      </div>
    );

  const gameToDisplay = searchResults.length > 0 ? searchResults : data;

  return (
    <div className="overflow-y-auto flex-1">
      <div className="h-13 mx-auto w-fit bg-[#0d1520] border border-[#1a2d40] rounded-lg flex mt-6 px-2">
        <div className="flex items-center justify-center">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setActiveTab(item.value);
                navigate("/home", { state: null });
              }}
              className={
                activeTab !== item.value || searchResults.length > 0
                  ? "block p-3 rounded-lg text-[#4a6078] hover:bg-[#1C2D3E] active:scale-95 cursor-pointer"
                  : "block p-3 rounded-lg bg-violet-900/20 text-violet-400 border border-violet-500/20 active:scale-95 cursor-pointer"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="flex items-center gap-3 px-6 mt-4">
          <button
            onClick={() => navigate("/home", { state: null })}
            className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#F1F5F8] transition-colors cursor-pointer"
          >
            ← Retour aux {activeButton}
          </button>
          <span className="text-[#4a6078] text-sm">
            {searchResults.length} résultats
          </span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 p-6">
        {gameToDisplay.map((e) => (
          <GameCard
            key={e.rawgId}
            rawgId={e.rawgId}
            backgroundImage={e.backgroundImage}
            title={e.title}
            genre={e.genres[0]?.name}
          />
        ))}
      </div>
    </div>
  );
}
