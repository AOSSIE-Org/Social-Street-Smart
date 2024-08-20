import { ThemeProvider } from "@/components/theme-provider";
import SettingsViewer from "./SettingsViewer";
import { Separator } from "../components/ui/separator";
import Navbar from "../components/Navbar";
import SettingsNavbar from "@/components/SettingsNavbar";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <SettingsNavbar />
    <Separator />
    <SettingsViewer />
    </ThemeProvider>
  );
}

export default App;
