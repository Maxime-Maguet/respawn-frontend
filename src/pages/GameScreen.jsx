import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { selectedGame } from "../api/game";
import {
  createLibrary,
  getLibrary,
  updateLibrary,
  deleteLibrary,
} from "../api/library";

import Button from "../components/ui/Button";

export default function GameScreen() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["game", params.id],
    queryFn: () => selectedGame({ id: params.id }),
    enabled: !!params.id,
  });

  const { data: libraryData } = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibrary(),
  });

  const isAdded =
    libraryData?.allData.some((g) => g.game?.rawgId === data?.data?.rawgId) ??
    false;

  const libraryEntry = libraryData?.allData?.find(
    (g) => g.game?.rawgId === data?.data?.rawgId,
  );
  console.log(libraryEntry);

  const addGameMutation = useMutation({
    mutationFn: createLibrary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
    onError: (error) => {
      setErrors(error.response?.data?.errors?.map((err) => err.msg) ?? []);
    },
  });

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

  const handleAdd = () => {
    setErrors([]);
    addGameMutation.mutate(data?.data?.rawgId);
  };

  const handleDelete = (id) => deleteMutation.mutate(id);
  const handleStatusChange = (id, status) =>
    updateMutation.mutate({ id, status });

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#94A3B8]">Chargement...</p>
      </div>
    );

  return (
    <div className="overflow-y-auto flex-1">
      {/* HERO */}
      <div className="relative w-full h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-60"
          style={{ backgroundImage: `url(${data?.data?.backgroundImage})` }}
        />
        <img
          src={data?.data?.backgroundImage}
          className="relative w-full h-full object-cover object-[center_30%] max-w-7xl mx-auto"
          alt="preview"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#060a0f] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#060a0f] to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-[#060a0f] via-[#060a0f]/40 to-transparent pointer-events-none"></div>
      </div>
      {/* FIN HERO */}

      <div className="px-6 py-6">
        <h1 className="text-white text-4xl font-bold font-['Orbitron']">
          {data?.data?.title}
        </h1>
        <div className="flex gap-3 mt-3">
          <span className="bg-[#1C2D3E] border border-[#2D4A63] text-[#F1F5F8] text-sm px-3 py-1 rounded-full">
            ⭐ {data?.data?.rating}
          </span>
          {data?.data?.metacritic && (
            <span className="bg-[#0d9488]/20 border border-[#0d9488]/40 text-[#0d9488] text-sm px-3 py-1 rounded-full">
              Metacritic {data?.data?.metacritic}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-8 px-6 pb-8">
        <div className="flex-1">
          <h2 className="text-[#F1F5F8] text-lg font-semibold mb-3">
            Description
          </h2>
          <p
            className={`text-[#94A3B8] text-sm leading-relaxed ${!isExpanded ? "line-clamp-4" : ""}`}
          >
            {data?.data?.description}
          </p>
          {data?.data?.description?.length > 600 && (
            <button
              className="mt-2 block text-[#a78bfa] hover:text-violet-300 text-xs tracking-wider transition-colors duration-150 cursor-pointer active:scale-95"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {!isExpanded ? "Lire la suite" : "Réduire"}
            </button>
          )}
        </div>

        <div className="w-72 flex flex-col gap-4">
          <div>
            <span className="text-[#4a6078] text-xs uppercase tracking-wider">
              Sortie
            </span>
            <p className="text-[#F1F5F8] text-sm mt-1">
              {data?.data?.released}
            </p>
          </div>
          <div>
            <span className="text-[#4a6078] text-xs uppercase tracking-wider">
              Genres
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data?.data?.genre.map((g) => (
                <span
                  key={g}
                  className="text-xs text-[#a78bfa] bg-violet-900/20 border border-violet-500/20 px-2 py-0.5 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[#4a6078] text-xs uppercase tracking-wider">
              Plateformes
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {data?.data?.platforms.map((p) => (
                <span
                  key={p}
                  className="text-xs text-[#94A3B8] bg-[#1C2D3E] border border-[#2D4A63] px-2 py-0.5 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[#4a6078] text-xs uppercase tracking-wider">
              Développeurs
            </span>
            <p className="text-[#F1F5F8] text-sm mt-1">
              {data?.data?.developers.join(", ")}
            </p>
          </div>

          {isAdded ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0d9488] shadow-lg shadow-teal-500/50"></div>
                <span className="text-[#0d9488] text-xs font-semibold uppercase tracking-widest">
                  Dans ta bibliothèque
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[#4a6078] text-xs uppercase tracking-wider">
                  Statut
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Pas encore joué", value: "pas encore joué" },
                    { label: "En cours", value: "en cours" },
                    { label: "Terminé", value: "terminé" },
                    { label: "Abandonné", value: "abandonné" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() =>
                        handleStatusChange(libraryEntry?._id, s.value)
                      }
                      className={`text-[10px] font-semibold px-2 py-2 rounded-lg border transition-all duration-200 cursor-pointer leading-tight
              ${
                libraryEntry?.status === s.value
                  ? s.value === "en cours"
                    ? "bg-[#0d9488]/20 border-[#0d9488]/60 text-[#0d9488]"
                    : s.value === "terminé"
                      ? "bg-[#5B21B6]/30 border-[#7C3AED]/60 text-[#a78bfa]"
                      : s.value === "abandonné"
                        ? "bg-red-900/30 border-red-700/60 text-red-300"
                        : "bg-[#1C2D3E] border-[#2D4A63] text-[#94A3B8]"
                  : "bg-transparent border-[#1a2d40] text-[#4a6078] hover:border-[#2D4A63] hover:text-[#94A3B8]"
              }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#1a2d40]"></div>

              <button
                onClick={() => handleDelete(libraryEntry?._id)}
                className="w-full text-xs font-semibold py-2.5 rounded-lg border border-red-900/50 text-red-400/70 hover:bg-red-900/20 hover:border-red-700/60 hover:text-red-300 transition-all duration-200 cursor-pointer"
              >
                Retirer de la bibliothèque
              </button>
            </div>
          ) : (
            <Button
              text="+ Ajouter à ma bibliothèque"
              className="w-72"
              type="button"
              onClick={handleAdd}
              variant="primary"
            />
          )}
        </div>
      </div>
    </div>
  );
}
