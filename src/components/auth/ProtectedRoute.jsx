import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export default function ProtectedRoute() {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const token = useSelector((state) => state.user.value.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setOpenAuthModal(true);
    }
  }, [token]);

  const closingModal = () => {
    setOpenAuthModal(false);
    navigate("/home");
  };

  return (
    <div>
      {token ? <Outlet /> : null}
      {openAuthModal && <AuthModal onClose={closingModal} />}
    </div>
  );
}
