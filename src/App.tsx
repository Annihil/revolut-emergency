import React, { useContext } from 'react';
import { UserContext, UserContextProvider } from "./contexts/UserContext";
import { Login } from './screens/Login'
import { Confirm } from "./screens/Confirm";
import { OverlaySpinner } from "./components/Spinner";
import { Main } from "./screens/Main";
import { TitleBarBtns } from "./components/TitleBarBtns";

const Screen = () => {
  const { screen } = useContext(UserContext);

  if (screen === 'login')
    return <Login />;
  if (screen === 'confirm')
    return <Confirm />;
  if (screen.startsWith('main'))
    return <Main />;
  return <div>=(</div>
};

const App = () => <UserContextProvider>
  <TitleBarBtns />
  <Screen />
  <OverlaySpinner />
</UserContextProvider>;

export default App;
