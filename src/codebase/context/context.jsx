import { createContext, useState, useEffect } from "react";
import { GRAPH_CONFIG, LOGIN_REQUEST, MSAL_CONFIG, PUBLIC_CLIENT_APPLICATION, TOKEN_REQUEST } from "../../msalConfig";

export const Context = createContext();

const ContextProvider = (props) => {

    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [loginInteractionInProgress, setLoginInteractionInProgress] = useState(false);
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("");

    const flaskAPI_Availability = process.env.REACT_APP_API_SUFFIX;
    const [loading, setLoading] = useState(false);
    const [showGreetings, setShowGreetings] = useState(false);

    const [selectedDBType, setSelectedDBType] = useState("SQL");
    const [APIPath, setAPIPath] = useState(flaskAPI_Availability);
    const [selectedDB, setSelectedDB] = useState(process.env.REACT_APP_DEFAULT_DBCODE);
    const [selectedDBID, setSelectedDBID] = useState(process.env.REACT_APP_DEFAULT_DBID);
    const [isAPILoading, setIsAPILoading] = useState(false);
    const [isAPIError, setIsAPIError] = useState(false);
    const [isAPIReturnExecutionError, setIsAPIReturnExecutionError] = useState(false);
    const [APIAvailabilityResponse, setAPIAvailabilityResponse] = useState(null);
    const [APItext, setAPIText] = useState('');
    const [APIversion, setAPIversion] = useState('');
    const [topTabName, setTopTabName] = useState('');
    const [top2TabName, setTop2TabName] = useState('');

    //FOR HISTORY LOCAL STORAGE
    // const [dataRecentsLS, setDataRecentsLS] = useState(() => {
    //     const storedData = localStorage.getItem('recentPrompts');
    //     return storedData ? JSON.parse(storedData) : [];
    // });


    //API CHECK

    const checkAPIAvailability = async () => {
        setIsAPILoading(true);
        setAPIText("Checking API availability & getting list of data sources....");
        try {
            setAPIPath(flaskAPI_Availability);
            console.log(flaskAPI_Availability);
            const response = await fetch(flaskAPI_Availability);
            const data = await response.json();
            setAPIAvailabilityResponse(data);
            setAPIText("<span class='APIAvailabilityCheckSuccess'>API working as expected.</span>"
                + "<br> <span class='APIAvailabilityCheckLabel'>API Endpoint: </span>" + flaskAPI_Availability
                + "<br> <span class='APIAvailabilityCheckLabel'>API Version: </span>" + data.APIversion
                + "<br> <span class='APIAvailabilityCheckLabel'>API Deployment Time: </span>" + data.localDeployedTime
                + "<br> <span class='APIAvailabilityCheckLabel'>Elapsed Time: </span>" + data.elapsedTime);
            setAPIversion(data.APIversion);
            setIsAPILoading(false);
            setIsAPIError(false);
            console.log("API availability call made.");
        } catch (error) {
            console.error('Error fetching data:', error);
            setAPIText('<span class="APIAvailabilityCheckError">API ERROR: ' + error + '</span>'
                + "<br> <span class='APIAvailabilityCheckLabel'>API Endpoint: </span>" + flaskAPI_Availability
                + "<br> <span class='APIAvailabilityCheckNote'>Click the icon to check again</span>"
            );
            setIsAPIError(true);
            setIsAPILoading(false);
            if (error === "TypeError: Failed to fetch") { }
            // setListOfDatasources(null);
        }
    };

    const signIn = async () => {

        try {
            await PUBLIC_CLIENT_APPLICATION.handleRedirectPromise();
            const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
            console.log("Login successful:", loginResponse);

            setLoginSuccess(true);
            setToken(loginResponse.idToken);
            setUserName(loginResponse.account.username);
        } catch (error) {
            if (error.name === "InteractionRequiredAuthError") {
                try {
                    const loginResponse = await MSAL_CONFIG.acquireTokenPopup(LOGIN_REQUEST);
                    console.log("Token acquired:", loginResponse);

                    setLoginSuccess(true);
                    setToken(loginResponse.idToken);
                    setUserName(loginResponse.account.username);
                } catch (tokenError) {
                    console.log("Token acquisition failed:", tokenError);
                    setLoginSuccess(false);
                    setToken("");
                    setUserName("");
                    setLoginError("Token acquisition failed:", tokenError)
                }
            }
            else if (error.name === "BrowserAuthError" && error.errorCode === "interaction_in_progress") {
                console.log("Interaction already in progress. Please wait.");
                setLoginError("Interaction already in progress. Please wait.")
            }
            else {
                console.log("Login failed:", error);
                setLoginSuccess(false);
                setToken("");
                setUserName("");
                setLoginError("Login failed:", error)
            }
        }
    };
    const signOut = async () => {
        try {
            const logoutRequest = {
                account: PUBLIC_CLIENT_APPLICATION.getAllAccounts()[0], // Get the currently signed-in account
            };
            await PUBLIC_CLIENT_APPLICATION.logoutPopup(logoutRequest);
            console.log("Logout successful");
            setToken("");
            setUserName("");
            setLoginSuccess(false);
        } catch (error) {
            if (error.name === "BrowserAuthError" && error.errorCode === "interaction_in_progress") {
                console.warn("Interaction already in progress. Please wait.");
                setLoginError("Interaction already in progress. Please wait.");
            } else {
                console.error("Logout failed:", error);
            }
            setToken("");
            setUserName("");
            setLoginSuccess(false);
        }

        // if (!loginInteractionInProgress) {
        //     setLoginInteractionInProgress(true);
        //     PUBLIC_CLIENT_APPLICATION.logout();
        //     setToken(null);
        //     setLoginInteractionInProgress(false);
        // }
    };

    useEffect(() => {
        signIn();
        checkAPIAvailability();
    }, [flaskAPI_Availability]);

    const contextValue = {
        loading,
        showGreetings,
        setShowGreetings,
        isAPILoading,
        isAPIError,
        APItext,
        APIversion,
        checkAPIAvailability,
        setSelectedDB,
        selectedDB,
        setSelectedDBType,
        selectedDBType,
        setSelectedDBID,
        selectedDBID,
        APIAvailabilityResponse,
        APIPath,
        isAPIReturnExecutionError,
        topTabName,
        setTopTabName,
        top2TabName,
        setTop2TabName,
        signOut,
        loginSuccess,
        userName
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
