import React, { useState, useEffect } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import "./App.css";
import { models } from "powerbi-client";
import PowerBIFilter from "./powerbifilter";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [report, setReport] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState(null);

  const fetchAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:5000/getAccessToken");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAccessToken(data.accessToken);
    } catch (err) {
      console.error("Error fetching access token:", err);
      setError("Failed to fetch access token.");
    }
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  if (!accessToken) {
    return <div>Loading access token...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.trim())}
          placeholder="Enter Account no"
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {accessToken && (
          <PowerBIEmbed
            embedConfig={{
              type: "report",
              id: "005cfe31-09f0-4a9f-8deb-d569e5ac8f26",
              embedUrl:
                "https://app.powerbi.com/reportEmbed?reportId=005cfe31-09f0-4a9f-8deb-d569e5ac8f26&appId=b2f7f6cc-6aca-49e2-9a03-44f9e3233dcb&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d",
              accessToken: accessToken,
              tokenType: models.TokenType.Aad,
              settings: {
                panes: {
                  filters: {
                    expanded: false,
                    visible: false,
                  },
                },
                background: models.BackgroundType.Transparent,
              },
            }}
            eventHandlers={
              new Map([
                ["loaded", () => console.log("Report loaded successfully")],
                ["rendered", () => console.log("Report rendered successfully")],
                [
                  "error",
                  (event) =>
                    console.error("Error embedding report:", event.detail),
                ],
              ])
            }
            cssClassName={"Embed-container"}
            getEmbeddedComponent={(embeddedReport) => setReport(embeddedReport)}
          />
        )}
        <PowerBIFilter inputValue={inputValue} report={report} />
      </header>
    </div>
  );
}

export default App;
