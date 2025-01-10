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

type FakeNewsResult = "genuine" | "fakenews" | "unknown" | string;

const extensionWidth = "300px";
const extensionHeight = "450px";

function App() {
  const [inputText, setInputText] = useState<string>("");
  const [newsOriginResult, setNewsOriginResult] = useState<NewsOriginResult | null>(null);
  const [fakeNewsResult, setFakeNewsResult] = useState<FakeNewsResult | null>(null);

  const handleNewsOriginCheck = async () => {
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          body: {
            description: inputText
          },
          source: "newsWeb"
        })
      });
      const result: { prediction: FakeNewsResult } = await response.json();
      setFakeNewsResult(result.prediction); // Store the prediction string
    } catch (error) {
      setFakeNewsResult("Error fetching fake news data");
    }
  };

  // Handlers to delete results
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

        {/* News Origin Result Display */}
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

        {/* Error Message for News Origin */}
        {newsOriginResult && newsOriginResult.error && (
          <div className="mt-2 text-red-500">
            <p>{newsOriginResult.error}</p>
            <Button variant="destructive" onClick={handleDeleteNewsOrigin}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Fake News Result Display */}
        {fakeNewsResult && fakeNewsResult !== "Error fetching fake news data" && (
          <div className="mt-2">
            <h4>Fake News Result:</h4>
            <p>
              {fakeNewsResult === "genuine" && "This news appears to be genuine."}
              {fakeNewsResult === "fakenews" && "This news appears to be fake."}
              {fakeNewsResult === "unknown" && "The authenticity of this news is unclear."}
            </p>
            <Button variant="destructive" onClick={handleDeleteFakeNews}>
              Delete Fake News Result
            </Button>
          </div>
        )}

        {/* Error Message for Fake News */}
        {fakeNewsResult && fakeNewsResult === "Error fetching fake news data" && (
          <div className="mt-2 text-red-500">
            <p>{fakeNewsResult}</p>
            <Button variant="destructive" onClick={handleDeleteFakeNews}>
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
