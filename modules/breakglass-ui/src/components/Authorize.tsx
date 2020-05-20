import * as React from "react";
import { GoogleLogin } from "react-google-login";

export default ({ onAuth }) => {
  return (
    <div>
      <h1>Login with Google</h1>
      <GoogleLogin
        clientId="250953512740-duat8ikq7jcf4jghhs6ql1mm9b7kch1j"
        buttonText="Login"
        onSuccess={(results) => onAuth(results["tokenId"])}
        onFailure={console.log}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      ></GoogleLogin>
    </div>
  );
};
