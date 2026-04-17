import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { discoverGames } from "../api/game";
import SideBar from "../components/layout/SideBar";
import TopBar from "../components/layout/TopBar";
import { searchGames } from "../api/game";

export default function Home() {
  const [activeTab, setActiveTab] = useState("trending");
  const [errors, setErrors] = useState([]);
  const [searchResults, setSearchResults] = useState("");
  const mutation = useMutation({
    mutationFn: searchGames,
    onSuccess: (data) => {
      console.log("homescreen Searchgame=>", data);
      setSearchResults(data);
    },
    onError: (error) => {
      setErrors(error.response.data.errors.map((err) => err.msg));
    },
  });
  const handleSearch = (searchResults) => {
    mutation.mutate({ search: searchResults });
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["discover", activeTab],
    queryFn: () => discoverGames({ type: activeTab }),
  });

  return (
    <div className="flex flex-row min-h-screen bg-[#060a0f]">
      <SideBar></SideBar>
      <div className="flex flex-col flex-1 ">
        <TopBar onSearch={handleSearch}></TopBar>
      </div>
    </div>
  );
}
