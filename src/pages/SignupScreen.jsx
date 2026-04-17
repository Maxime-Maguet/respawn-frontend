import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { login } from "../redux/slices/userSlice";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import ErrorBox from "../components/ui/ErrorBox";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import logo_Respawn from "../assets/logo_Respawn.png";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState([]);

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log("signupScreen", data);
      dispatch(login(data));
      navigate("/home");
    },
    onError: (error) => {
      setErrors(error.response.data.errors.map((err) => err.msg));
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    setErrors([]);
    mutation.mutate(formData);
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
          Rejoignez la communauté
        </p>
        <div className="w-10 h-0.5 bg-[#0D9488]"></div>
        <p className="text-sm text-[#94A3B8] font-normal text-center px-16 italic ">
          Créez votre compte gratuitement et commencez à gérer votre
          bibliothèque de jeux.
        </p>
      </div>
      <div className="  basis-1/2 flex items-center justify-center bg-[#060a0f]">
        <Card>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-[#F1F5F8] font-semibold tracking-widest">
              Créer un compte
            </h2>
            <p className={" text-sm  text-[#94A3B8] tracking-wide "}>
              Rejoignez Respawn dès aujourd'hui
            </p>
          </div>
          <div className="my-6 flex flex-col gap-4">
            <Input
              label={"email"}
              type={"email"}
              value={formData.email}
              onChange={handleChange}
              name={"email"}
              placeholder={"votre@email.com"}
            />
            <Input
              label={"username"}
              type={"text"}
              value={formData.username}
              onChange={handleChange}
              name={"username"}
              placeholder={"Choisissez un username"}
            />
            <Input
              label={"password"}
              type={"password"}
              value={formData.password}
              onChange={handleChange}
              name={"password"}
              placeholder={"Minimum 8 caractères"}
            />
          </div>
          <ErrorBox errors={errors} />
          <Button
            text={"Créer mon compte"}
            type="button"
            onClick={handleSignup}
            className="my-4"
          ></Button>
          <p className="text-sm  text-[#7b8799] tracking-wide ">
            Vous avez déjà un compte ? <br />
            <Link
              to="/signin"
              className="text-[#7C3AED] hover:text-[#9055ee]  transition-colors duration-300"
            >
              Se connecter →
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
