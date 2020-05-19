import * as React from "react";
import Navbar from "./Navbar";
import Elevator from "./Elevator";
import axios from "axios";
import Done from "./Done";
import { useState } from "react";

const App = () => {
  const [done, setDone] = useState(false);
  async function handleBreakGlass(params) {
    const resp = await axios.post("/grantRole", params);
    console.log("You broke the glass!", resp);
    setDone(true);
  }

  return (
    <div>
      <Navbar></Navbar>

      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Elevate Your GCP Permissions</h1>
            <h2 className="subtitle">Without waking the RP</h2>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {done ? (
            <Done />
          ) : (
            <Elevator onGlassBroken={handleBreakGlass}></Elevator>
          )}
        </div>
      </section>
    </div>
  );
};

export default App;
