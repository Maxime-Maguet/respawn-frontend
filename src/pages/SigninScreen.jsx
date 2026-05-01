import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin } from "../api/auth";
import { login } from "../redux/slices/userSlice";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import ErrorBox from "../components/ui/ErrorBox";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import logo_Respawn from "../assets/logo_Respawn.png";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      dispatch(login(data));
      navigate("/Home");
    },
    onError: (error) => {
      setErrors(error.response.data.errors.map((err) => err.msg));
    },
  });
  const handleSignin = () => {
    setErrors([]);
    mutation.mutate({ username, password });
  };

  return (
    <div className="flex min-h-screen bg-[#060a0f]">
      <div className=" gap-6 basis-1/2 bg-linear-to-r from-[rgba(91,33,182,0.15)] to-transparent flex flex-col items-center justify-center">
        <img className={"w-40"} src={logo_Respawn} />
        <h1
          className={
            "text-4xl text-[#C084FC] font-semibold tracking-widest font-[Orbitron]"
          }
        >
          RESPAWN
        </h1>
        <p className={" text-center text-sm  text-[#F1F5F8] tracking-wide "}>
          Votre univers gaming, tout en un seul endroit.
        </p>
        <div className="w-10 h-0.5 bg-violet-500"></div>
        <p className="text-sm text-[#94A3B8] font-normal text-center px-16 italic ">
          Gérez votre bibliothèque, suivez vos sessions et découvrez de nouveaux
          jeux.
        </p>
      </div>
      <div className="  basis-1/2 flex items-center justify-center bg-[#060a0f]">
        <Card>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-[#F1F5F8] font-semibold tracking-widest">
              Se Connecter
            </h2>
            <p className={" text-sm  text-[#94A3B8] tracking-wide "}>
              Bienvenue sur Respawn
            </p>
          </div>
          <div className="my-6 flex flex-col gap-4">
            <Input
              label={"Nom d'utilisateur"}
              type={"text"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={"username"}
            />
            <Input
              label={"Mot de passe"}
              type={"password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"Mot de passe"}
            />
          </div>
          <ErrorBox errors={errors} />
          <Button
            text={"Se Connecter"}
            type="button"
            onClick={handleSignin}
            className="my-4 w-full"
          ></Button>
          <div className="flex-row flex items-center gap-4 my-6">
            <div className="flex-1 h-0.5 bg-[#2D4A63] justify-center"></div>
            <p className="text-[#94A3B8]">OU</p>
            <div className="flex-1 h-0.5 bg-[#2D4A63] justify-center"></div>
          </div>
          <p className="text-sm  text-[#7b8799] tracking-wide ">
            Vous n'avez pas de compte ? <br />
            <Link
              to="/signup"
              className="text-[#7C3AED] hover:text-[#9055ee]  transition-colors duration-300"
            >
              Créer un compte →
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
