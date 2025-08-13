import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <section className="flex justify-between items-center p-4 bg-black border-b-2 border-b-white">
      <div className="font-bold text-2xl text-white">TTG</div>
      <div className="flex justify-between">
        <button
          className="bg-white mx-2 px-4 border-2 border-black rounded-2xl cursor-pointer hover:bg-black hover:text-white transition-all duration-700"
          onClick={handleLoginClick}
        >
          Login
        </button>
      </div>
    </section>
  );
};

export default Header;
