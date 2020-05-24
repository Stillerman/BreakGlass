import * as React from "react";
import { GoogleLogin } from "react-google-login";

// @ts-ignore
import conf from "../conf.yaml";

export default ({ onAuth }) => {
  return (
    <div>
      <h1>Login with Google</h1>
      <GoogleLogin
        clientId={conf.OAuthClientId}
        buttonText="Login"
        onSuccess={(results) => onAuth(results["tokenId"])}
        onFailure={console.log}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      ></GoogleLogin>
    </div>
  );
};
