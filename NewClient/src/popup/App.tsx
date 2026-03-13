import React, { useState } from "react";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "@/components/Navbar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type NewsOriginResult = {
  HIGH?: [string, string][];
  MINIMAL?: [string, string][];
  SOME?: [string, string][];
  error?: string;
};

// Corrected type definition:  "Fakenews" -> "Fake"
type FakeNewsResult = "Genuine" | "Fake" | "Unknown" | string;

const extensionWidth = "300px";
const extensionHeight = "450px";

function App() {
  const [inputText, setInputText] = useState<string>("");
  const [newsOriginResult, setNewsOriginResult] = useState<NewsOriginResult | null>(null);
  const [fakeNewsResult, setFakeNewsResult] = useState<FakeNewsResult | null>(null);

  const handleNewsOriginCheck = async () => {
    // ... (News Origin Check - No Changes)
      try {
      const response = await fetch(`http://localhost:5009/pred?text=${encodeURIComponent(inputText)}`);
      const result: NewsOriginResult = await response.json();
      setNewsOriginResult(result); // Store the parsed JSON object
    } catch (error) {
      setNewsOriginResult({ error: "Error fetching news origin data" });
    }
  };

  const handleFakeNewsCheck = async () => {
    try {
      const response = await fetch("http://localhost:5008/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Use the 'claim' key, as expected by the updated backend
          claim: inputText,
        }),
      });

      // Handle potential errors from the backend
      if (!response.ok) {
        const errorData = await response.json();
        setFakeNewsResult(errorData.error || "An unknown error occurred.");
        return;
      }

      const result: { prediction: FakeNewsResult } = await response.json();
      setFakeNewsResult(result.prediction);
    } catch (error) {
      // Catch network or other unexpected errors
      console.error("Error during fake news check:", error);
      setFakeNewsResult("Error fetching fake news data");
    }
  };

  const handleDeleteNewsOrigin = () => {
    setNewsOriginResult(null);
  };

  const handleDeleteFakeNews = () => {
    setFakeNewsResult(null);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col space-y-2 px-2 pb-2" style={{ width: extensionWidth, height: extensionHeight }}>
        <Navbar />
        <Textarea
          placeholder="Input the text you want to check"
          className="flex-grow"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div>
          <span>Check for:</span>
          <div className="flex justify-between">
            <Button onClick={handleNewsOriginCheck}>News Origin</Button>
            <Button onClick={handleFakeNewsCheck}>Fake News</Button>
          </div>
        </div>
        <Button variant="outline" onClick={() => { chrome.runtime.openOptionsPage() }}>Settings</Button>
        <div className="flex justify-between my-2">
          <span>Do you want to whitelist this website?</span>
          <Checkbox />
        </div>

        {/* News Origin Result Display (No changes) */}
        {newsOriginResult && !newsOriginResult.error && (
          <div className="mt-2">
            <h4>News Origin Results:</h4>
            {["HIGH", "MINIMAL", "SOME"].map((category) => (
              newsOriginResult[category as keyof NewsOriginResult] && newsOriginResult[category as keyof NewsOriginResult]!.length > 0 && (
                <div key={category} className="mb-2">
                  <h5>{category} Probability:</h5>
                  <ul className="list-disc ml-5">
                    {newsOriginResult[category as keyof NewsOriginResult]!.map(([url, description], index) => (
                      <li key={index}>
                        <a href={`https://${url}`} target="_blank" rel="noopener noreferrer">
                          {url} {description && `- ${description}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
            <Button variant="destructive" onClick={handleDeleteNewsOrigin}>
              Delete News Origin Results
            </Button>
          </div>
        )}

        {/* Error Message for News Origin (No changes) */}
        {newsOriginResult && newsOriginResult.error && (
          <div className="mt-2 text-red-500">
            <p>{newsOriginResult.error}</p>
            <Button variant="destructive" onClick={handleDeleteNewsOrigin}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Fake News Result Display - Updated */}
      {fakeNewsResult && (
          <div className="mt-2">
            <h4>Fake News Result:</h4>
            {/* Handle all possible result states */}
            {fakeNewsResult === "Genuine" && <p>This news appears to be genuine.</p>}
            {fakeNewsResult === "Fake" && <p>This news appears to be fake.</p>}
            {fakeNewsResult === "Unknown" && <p>The authenticity of this news is unclear.</p>}
            {/* Display any other string as an error message */}
            {typeof fakeNewsResult === "string" && !["Genuine", "Fake", "Unknown"].includes(fakeNewsResult) && (
              <p className="text-red-500">{fakeNewsResult}</p>
            )}
            <Button variant="destructive" onClick={handleDeleteFakeNews}>
              Delete Fake News Result
            </Button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;