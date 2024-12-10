import { createContext, useState, useEffect } from "react";

export const Context = createContext();

const ContextProvider = (props) => {

    const flaskAPI_Availability = process.env.REACT_APP_SQLGenAI_API_SUFFIX;
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState("");
    const [isGENAPIError, setIsGENAPIError] = useState(false);
    const [GENAPItext, setGENAPIText] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(false);
    const [showGreetings, setShowGreetings] = useState(false);
    
    const [selectedDBType, setSelectedDBType] = useState("SQL");
    const [APIPath, setAPIPath] = useState(flaskAPI_Availability);
    const [APIExamplePromptsSuffix] = useState(process.env.REACT_APP_SQLGenAI_API_EXAMPLE_PROMPTS_SUFFIX);
    const [selectedDB, setSelectedDB] = useState(process.env.REACT_APP_DEFAULT_DBCODE);
    const [selectedDBID, setSelectedDBID] = useState(process.env.REACT_APP_DEFAULT_DBID);
    const [isAPILoading, setIsAPILoading] = useState(false);
    const [isAPIError, setIsAPIError] = useState(false);
    const [isAPIReturnExecutionError, setIsAPIReturnExecutionError] = useState(false);
    const [APIAvailabilityResponse, setAPIAvailabilityResponse] = useState(null);
    const [APItext, setAPIText] = useState('');
    const [APIversion, setAPIversion] = useState('');  

    //FOR HISTORY LOCAL STORAGE
    const [dataRecentsLS, setDataRecentsLS] = useState(() => {
        const storedData = localStorage.getItem('recentPrompts');
        return storedData ? JSON.parse(storedData) : [];
    });


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
            if(error === "TypeError: Failed to fetch")
                {}
                // setListOfDatasources(null);
        }
    };

    useEffect(() => {
        checkAPIAvailability();
    }, [flaskAPI_Availability]);

    const contextValue = {
        showResult,
        loading,
        results,
        dataRecentsLS,
        setDataRecentsLS,
        selectedTemplate,
        setSelectedTemplate,
        showGreetings,
        setShowGreetings,
        isAPILoading,
        isAPIError,
        APItext,
        isGENAPIError,
        GENAPItext,
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
        APIExamplePromptsSuffix,
        isAPIReturnExecutionError
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
