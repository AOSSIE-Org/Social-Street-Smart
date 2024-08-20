import CommonSettings from "./CommonSettings";

export default function ProfanityWordsSettings({currSettings, updateAndStoreSettings}) {
    function handleUpdateAndStoreProfanityWordsSettings(specificField:any, value:any){
        updateAndStoreSettings("Profanity Words", specificField, value)
    }
  return <CommonSettings currSettings={currSettings} updateAndStoreSettings={handleUpdateAndStoreProfanityWordsSettings}/>;
}
