import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignupScreen";
import Signin from "./pages/SigninScreen";
import Home from "./pages/HomeScreen";
import GameScreen from "./pages/GameScreen";
import LibraryScreen from "./pages/LibraryScreen";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game/:id" element={<GameScreen />} />
        <Route path="/library" element={<LibraryScreen />} />
      </Routes>
    </>
  );
}

export default App;
