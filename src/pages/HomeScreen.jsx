import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { discoverGames } from "../api/game";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/layout/SideBar";
import TopBar from "../components/layout/TopBar";
import GameCard from "../components/game/GameCard";
import { searchGames } from "../api/game";

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trending");
  const [errors, setErrors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const navItems = [
    { value: "trending", label: "Tendances" },
    { value: "recent", label: "Sorties" },
    { value: "upcoming", label: "Prochainement" },
  ];

  const activeButton = navItems.find((e) => e.value === activeTab)?.label;

  const mutation = useMutation({
    mutationFn: searchGames,
    onSuccess: (data) => {
      setSearchResults(data);
    },
    onError: (error) => {
      setErrors(error.response.data.errors.map((err) => err.msg));
    },
  });

  const handleSearch = (searchResults) => {
    mutation.mutate({ page_size: 20, search: searchResults });
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["discover", activeTab],
    queryFn: () => discoverGames({ type: activeTab }),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur</div>;

  const gameToDisplay = searchResults.length > 0 ? searchResults : data;

  return (
    <div className="flex flex-row min-h-screen bg-[#060a0f]">
      <SideBar></SideBar>
      <div className="flex flex-col flex-1 ">
        <TopBar onSearch={handleSearch}></TopBar>
        <div className="h-13 mx-auto w-fit bg-[#0d1520] border border-[#1a2d40] rounded-lg  text-[#EF4444] text-xs flex mt-6 px-2">
          <div className="flex items-center justify-center">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  setActiveTab(item.value);
                  setSearchResults([]);
                }}
                className={
                  activeTab !== item.value || searchResults.length > 0
                    ? "block p-3 rounded-lg text-[#4a6078] hover:bg-[#1C2D3E] hover:border-[#0d1520]/70 active:scale-95 cursor-pointer"
                    : "block p-3 rounded-lg bg-violet-900/20 text-violet-400 border border-violet-500/20 active:scale-95 cursor-pointer "
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
              onClick={() => setSearchResults([])}
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
    </div>
  );
}
