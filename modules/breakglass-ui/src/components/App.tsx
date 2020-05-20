import * as React from "react";
import Navbar from "./Navbar";
import Elevator from "./Elevator";
import axios from "axios";
import Done from "./Done";
import Authorize from "./Authorize";
import { useState } from "react";

const App = () => {
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [done, setDone] = useState(false);

  async function handleBreakGlass(params) {
    const resp = await axios.post("/grantRole", params, {
      headers: {
        "x-access-token": token,
      },
    });
    console.log("You broke the glass!", resp);
    setDone(true);
  }

  function handleAuth(token: string) {
    setToken(token);
    setAuthed(true);
  }

  return (
    <div>
      <Navbar></Navbar>

      {/* <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Elevate Your GCP Permissions</h1>
            <h2 className="subtitle">Without waking the RP</h2>
          </div>
        </div>
      </section> */}
      <section className="section">
        <div className="container">
          {!authed ? (
            <Authorize onAuth={handleAuth}></Authorize>
          ) : done ? (
            <Done />
          ) : (
            <Elevator token={token} onGlassBroken={handleBreakGlass}></Elevator>
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
