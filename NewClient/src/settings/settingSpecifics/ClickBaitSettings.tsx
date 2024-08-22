import CommonSettings from "./CommonSettings";

export default function ClickBaitSettings({currSettings, updateAndStoreSettings}) {
    function handleUpdateAndStoreClickBaitSettings(specificField:any, value:any){
        updateAndStoreSettings("Click Bait", specificField, value)
    }
  return <CommonSettings currSettings={currSettings} updateAndStoreSettings={handleUpdateAndStoreClickBaitSettings}/>;
}
