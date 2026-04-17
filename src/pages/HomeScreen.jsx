import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { discoverGames } from "../api/game";
import SideBar from "../components/layout/SideBar";
import TopBar from "../components/layout/TopBar";
import GameCard from "../components/game/GameCard";
import { searchGames } from "../api/game";

export default function Home() {
  const [activeTab, setActiveTab] = useState("trending");
  const [errors, setErrors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const navItems = [
    { value: "trending", label: "Tendances" },
    { value: "recent", label: "Sorties" },
    { value: "upcoming", label: "Prochainement" },
  ];

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
    mutation.mutate({ search: searchResults });
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["discover", activeTab],
    queryFn: () => discoverGames({ type: activeTab }),
  });

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur</div>;

  return (
    <div className="flex flex-row min-h-screen bg-[#060a0f]">
      <SideBar></SideBar>
      <div className="flex flex-col flex-1 ">
        <TopBar onSearch={handleSearch}></TopBar>
        <div className="flex items-center justify-between mb-4">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={
                activeTab === item.value
                  ? "block p-3 rounded-lg bg-violet-900/20 text-violet-400 border-l-2 border-violet-500 active:scale-95 "
                  : "block p-3 rounded-lg text-[#4a6078] hover:bg-[#1C2D3E] active:scale-95"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4 p-6">
          {data.map((e) => (
            <GameCard
              key={e.rawgId}
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
