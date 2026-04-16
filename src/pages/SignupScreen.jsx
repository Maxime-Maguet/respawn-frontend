import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import { login } from "../redux/slices/userSlice";
import { Link } from "react-router-dom";

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
    },
    onError: (error) => {
      setErrors(error.response.data.errors.map((err) => err.msg));
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = () => {
    mutation.mutate(formData);
  };

  return (
    <>
      <div className="wrapper Signup">
        <input
          name="email"
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="username"
          type="Username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          name="password"
          type="password"
          id="passwword"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mot de passe"
        />
        {errors.length > 0 && errors.map((err, i) => <p key={i}>{err}</p>)}
      </div>
      <button type="button" onClick={handleSignup}>
        S'INSCRIRE
      </button>
      <p>
        Vous avez déjà un compte ? <Link to="/"> Login </Link>
      </p>
    </>
  );
}
