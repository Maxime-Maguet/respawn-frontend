import { useNavigate } from "react-router-dom";

export default function GameCard({
  rawgId,
  title,
  released,
  backgroundImage,
  genre,
}) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/game/${rawgId}`)}
      className="rounded-xl overflow-hidden border border-[#1a2d40] cursor-pointer hover:-translate-y-2 transition-all duration-500 relative"
    >
      <div
        className="h-40 bg-cover bg-center w-full "
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="p-3 bg-[#0d1520] ">
        <h1 className="text-[#F1F5F8] text-sm font-semibold">{title}</h1>
        <span className="text-xs text-[#94A3B8] bg-[#1C2D3E] px-2 py-0.5 rounded-full">
          {genre}
        </span>
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-[#F1F5F8] text-sm font-semibold">+ Ajouter</span>
      </div>
    </div>
  );
}
