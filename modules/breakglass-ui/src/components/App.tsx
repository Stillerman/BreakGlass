import * as React from "react";
import Navbar from "./Navbar";
import Elevator from "./Elevator";
import axios from "axios";
import Done from "./Done";
import Authorize from "./Authorize";
import { useState } from "react";

type AppState = "UnAuthed" | "Elevator" | "Loading" | "Error" | "Done";

const App = () => {
  const [appState, setAppState] = useState<AppState>("UnAuthed");
  const [error, setError] = useState<string>("No Error!");
  const [token, setToken] = useState("");

  async function handleBreakGlass(params) {
    setAppState("Loading");
    const resp = await axios.post("/grantRole", params, {
      headers: {
        "x-access-token": token,
      },
    });
    console.log("You broke the glass!", resp);
    setAppState("Done");
  }

  function handleAuth(token: string) {
    setToken(token);
    setAppState("Elevator");
  }

  function handleError(err: string) {
    setAppState("Error");
    setError(err);
  }

  function getMainContent() {
    switch (appState) {
      case "UnAuthed":
        return <Authorize onAuth={handleAuth}></Authorize>;
      case "Elevator":
        return (
          <Elevator
            token={token}
            onError={handleError}
            onGlassBroken={handleBreakGlass}
          ></Elevator>
        );
      case "Done":
        return <Done />;
      case "Loading":
        return <p>Loading...</p>;
      case "Error":
        return <p>Error: {error}</p>;
    }
  }

  return (
    <div>
      <Navbar
        appState={appState}
        token={token}
        logOut={() => setAppState("UnAuthed")}
      ></Navbar>
      <section className="section">
        <div className="container">{getMainContent()}</div>
      </section>
    </div>
  );
};

export default App;
