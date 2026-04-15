import "./App.css";
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from "./pages/SignupScreen";
import Signin from "./pages/SigninScreen";


function App() {
  return <>
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />

    </Routes>
  </>;
}

export default App;
