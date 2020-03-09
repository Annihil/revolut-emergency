import React, { useContext } from 'react';
import { Login } from './screens/Login'
import { Confirm } from "./screens/Confirm";
import { Biometric } from "./screens/Biometric";
import { OverlaySpinner } from "./components/Spinner";
import { Main } from "./screens/Main";
import { TitleBarBtns } from "./components/TitleBarBtns";
import { NavContext, NavContextProvider } from "./contexts/NavContext";
import { GuestContextProvider } from "./contexts/GuestContext";
import { CardContextProvider } from "./contexts/CardContext";
import { ChatContextProvider } from "./contexts/ChatContext";
import { TransactionContextProvider } from "./contexts/TransactionContext";

const Screen = () => {
  const { screen } = useContext(NavContext);

  if (screen === 'login')
    return <Login />;
  if (screen === 'confirm')
    return <Confirm />;
  if (screen === 'biometric')
    return <Biometric />;
  if (screen.startsWith('main'))
    return <Main />;
  return <div>=(</div>
};

const App = () => <>
  <TitleBarBtns />
  <NavContextProvider>
    <GuestContextProvider>
      <TransactionContextProvider>
        <CardContextProvider>
          <ChatContextProvider>
            <Screen />
          </ChatContextProvider>
        </CardContextProvider>
      </TransactionContextProvider>
    </GuestContextProvider>
    <OverlaySpinner />
  </NavContextProvider>
</>;

export default App;
