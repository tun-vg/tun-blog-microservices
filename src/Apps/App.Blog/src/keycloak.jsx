import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: 'http://localhost:8188',
    realm: 'BLOG',
    clientId: 'blog_client_fe'
});

export default keycloak;