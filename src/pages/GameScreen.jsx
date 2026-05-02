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
import JournalModal from "../components/game/JournalModal";
import AuthModal from "../components/auth/AuthModal";
import ConfirmModal from "../components/game/ConfirmModal";

import { useSelector } from "react-redux";

import { toast } from "sonner";

import { FaSteam } from "react-icons/fa";
import { SiEpicgames } from "react-icons/si";
import { FaPlaystation, FaXbox } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";

export default function GameScreen() {
  const params = useParams();
  const queryClient = useQueryClient();

  const token = useSelector((state) => state.user.value.token);

  const [errors, setErrors] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openConfirmModal, setOpenCOnfirmModal] = useState(false);

  const storeMap = [
    { key: "steampowered", label: "Steam", icon: <FaSteam /> },
    { key: "epicgames", label: "Epic Games", icon: <SiEpicgames /> },
    { key: "playstation", label: "Playstation", icon: <FaPlaystation /> },
    { key: "microsoft", label: "Xbox", icon: <FaXbox /> },
    { key: "nintendo", label: "Nintendo", icon: <BsNintendoSwitch /> },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ["game", params.id],
    queryFn: () => selectedGame({ id: params.id }),
    enabled: !!params.id,
  });

  const { data: libraryData } = useQuery({
    queryKey: ["library"],
    queryFn: () => getLibrary(),
    enabled: !!token,
  });

  const screenshots = data?.data?.screenshots ?? [];
  const stores = data?.data?.stores;

  console.log(data?.data?.stores);

  const isAdded =
    libraryData?.allData.some((g) => g.game?.rawgId === data?.data?.rawgId) ??
    false;

  const libraryEntry = libraryData?.allData?.find(
    (g) => g.game?.rawgId === data?.data?.rawgId,
  );

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
    onError: (error) => {
      setErrors(error.response?.data?.errors?.map((err) => err.msg) ?? []);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, rating, journal }) =>
      updateLibrary(id, { status, rating, journal }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
    onError: (err) => console.error(err),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLibrary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
      toast("Jeu retiré de ta bibliothèque !", {
        style: {
          background: "#1C2D3E",
          border: "1px solid #7C3AED",
          color: "#F1F5F8",
        },
      });
    },
    onError: (err) => console.error(err),
  });

  const handleAdd = () => {
    if (!token) {
      setOpenAuthModal((prev) => !prev);
      return;
    }
    setErrors([]);
    addGameMutation.mutate(data?.data?.rawgId);
  };

  const handleDelete = (id) => deleteMutation.mutate(id);

  const handleStatusChange = (id, status) =>
    updateMutation.mutate({ id, status });

  const handleRatingChange = (id, rating) =>
    updateMutation.mutate({ id, rating });

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
          className="relative w-full h-full object-cover object-[center_30%]"
          alt="preview"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#060a0f] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#060a0f] to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-[#060a0f] via-[#060a0f]/40 to-transparent pointer-events-none" />
      </div>

      {/* TITRE + BADGES */}
      <div className="px-6 py-6">
        <h1 className="text-white text-4xl font-bold font-['Orbitron']">
          {data?.data?.title}
        </h1>
        <div className="flex gap-3 mt-3">
          {data?.data?.rating === 0 ? (
            <span className="bg-[#1C2D3E] border border-[#2D4A63] text-[#4a6078] text-sm px-3 py-1 rounded-full">
              Pas encore noté
            </span>
          ) : (
            <span className="bg-[#1C2D3E] border border-[#2D4A63] text-[#F1F5F8] text-sm px-3 py-1 rounded-full">
              ⭐ {data?.data?.rating}
            </span>
          )}

          {data?.data?.metacritic && (
            <span className="bg-[#0d9488]/20 border border-[#0d9488]/40 text-[#0d9488] text-sm px-3 py-1 rounded-full">
              Metacritic {data?.data?.metacritic}
            </span>
          )}
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="flex gap-8 px-6 pb-8">
        {/* COLONNE GAUCHE */}
        <div className="flex-1 min-w-0">
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

          {/* CARROUSEL */}
          {screenshots.length > 0 && (
            <div className="mt-6">
              <h2 className="text-[#F1F5F8] text-lg font-semibold mb-4">
                Screenshots
              </h2>
              <div className="relative w-full max-w-[80%] aspect-video rounded-2xl overflow-hidden border border-[#1a2d40] mb-3 group">
                <img
                  src={screenshots[activeIndex]}
                  alt={`Screenshot ${activeIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-[#94A3B8] text-xs px-3 py-1 rounded-full border border-[#2D4A63]">
                  {activeIndex + 1} / {screenshots.length}
                </div>
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === 0 ? screenshots.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-[#2D4A63] hover:border-[#7C3AED]/60 hover:bg-[#5B21B6]/30 text-[#F1F5F8] text-lg flex items-center justify-center transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev === screenshots.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-[#2D4A63] hover:border-[#7C3AED]/60 hover:bg-[#5B21B6]/30 text-[#F1F5F8] text-lg flex items-center justify-center transition-all duration-200 cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  ›
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer ${
                      activeIndex === index
                        ? "border-[#7C3AED] scale-105 shadow-lg shadow-[#5B21B6]/40"
                        : "border-[#1a2d40] opacity-50 hover:opacity-80 hover:border-[#2D4A63]"
                    }`}
                  >
                    <img
                      src={screenshot}
                      alt={`thumb ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLONNE DROITE */}
        <div className="w-72 flex flex-col gap-4 shrink-0">
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
          {stores && stores.length > 0 && (
            <div>
              <span className="text-[#4a6078] text-xs uppercase tracking-wider">
                Où acheter
              </span>
              <div className="flex flex-col gap-2 mt-2">
                {stores?.map((url, index) => {
                  const store = storeMap.find((store) =>
                    url.includes(store.key),
                  );
                  return store ? (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#1a2d40] bg-[#0d1520] hover:border-[#7C3AED]/60 hover:bg-[#5B21B6]/10 transition-all duration-200 group cursor-pointer"
                    >
                      <span className="text-[#94A3B8] group-hover:text-[#a78bfa] transition-colors duration-200 text-base">
                        {store.icon}
                      </span>
                      <span className="text-[#94A3B8] group-hover:text-[#a78bfa] transition-colors duration-200 text-base">
                        {store.label}
                      </span>
                      <span className="ml-auto text-[#4a6078] group-hover:text-[#a78bfa] text-xs transition-colors duration-200">
                        →
                      </span>
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {isAdded ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#0d9488] shadow-lg shadow-teal-500/50" />
                <span className="text-[#0d9488] text-xs font-semibold uppercase tracking-widest">
                  Dans ta bibliothèque
                </span>
              </div>

              {/*Statut*/}
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
                      className={`text-[10px] font-semibold px-2 py-2 rounded-lg border transition-all duration-200 cursor-pointer leading-tight ${
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

              <div className="border-t border-[#1a2d40]" />

              {/*Rating*/}
              <div className="flex flex-col gap-1.5">
                <span className="text-[#4a6078] text-xs uppercase tracking-wider">
                  Mon avis
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "🏆 Exceptionnel",
                      value: "exceptional",
                      active:
                        "bg-yellow-900/30 border-yellow-500/60 text-yellow-300",
                    },
                    {
                      label: "👍 Recommandé",
                      value: "recommended",
                      active:
                        "bg-[#0d9488]/20 border-[#0d9488]/60 text-[#0d9488]",
                    },
                    {
                      label: "😐 Bof",
                      value: "meh",
                      active: "bg-[#1C2D3E] border-[#2D4A63] text-[#94A3B8]",
                    },
                    {
                      label: "👎 À éviter",
                      value: "skip",
                      active: "bg-red-900/30 border-red-700/60 text-red-300",
                    },
                  ].map((r) => (
                    <button
                      key={r.value}
                      onClick={() =>
                        handleRatingChange(
                          libraryEntry?._id,
                          libraryEntry?.rating === r.value ? null : r.value,
                        )
                      }
                      className={`text-[10px] font-semibold px-2 py-2 rounded-lg border transition-all duration-200 cursor-pointer leading-tight ${
                        libraryEntry?.rating === r.value
                          ? r.active
                          : "bg-transparent border-[#1a2d40] text-[#4a6078] hover:border-[#2D4A63] hover:text-[#94A3B8]"
                      }
                      `}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setOpenModal((prev) => !prev)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg border border-[#2D4A63] text-[#94A3B8] hover:border-[#5B21B6] hover:text-[#a78bfa] transition-all duration-200 cursor-pointer uppercase tracking-widest"
              >
                <span className="w-4 h-4 rounded-full bg-[#5B21B6]/20 border border-[#7C3AED]/40 text-[#a78bfa] flex items-center justify-center text-xs">
                  📓
                </span>
                Journal de sessions
              </button>

              <button
                onClick={() => setOpenCOnfirmModal(true)}
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

      {openModal && (
        <JournalModal
          libraryEntry={libraryEntry}
          onClose={() => setOpenModal(false)}
        />
      )}
      {openAuthModal && <AuthModal onClose={() => setOpenAuthModal(false)} />}
      {openConfirmModal && (
        <ConfirmModal
          onClose={() => setOpenCOnfirmModal(false)}
          onConfirm={() => {
            handleDelete(libraryEntry?._id);
            setOpenCOnfirmModal(false);
          }}
        />
      )}
    </div>
  );
}
