import { useNavigate } from "react-router-dom";
import { FaXbox } from "react-icons/fa";
import { FaPlaystation } from "react-icons/fa";
import { FaWindows } from "react-icons/fa";
import { BsNintendoSwitch } from "react-icons/bs";
export default function GameCard({
  rawgId,
  title,
  backgroundImage,
  genre,
  platforms,
}) {
  const navigate = useNavigate();

  const platformIcons = {
    "PlayStation 4": <FaPlaystation />,
    "PlayStation 5": <FaPlaystation />,
    "Xbox One": <FaXbox />,
    "Xbox Series S/X": <FaXbox />,
    PC: <FaWindows />,
    "Nintendo Switch": <BsNintendoSwitch />,
  };

  return (
    <div
      onClick={() => navigate(`/game/${rawgId}`)}
      className="rounded-xl overflow-hidden border border-[#1a2d40] cursor-pointer hover:-translate-y-2 hover:border-[#7C3AED]/60 hover:shadow-lg hover:shadow-[#5B21B6]/30 transition-all duration-300 relative group"
    >
      <div
        className="h-40 bg-cover bg-center w-full group-hover:brightness-110 transition-all duration-300"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="p-3 bg-[#0d1520] ">
        <div className="flex gap-1 mb-1">
          {(platforms ?? [])
            .filter((p) => platformIcons[p])
            .map((p) => (
              <span key={p} className="text-[#94A3B8] text-xs">
                {platformIcons[p]}
              </span>
            ))}
        </div>
        <h1 className="text-[#F1F5F8] text-sm font-semibold">{title}</h1>
        <span className="text-xs text-[#94A3B8] bg-[#1C2D3E] px-2 py-0.5 rounded-full">
          {genre}
        </span>
      </div>
    </div>
  );
}
