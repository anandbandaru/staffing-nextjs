import React, { useContext, useEffect, useState } from "react";
import Main from "./codebase/components/main/main";
import { Context } from "./codebase/context/context";
import Login from "./codebase/components/login/login";

const App = () => {
  const { userName } = useContext(Context);

  return (
    <>
      {userName ? <Main /> : <Login />}
    </>
  )
}

export default App;