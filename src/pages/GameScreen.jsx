import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { selectedGame } from "../api/game";
import { createLibrary, getLibrary } from "../api/library";
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

  const addGameMutation = useMutation({
    mutationFn: createLibrary,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
    onError: (error) => {
      setErrors(error.response?.data?.errors?.map((err) => err.msg) ?? []);
    },
  });

  const handleAdd = () => {
    setErrors([]);
    addGameMutation.mutate(data?.data?.rawgId);
  };

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#94A3B8]">Chargement...</p>
      </div>
    );

  return (
    <div className="overflow-y-auto flex-1">
      <div className="relative w-full">
        <img
          src={data?.data?.backgroundImage}
          className="w-full h-80 object-cover object-[center_35%]"
          alt="preview"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#060a0f] via-[#060a0f]/40 to-transparent"></div>
      </div>

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
          <Button
            text={isAdded ? "✓ Ajouté" : "+ Ajouter à ma bibliothèque"}
            className="w-72"
            type="button"
            onClick={handleAdd}
            disabled={isAdded}
            variant={isAdded ? "success" : "primary"}
          />
        </div>
      </div>
    </div>
  );
}
