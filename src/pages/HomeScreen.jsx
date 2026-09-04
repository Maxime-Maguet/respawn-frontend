import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { discoverGames } from "../api/game";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import GameCard from "../components/game/GameCard";
import { MdLibraryAddCheck } from "react-icons/md";

import { createLibrary, getLibrary } from "../api/library";
import AuthModal from "../components/auth/AuthModal";

import { toast } from "sonner";

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

  const { data: libraryData } = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibrary(),
    enabled: !!token,
  });

  const addGameMutation = useMutation({
    mutationFn: createLibrary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
      toast("Jeu ajouté à ta bibliothèque !", {
        style: {
          background: "#1C2D3E",
          border: "1px solid #0d9488",
          color: "#F1F5F8",
        },
      });
    },
  });

  const handleAdd = (rawgId) => {
    if (!token) {
      setOpenAuthModal((prev) => !prev);
      return;
    }
    addGameMutation.mutate(rawgId);
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
    searchResults.length > 0
      ? searchResults
      : activeTab === "trending"
        ? data.slice(1)
        : data;
  const topGame = data?.[0];

  const isTopGameAdded =
    libraryData?.allData.some((g) => g.game?.rawgId === topGame.rawgId) ??
    false;

  return (
    <div className="overflow-y-auto flex-1">
      {activeTab === "trending" && searchResults.length === 0 && (
        <div
          className="relative mx-4 mt-4 h-56 overflow-hidden rounded-2xl group sm:mx-auto sm:mt-6 sm:h-80 sm:max-w-5xl"
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

          <div className="relative flex h-full max-w-2xl flex-col justify-end p-4 sm:justify-center sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse shadow-lg shadow-violet-500/50" />
              <span className="text-[#a78bfa] text-xs font-bold uppercase tracking-widest font-['Orbitron']">
                Tendance · #1 cette semaine
              </span>
            </div>
            <h1 className="mb-3 text-2xl font-bold leading-tight text-white font-['Orbitron'] sm:text-4xl lg:text-6xl">
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

            <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:gap-3">
              {isTopGameAdded ? (
                <button
                  className="flex w-full cursor-default items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white opacity-90 sm:w-auto"
                  style={{
                    background: "linear-gradient(135deg, #0d9488, #0f766e)",
                    boxShadow: "0 4px 14px rgba(13,148,136,0.35)",
                  }}
                >
                  <MdLibraryAddCheck size={14} />
                  Dans ma lib
                </button>
              ) : (
                <button
                  onClick={() => handleAdd(topGame.rawgId)}
                  className="w-full cursor-pointer rounded-xl py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] sm:w-48"
                  style={{
                    background: "linear-gradient(135deg, #5B21B6, #7C3AED)",
                    boxShadow: "0 4px 14px rgba(91,33,182,0.35)",
                  }}
                >
                  + Ajouter à ma Lib
                </button>
              )}
              <button
                onClick={() => navigate(`/game/${topGame.rawgId}`)}
                className="w-full cursor-pointer rounded-xl border border-[#7C3AED] py-3 text-xs font-bold uppercase tracking-widest text-[#a78bfa] transition-all duration-200 hover:border-[#a78bfa] hover:bg-[#5B21B6]/20 hover:scale-[1.02] active:scale-[0.98] sm:w-48"
              >
                Voir la fiche →
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#0d9488] to-transparent opacity-60" />
        </div>
      )}
      <div className="mx-4 mt-4 flex h-13 w-auto max-w-full justify-center overflow-x-auto rounded-lg border border-[#1a2d40] bg-[#0d1520] px-2 sm:mx-auto sm:mt-6 sm:w-fit">
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
                  ? "block cursor-pointer rounded-lg p-2 text-xs text-[#4a6078] hover:bg-[#1C2D3E] active:scale-95 sm:p-3 sm:text-sm"
                  : "block cursor-pointer rounded-lg border border-violet-500/20 bg-violet-900/20 p-2 text-xs text-violet-400 active:scale-95 sm:p-3 sm:text-sm"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4 flex items-center gap-3 px-4 sm:px-6">
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

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
        {gameToDisplay.map((e) => (
          <GameCard
            key={e.rawgId}
            rawgId={e.rawgId}
            backgroundImage={e.backgroundImage}
            title={e.title}
            genre={e.genres[0]?.name}
            platforms={e.platforms}
            addGame={() => handleAdd(e.rawgId)}
            isAdded={
              libraryData?.allData.some((g) => g.game?.rawgId === e.rawgId) ??
              false
            }
          />
        ))}
      </div>
      {openAuthModal && <AuthModal onClose={() => setOpenAuthModal(false)} />}
    </div>
  );
}
