import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
export default function CommonSettings({
  currSettings,
  updateAndStoreSettings,
}) {
  const [isThisSettingEnabled, setIsThisSettingEnabled] = useState(false);
  console.log("kesahv", currSettings);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span>Enable this feature</span>
        <Checkbox
          checked={currSettings["isEnabled"]}
          onCheckedChange={() => {
            setIsThisSettingEnabled(!isThisSettingEnabled);
            updateAndStoreSettings("isEnabled", !currSettings["isEnabled"]);
          }}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <span>Enable on Facebook</span>
        <Checkbox
          checked={currSettings["facebook"]}
          onCheckedChange={() => {
            updateAndStoreSettings("facebook", !currSettings["facebook"]);
          }}
          disabled={isThisSettingEnabled}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <span>Enable on Twitter</span>
        <Checkbox
          checked={currSettings["twitter"]}
          onCheckedChange={() => {
            updateAndStoreSettings("twitter", !currSettings["twitter"]);
          }}
          disabled={isThisSettingEnabled}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <span>Enable on Reddit</span>
        <Checkbox
          checked={currSettings["reddit"]}
          onCheckedChange={() => {
            updateAndStoreSettings("reddit", !currSettings["reddit"]);
          }}
          disabled={isThisSettingEnabled}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <span>Enable across the rest of the Web</span>
        <Checkbox
          checked={currSettings["otherWebsites"]}
          onCheckedChange={() => {
            updateAndStoreSettings("otherWebsites", !currSettings["otherWebsites"]);
          }}
          disabled={isThisSettingEnabled}
        />
      </div>
    </div>
  );
}
