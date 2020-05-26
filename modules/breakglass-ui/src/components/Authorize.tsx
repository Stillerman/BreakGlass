import * as React from "react";
import { GoogleLogin } from "react-google-login";
import axios from "axios";

export default ({ onAuth }) => {
  const [clientId, setClientId] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  async function fetchClientId() {
    setLoading(true);
    const resp = await axios.get("/oauthClientId");
    console.log(resp);
    setClientId(resp.data);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchClientId();
  }, []);
  return (
    <div>
      <h1>Login with Google</h1>
      {loading ? (
        <p>Loading</p>
      ) : (
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={(results) => onAuth(results["tokenId"])}
          onFailure={console.log}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        ></GoogleLogin>
      )}
    </div>
  );
};
