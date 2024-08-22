import { ModeToggle } from "../components/mode-toggle";
import { ImSwitch } from "react-icons/im";
import iconPath from "../../public/assets/icon/72.png";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [mainSwitch, setMainSwitch] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(["Main_Switch"], (result: any) => {
      console.log(result.Main_Switch);
      setMainSwitch(result.Main_Switch);
    });
  }, []);

  function handleMainSwitchClick() {
    setMainSwitch(!mainSwitch);
    chrome.storage.sync.set({ Main_Switch: !mainSwitch });
    chrome.storage.sync.get(["Main_Switch"], (result: any) => {
      console.log(result.Main_Switch);
    });
  }

  return (
    <div className="flex justify-between items-center mx-4 my-2">
      <div>
        <img
          src={iconPath}
          className="logo react"
          alt="React logo"
          style={{
            width: "60px", // Adjust width as needed
            height: "auto", // Ensure height scales with width
            objectFit: "contain",
          }}
        />
      </div>
      <div className="text-2xl font-bold text-center p-0 m-1">
        <h2>Social Street Smart</h2>
      </div>
      <div>
      <Button variant="outline" className="p-2">
        <ImSwitch
          onClick={handleMainSwitchClick}
          style={{
            transform: `rotate(${mainSwitch ? "0" : "180"}deg)`,
            transition: "transform 0.2s ease",
            width: "25px", // Adjust width as needed
            height: "auto", // Ensure height scales with width
            objectFit: "contain",
            color:mainSwitch?"#84eab3":'#cc0000'
          }}
        />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
