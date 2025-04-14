import React, { useEffect, useState } from "react";
import { CiSquareChevUp } from "react-icons/ci";

const ScrollToTopButton: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    setShowScrollButton(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!showScrollButton) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 bg-gray-200 p-3 rounded-xl shadow-lg hover:bg-gray-300 transition-all cursor-pointer"
    >
      <CiSquareChevUp className="text-2xl text-gray-950 font-extrabold shadow-2xs" />
    </button>
  );
};

export default ScrollToTopButton;
