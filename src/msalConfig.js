import { PublicClientApplication } from "@azure/msal-browser";

const MSAL_CONFIG = {
    auth: {
        clientId: "f125865a-dfc0-4e3f-953a-c9171458979e",
        authority: "https://login.microsoftonline.com/vsksoftwareoutlook.onmicrosoft.com",
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
};

const LOGIN_REQUEST = {
    scopes: ["openid", "offline_access", "User.Read.All", "profile", "Files.ReadWrite.All"]
};

const TOKEN_REQUEST = {
    scopes: ["User.Read.All", "profile", "Files.ReadWrite.All"]
};

const GRAPH_CONFIG = {
    graphUsersEndpoint: "https://graph.microsoft.com/v1.0/users"
};

const PUBLIC_CLIENT_APPLICATION = new PublicClientApplication(MSAL_CONFIG);
async function initializeMsal() {
    await PUBLIC_CLIENT_APPLICATION.initialize();
}
initializeMsal();


export {
    MSAL_CONFIG,
    LOGIN_REQUEST,
    TOKEN_REQUEST,
    GRAPH_CONFIG,
    PUBLIC_CLIENT_APPLICATION
  };