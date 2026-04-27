import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { selectedGame } from "../api/game";
import { searchGames } from "../api/game";
import SideBar from "../components/layout/SideBar";
import TopBar from "../components/layout/TopBar";

export default function GameScreen() {
  const navigate = useNavigate();
  let params = useParams();

  const [errors, setErrors] = useState([]);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["game", params.id],
    queryFn: () => selectedGame({ id: params.id }),
    enabled: !!params.id,
  });

  const mutation = useMutation({
    mutationFn: searchGames,
    onSuccess: (data) => {
      navigate("/home", { state: { searchResults: data } });
    },
    onError: (error) => {
      setErrors(error.response.data.errors.map((err) => err.msg));
    },
  });

  const handleSearch = (searchResults) => {
    mutation.mutate({ page_size: 50, search: searchResults });
  };

  return (
    <div className="flex h-screen bg-[#060a0f]">
      <SideBar></SideBar>
      <div className="flex flex-col flex-1 ">
        <TopBar onSearch={handleSearch}></TopBar>
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
    </div>
  );
}
