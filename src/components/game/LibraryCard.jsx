import { useNavigate } from "react-router-dom";

export default function LibraryCard({
  rawgId,
  status,
  title,
  backgroundImage,
  genre,
}) {
  const navigate = useNavigate();

  const STATUS_COLORS = {
    "en cours":
      "bg-[#0d9488]/95 text-teal-50 border border-teal-400/50 shadow-lg shadow-teal-500/20",
    terminé:
      "bg-[#5B21B6]/95 text-violet-50 border border-violet-400/50 shadow-lg shadow-violet-500/20",
    abandonné:
      "bg-red-900/90 text-red-100 border border-red-500/50 shadow-lg shadow-red-500/20",
    "pas encore joué":
      "bg-[#1C2D3E]/95 text-[#94A3B8] border border-[#2D4A63] shadow-lg shadow-black/40",
  };

  return (
    <div
      onClick={() => navigate(`/game/${rawgId}`)}
      className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer ring-1 ring-[#1a2d40] hover:ring-2 hover:ring-[#7C3AED]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#5B21B6]/40 hover:-translate-y-1"
    >
      {/* Image avec zoom au hover */}
      <div
        className="absolute inset-0 bg-cover bg-center saturate-90 group-hover:saturate-100 group-hover:scale-105 transition-all duration-700 ease-out"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Gradient unifié */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent group-hover:from-[#1a0b2e]/95 group-hover:via-[#5B21B6]/20 transition-all duration-500" />

      {/* Badge statut */}
      <div
        className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase leading-none backdrop-blur-sm ${STATUS_COLORS[status]}`}
      >
        {status}
      </div>

      {/* Contenu bas : titre + genre */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3
          className="text-[#F1F5F8] text-base font-bold leading-tight drop-shadow-lg transform group-hover:-translate-y-1 transition-transform duration-500"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {title}
        </h3>

        <div className="overflow-hidden max-h-10 transition-all duration-500 md:max-h-0 md:group-hover:max-h-10">
          <span className="inline-block mt-2 text-[10px] text-[#a78bfa] bg-[#5B21B6]/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[#7C3AED]/40">
            {Array.isArray(genre) ? genre.slice(0, 2).join(" • ") : genre}
          </span>
        </div>
      </div>
    </div>
  );
}
