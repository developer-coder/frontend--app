import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "myrelam",
  clientId: "react-admin-app",
});

export default keycloak;
