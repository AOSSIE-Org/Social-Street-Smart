import CommonSettings from "./CommonSettings";

export default function HateSpeechSettings({currSettings, updateAndStoreSettings}) {
    function handleUpdateAndStoreHateSpeechSettings(specificField:any, value:any){
        updateAndStoreSettings("Hate Speech", specificField, value)
    }
  return <CommonSettings currSettings={currSettings} updateAndStoreSettings={handleUpdateAndStoreHateSpeechSettings}/>;
}
