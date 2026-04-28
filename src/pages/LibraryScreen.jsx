import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLibrary, updateLibrary, deleteLibrary } from "../api/library";
import LibraryCard from "../components/game/LibraryCard";
import { useState } from "react";

export default function LibraryScreen() {
  const queryClient = useQueryClient();

  const [activeFilter, setActiveFilter] = useState("tous");

  const filters = [
    { label: "Tous", value: "tous" },
    { label: "En cours", value: "en cours" },
    { label: "Terminés", value: "terminé" },
    { label: "A jouer", value: "pas encore joué" },
    { label: "Abandonnés", value: "abandonné" },
  ];

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateLibrary(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
    onError: (err) => console.error(err),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLibrary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
    onError: (err) => console.error(err),
  });

  const handleDelete = (id) => deleteMutation.mutate(id);
  const handleStatusChange = (id, status) =>
    updateMutation.mutate({ id, status });

  const { data: libraryData } = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibrary(),
  });

  const total = libraryData?.allData?.length;

  const gameStatus = (games, status) =>
    games?.filter((game) => game.status === status).length;

  const filteredGames = libraryData?.allData?.filter((f) =>
    activeFilter === "tous" ? true : f.status === activeFilter,
  );

  return (
    <div className="overflow-y-auto flex-1">
      <div className="grid grid-cols-4 gap-3 p-6">
        <div className="bg-[#1C2D3E] border border-[#2D4A63] rounded-lg p-4">
          <p className="text-[#4a6078] text-xs uppercase tracking-wider mb-1">
            Total
          </p>
          <p className="text-[#a78bfa] text-2xl font-bold">{total ?? 0}</p>
        </div>
        <div className="bg-[#1C2D3E] border border-[#2D4A63] rounded-lg p-4">
          <p className="text-[#4a6078] text-xs uppercase tracking-wider mb-1">
            En cours
          </p>
          <p className="text-[#0d9488] text-2xl font-bold">
            {gameStatus(libraryData?.allData, "en cours") ?? 0}
          </p>
        </div>
        <div className="bg-[#1C2D3E] border border-[#2D4A63] rounded-lg p-4">
          <p className="text-[#4a6078] text-xs uppercase tracking-wider mb-1">
            Terminés
          </p>
          <p className="text-[#F1F5F8] text-2xl font-bold">
            {gameStatus(libraryData?.allData, "terminé") ?? 0}
          </p>
        </div>
        <div className="bg-[#1C2D3E] border border-[#2D4A63] rounded-lg p-4">
          <p className="text-[#4a6078] text-xs uppercase tracking-wider mb-1">
            À jouer
          </p>
          <p className="text-[#F1F5F8] text-2xl font-bold">
            {gameStatus(libraryData?.allData, "pas encore joué") ?? 0}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 ">
        <span className="text-sm text-[#4a6078] shrink-0"> Filtrer :</span>
        <div className="flex gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setActiveFilter(item.value);
              }}
              className={
                activeFilter === item.value
                  ? "px-4 py-1.5 rounded-full text-xs font-semibold bg-violet-900/30 text-violet-400 border border-violet-500/40 cursor-pointer"
                  : "px-4 py-1.5 rounded-full text-xs text-[#4a6078] border border-[#2D4A63] hover:border-[#7C3AED] hover:text-[#a78bfa] transition-colors cursor-pointer"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-6">
        {filteredGames?.map((e) => (
          <LibraryCard
            key={e.game.rawgId}
            _id={e._id}
            status={e.status}
            backgroundImage={e.game.backgroundImage}
            title={e.game.title}
            genre={e.game.genres.map((g) => g?.name)}
            onDelete={() => handleDelete(e._id)}
            onStatusChange={(s) => handleStatusChange(e._id, s)}
          />
        ))}
      </div>
    </div>
  );
}
