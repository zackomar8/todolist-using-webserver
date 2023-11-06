import React, { FC } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

interface ToggleModeIconsProps {
  isDarkMode: boolean;
}

const ToggleModeIcons: FC<ToggleModeIconsProps> = ({ isDarkMode }) => {
  return (
    <>
      {isDarkMode ? (
        <SunIcon style={{ width: "1.5rem", height: "1.5rem" }} />
      ) : (
        <MoonIcon
          style={{ width: "1.5rem", height: "1.5rem", color: "#fff" }}
        />
      )}
    </>
  );
};

export default ToggleModeIcons;
