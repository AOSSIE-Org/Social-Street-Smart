import { ThemeProvider } from "../components/theme-provider"
import { ModeToggle } from "../components/mode-toggle"
import Navbar from "@/components/Navbar"
import { Input } from "../components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";


const extensionWidth = "300px";
const extensionHeight = "450px";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col space-y-2 px-2 pb-2" style={{width: extensionWidth, height: extensionHeight}}>
        <Navbar/>
        <Textarea placeholder="Input the text you want to check" className="flex-grow"/>
        <div>
          <span>Check for:</span>
          <div className="flex justify-between">
            <Button>New Origin</Button>
            <Button>Fake News</Button>
          </div>
        </div>
        <Button variant="outline" onClick={()=>{chrome.runtime.openOptionsPage()}}>Settings</Button>
        <div className="flex justify-between my-2">

          <span>Do you want to whitelist this website</span>
          <Checkbox></Checkbox>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
