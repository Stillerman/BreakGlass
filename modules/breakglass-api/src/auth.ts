import jwtDecode from "jwt-decode";

export function validateUser(req, res, next) {
  let decoded = jwtDecode(req.headers["x-access-token"]);

  if (!decoded) {
    return res.status(401).send("You did not provide jwt");
  } else if (decoded.exp * 1000 <= Date.now()) {
    return res.status(401).send("JWT is expired!");
  } else {
    req.user = decoded;
    next();
  }
}
