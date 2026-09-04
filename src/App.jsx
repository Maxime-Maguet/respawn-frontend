import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignupScreen";
import Signin from "./pages/SigninScreen";
import Home from "./pages/HomeScreen";
import GameScreen from "./pages/GameScreen";
import LibraryScreen from "./pages/LibraryScreen";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/library" element={<LibraryScreen />} />
          </Route>
          <Route path="/game/:id" element={<GameScreen />} />
        </Route>
      </Routes>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{ style: { width: "fit-content" } }}
      />
    </>
  );
}

export default App;
