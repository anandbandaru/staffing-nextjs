import React, { useContext } from "react";
import Main from "./codebase/components/main/main";
import { Context } from "./codebase/context/context";
import Login from "./codebase/components/login/login";
import ErrorBoundary from "./errors"

const App = () => {
  const { userName } = useContext(Context);
  return (
    <>
      {userName ?
        <ErrorBoundary>
          <Main />
        </ErrorBoundary>
        :
        <Login />}
    </>
  )
}

export default App;