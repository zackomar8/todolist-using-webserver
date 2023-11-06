import Image from "next/image";

import { useTheme } from "next-themes";
import { useState } from "react";
import ToggleModeIcons from "../components/ToggleModeIcons";

import DarkBackgroundImage from "@/public/assets/bg-desktop-dark.jpg";
import LightBackgroundImage from "@/public/assets/bg-desktop-light.jpg";

const Header = () => {
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // handleToggleMode handles the toggling of the theme
  const handleToggleMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
    setIsDarkMode((prevMode) => !prevMode);
  };
  return (
    <div>
      <Image
        src={isDarkMode ? DarkBackgroundImage : LightBackgroundImage}
        width={500}
        height={500}
        alt="background image"
        className="absolute top-0 left-0 z-[-1] w-full h-64 object-cover"
      />
      <div className="mx-5 max-w-md md:mx-auto md:max-w-2xl h-full mt-16 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white tracking-widest">TODO</h1>
        <button onClick={handleToggleMode}>
          <ToggleModeIcons isDarkMode={isDarkMode} />
        </button>
      </div>
    </div>
  );
};

export default Header;
