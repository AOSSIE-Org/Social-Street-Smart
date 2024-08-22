import CommonSettings from "./CommonSettings";

export default function HideFlaggedContentSettings({currSettings, updateAndStoreSettings}) {
  console.log("ke")
    function handleUpdateAndStoreHideFlaggedContentSettings(specificField:any, value:any){
        updateAndStoreSettings("Hide Flagged Content", specificField, value)
    }
  return <CommonSettings currSettings={currSettings} updateAndStoreSettings={handleUpdateAndStoreHideFlaggedContentSettings}/>;
}
