import React, { useState, useEffect } from "react";

const WhiteListedSettings: React.FC = () => {
  const [whitelist, setWhitelist] = useState<string[]>([]);

  // Load whitelist from chrome.storage.sync
  useEffect(() => {
    chrome.storage.sync.get(["white_list"], (result) => {
      const storedWhitelist = result.white_list ? result.white_list.split("|").filter(Boolean) : [];
      setWhitelist(storedWhitelist);
    });
  }, []);

  // Add a new website to the whitelist
  const addWebsite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const websiteInput = (event.currentTarget.elements.namedItem("website") as HTMLInputElement);
    const website = websiteInput.value.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""); // Remove http(s) & trailing slash

    if (!website) {
      alert("Please enter a valid website.");
      return;
    }

    if (!whitelist.includes(website)) {
      const updatedWhitelist = [...whitelist, website];
      setWhitelist(updatedWhitelist);
      chrome.storage.sync.set({ white_list: updatedWhitelist.join("|") });
    }

    websiteInput.value = ""; // Clear input field
  };

  // Remove a website from the whitelist
  const removeWebsite = (site: string) => {
    const updatedWhitelist = whitelist.filter((item) => item !== site);
    setWhitelist(updatedWhitelist);
    chrome.storage.sync.set({ white_list: updatedWhitelist.join("|") });
  };

  return (
    <div className="max-w-lg mx-auto p-4">

  {/* Whitelist Display */}
  <div className="rounded-lg p-3 shadow-md">
    {whitelist.length === 0 ? (
      <p className="text-gray-400 text-center">No websites added.</p>
    ) : (
      <ul className="space-y-2">
        {whitelist.map((site, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-md">
            <span className="text-white">{site}</span>
            <button
              onClick={() => removeWebsite(site)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Add Website Form */}
  <form onSubmit={addWebsite} className="mt-4 flex items-center gap-2">
    <input
      type="text"
      name="website"
      placeholder="Enter website (example.com)"
      className="w-full px-4 py-2 bg-white text-gray-800 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm"
    />
    <button
      type="submit"
      className="px-4 py-2 bg-indigo-700 hover:bg-teal-600 text-white rounded-md transition"
    >
      Add
    </button>
  </form>
</div>
  );
};

export default WhiteListedSettings;
