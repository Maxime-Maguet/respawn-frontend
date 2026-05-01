import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { discoverGames } from "../api/game";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import GameCard from "../components/game/GameCard";

import { createLibrary } from "../api/library";
import AuthModal from "../components/auth/AuthModal";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.user.value.token);

  const [activeTab, setActiveTab] = useState("trending");
  const [openAuthModal, setOpenAuthModal] = useState(false);

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

  const addGameMutation = useMutation({
    mutationFn: createLibrary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
  });

  const handleAdd = () => {
    if (!token) {
      setOpenAuthModal((prev) => !prev);
      return;
    }
    addGameMutation.mutate(topGame.rawgId);
  };

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

  const gameToDisplay =
    searchResults.length > 0 ? searchResults : data.slice(1);

  const topGame = data?.[0];

  console.log(data);

  return (
    <div className="overflow-y-auto flex-1">
      {activeTab === "trending" && searchResults.length === 0 && (
        <div
          className="relative mx-auto mt-6 h-80 rounded-2xl overflow-hidden group max-w-5xl"
          style={{
            border: "1px solid #2D4A63",
            boxShadow:
              "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(91,33,182,0.15)",
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-position-[center_30%] transition-transform duration-700"
            style={{ backgroundImage: `url(${topGame.backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#060a0f] via-[#060a0f]/50 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-[#060a0f]/70 via-[#060a0f]/20 to-transparent" />

          <div className="relative h-full flex flex-col justify-center p-8 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse shadow-lg shadow-violet-500/50" />
              <span className="text-[#a78bfa] text-xs font-bold uppercase tracking-widest font-['Orbitron']">
                Tendance · #1 cette semaine
              </span>
            </div>
            <h1 className="text-white text-6xl  leading-tight mb-3 font-bold font-['Orbitron']">
              {topGame.title}
            </h1>

            <div>
              <div className="flex flex-wrap gap-2 mt-1">
                {topGame.genres.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs text-[#a78bfa] bg-violet-900/20 border border-violet-500/20 px-2 py-0.5 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => handleAdd()}
                className="w-48 text-xs font-bold py-3 rounded-xl text-white uppercase tracking-widest transition-all duration-200 cursor-pointer hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #5B21B6, #7C3AED)",
                  boxShadow: "0 4px 14px rgba(91,33,182,0.35)",
                }}
              >
                + Ajouter à ma Lib
              </button>
              <button
                onClick={() => navigate(`/game/${topGame.rawgId}`)}
                className="w-48 text-xs font-bold py-3 rounded-xl border border-[#7C3AED] text-[#a78bfa] uppercase tracking-widest transition-all duration-200 cursor-pointer hover:bg-[#5B21B6]/20 hover:border-[#a78bfa] hover:scale-[1.02] active:scale-[0.98]"
              >
                Voir la fiche →
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#0d9488] to-transparent opacity-60" />
        </div>
      )}
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
            platforms={e.platforms}
          />
        ))}
      </div>
      {openAuthModal && <AuthModal onClose={() => setOpenAuthModal(false)} />}
    </div>
  );
}
