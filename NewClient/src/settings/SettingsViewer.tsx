import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

import GeneralSettings from "./settingSpecifics/GeneralSettings";
import HateSpeechSettings from "./settingSpecifics/HateSpeechSettings";
import ClickBaitSettings from "./settingSpecifics/ClickBaitSettings";
import ProfanityWordsSettings from "./settingSpecifics/ProfanityWordsSettings";
import HideFlaggedContentSettings from "./settingSpecifics/HideFlaggedContentSettings";
import SetApiKeySettings from "./settingSpecifics/SetApiKeySettings";
import WhiteListedSettings from "./settingSpecifics/WhiteListedSettings";

// Use async/await for chrome.storage API
async function fetchSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["settings"], (result) => {
      resolve(result.settings);
    });
  });
}

// Update settings in chrome.storage
async function updateSettings(newSettings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ settings: newSettings }, () => {
      resolve();
    });
  });
}

export default function SettingsViewer() {
  const [selectedSetting, setSelectedSetting] = useState("General"); // for UI
  const [savedSettings, setSavedSettings] = useState(null);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    // Retrieve the value from chrome.storage.sync
    (async () => {
      const settings = await fetchSettings();
      setSavedSettings(settings);
      setLoading(false); // set loading to false after settings are loaded
      console.log("retrieving settings");
      console.log(settings);
    })();
  }, []);

  // Handle settings update and store in chrome.storage
  function handleUpdateAndStoreSettings(settingName, specificField, value) {
    const newSettings = { ...savedSettings };
    newSettings[settingName] = {
      ...newSettings[settingName], // Copy existing settingName object
      [specificField]: value, // Update specific field
    };
    setSavedSettings(newSettings);
    updateSettings(newSettings);
  }

  const settingsCatalog = {
    General: <GeneralSettings currSettings={savedSettings?.General} />,
    "Hate Speech": (
      <HateSpeechSettings
        currSettings={savedSettings?.["Hate Speech"]}
        updateAndStoreSettings={handleUpdateAndStoreSettings}
      />
    ),
    "Click Bait": (
      <ClickBaitSettings
        currSettings={savedSettings?.["Click Bait"]}
        updateAndStoreSettings={handleUpdateAndStoreSettings}
      />
    ),
    "Profanity Words": (
      <ProfanityWordsSettings
        currSettings={savedSettings?.["Profanity Words"]}
        updateAndStoreSettings={handleUpdateAndStoreSettings}
      />
    ),
    "Hide Flagged Content": (
      <HideFlaggedContentSettings
        currSettings={savedSettings?.["Hide Flagged Content"]}
        updateAndStoreSettings={handleUpdateAndStoreSettings}
      />
    ),
    "Set Api Keys": <SetApiKeySettings />,
    "Sites Whitelisted": <WhiteListedSettings />,
  };

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while settings are being loaded
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 h-screen rounded-sm mx-2">
        {/* Vertical Navbar */}
        <h1 className="text-xl font-bold p-4">Settings</h1>
        <div className="space-y-2">
          {Object.keys(settingsCatalog).map((setting) => (
            <Button
              key={setting}
              onClick={() => setSelectedSetting(setting)}
              className={`block w-full py-2 px-4 text-left ${
                selectedSetting === setting ? "bg-primary" : "bg-secondary"
              }`}
              variant={selectedSetting === setting ? "default" : "secondary"}
            >
              {setting}
            </Button>
          ))}
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="w-3/4 p-4">
        <h2 className="text-xl font-bold mb-4">{selectedSetting}</h2>
        <div>{settingsCatalog[selectedSetting]}</div>
      </div>
      <Button onClick={handleTestClick}>test</Button>
    </div>
  );
}

async function handleTestClick() {
  const settings = await fetchSettings();
  console.log(settings);
}
