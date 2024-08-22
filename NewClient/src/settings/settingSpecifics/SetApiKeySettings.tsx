import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

export default function SetApiKeySettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null; // Set to null if no file selected
    setFile(selectedFile);
  };
  return (
    <div className="space-y-4">
      <div className="w-full">
        <div>
          <Label className="" htmlFor="file-upload">
            Browse API Keys JSON File
          </Label>
        </div>
        <div className="flex">
          <Button
            onClick={openFileExplorer}
            variant="outline"
            className="flex-grow mr-2"
          >
            Browse
          </Button>
          <Input
            type="file"
            id="file"
            accept=".json"
            onChange={handleFileChange}
            ref={fileInputRef}
            // hidden
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              padding: "0",

              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              border: "0",
            }}
          ></Input>
          <Button>Submit</Button>
        </div>
        <span className="text-xs">
          {file?.name}
          {file ? "*" : ""}
        </span>
      </div>

      <div className="w-full">
        <div>
          <Label className="" htmlFor="file-upload">
            Use custom API keys for the News Origin API
          </Label>
        </div>
        <div className="flex">
          <Input
            type="text"
            id="text"
            placeholder="Google Custom Search API keys"
            // hidden
          ></Input>
          <Button className="ml-2">Submit</Button>
        </div>
      </div>
    </div>
  );
}
