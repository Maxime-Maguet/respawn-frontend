import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin } from "../api/auth";
import { login } from "../redux/slices/userSlice";
import { Link } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const mutation = useMutation({
    mutationFn: signin,
    onSuccess: (data) => {
      console.log("signinScreen", data);
      dispatch(login(data));
    },
    onError: (error) => {
      setErrors(error.response.data.errors.map((err) => err.msg));
    },
  });
  const handleSignin = () => {
    mutation.mutate({ username, password });
  };

  return (
    <>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      {errors.length > 0 && errors.map((err, i) => <p key={i}>{err}</p>)}
      <button type="button" onClick={handleSignin}>
        Se connecter
      </button>
      <p>
        Vous n'avez pas de compte ? <Link to="/signup"> Créer un compte </Link>
      </p>
    </>
  );
}
