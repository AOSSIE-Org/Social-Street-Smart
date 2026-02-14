import CommonSettings from "./CommonSettings";

export default function HateSpeechSettings({currSettings, updateAndStoreSettings}:any) {
    function handleUpdateAndStoreHateSpeechSettings(specificField:any, value:any){
        updateAndStoreSettings("Hate Speech", specificField, value)
    }
  return <CommonSettings currSettings={currSettings} updateAndStoreSettings={handleUpdateAndStoreHateSpeechSettings}/>;
}
