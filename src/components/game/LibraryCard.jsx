import { useState } from "react";
export default function LibraryCard({
  _id,
  status,
  title,
  released,
  backgroundImage,
  genre,
  onDelete,
  onStatusChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const STATUS_OPTIONS = [
    "pas encore joué",
    "en cours",
    "terminé",
    "abandonné",
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-[#1a2d40] hover:-translate-y-2 transition-all duration-500 relative group aspect-video">
      {/* Badge statut */}
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-[#0d9488]/90 text-teal-100">
        {status}
      </div>

      {/* Image full */}
      <div
        className="w-full h-full bg-cover bg-top"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay hover */}
      <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
        <h1 className="text-[#F1F5F8] text-sm font-bold">{title}</h1>
        <span className="text-xs text-[#94A3B8] bg-[#1C2D3E]/80 px-2 py-0.5 rounded-full w-fit">
          {genre}
        </span>
        <div
          className="flex gap-2 mt-1 items-end "
          onMouseLeave={() => setIsOpen(false)}
        >
          {isOpen ? (
            <div className="flex-1 flex flex-col gap-1">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  className="text-left text-[10px] text-[#F1F5F8] bg-[#1C2D3E]/90 hover:bg-[#5B21B6]/60 px-2 py-1 rounded-md transition-colors cursor-pointer w-full"
                  onClick={() => {
                    onStatusChange(s);
                    setIsOpen(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : (
            <button
              className="flex-1 border border-[#7C3AED] text-[#a78bfa] hover:bg-[#5B21B6]/40 text-xs font-semibold py-1.5 rounded-lg transition-colors cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              Changer statut
            </button>
          )}
          <button
            className="flex-1 bg-red-900/70 hover:bg-red-800 text-red-200 text-xs font-semibold  py-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={onDelete}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
