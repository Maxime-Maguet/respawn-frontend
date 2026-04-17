import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { selectedGame } from "../api/game";

export default function GameScreen() {
  let params = useParams();
  params.id;
  const { data, isError, isLoading } = useQuery({
    queryKey: ["game", params.id],
    queryFn: () => selectedGame({ id: params.id }),
    enabled: !!params.id,
  });

  return (
    <div className="flex h-screen bg-[#060a0f]">
      <div className="flex-1">
        <div className="p-10">
          <h1 className="text-white text-3xl mb-4">{data?.data?.title}</h1>
          <img
            src={data?.data?.backgroundImage}
            className="w-full max-w-4xl rounded-xl border border-white/10"
            alt="preview"
          />
        </div>
      </div>
    </div>
  );
}
