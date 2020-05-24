import * as React from "react";
import { GoogleLogout } from "react-google-login";
// @ts-ignore
import conf from "../conf.yaml";

export default ({ appState, token, logOut }) => (
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="navbar-brand">
      <a className="navbar-item" href="#">
        <h1 className="is-size-4 has-text-weight-semibold">BreakGlass</h1>
      </a>

      <a
        role="button"
        className="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div className="navbar-menu">
      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            {appState != "UnAuthed" && (
              <GoogleLogout
                clientId={conf.OAuthClientId}
                render={({ onClick }) => {
                  return (
                    <a
                      className="button is-primary"
                      onClick={() => {
                        onClick();
                        logOut();
                      }}
                    >
                      <strong>Sign Out</strong>
                    </a>
                  );
                }}
              ></GoogleLogout>
            )}
          </div>
        </div>
      </div>
    </div>
  </nav>
);
