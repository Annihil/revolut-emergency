import React, { useContext } from 'react';
import { Login } from './screens/Login'
import { Confirm } from "./screens/Confirm";
import { OverlaySpinner } from "./components/Spinner";
import { Main } from "./screens/Main";
import { TitleBarBtns } from "./components/TitleBarBtns";
import { NavContext, NavContextProvider } from "./contexts/NavContext";
import { TransactionContextProvider } from "./contexts/TransactionContext";
import { CardContextProvider } from "./contexts/CardContext";
import { GuestContextProvider } from "./contexts/GuestContext";
import { ChatContextProvider } from "./contexts/ChatContext";

const Screen = () => {
  const { screen } = useContext(NavContext);

  if (screen === 'login')
    return <GuestContextProvider><Login /></GuestContextProvider>;
  if (screen === 'confirm')
    return <GuestContextProvider><Confirm /></GuestContextProvider>;
  if (screen.startsWith('main'))
    return <TransactionContextProvider>
      <CardContextProvider>
        <ChatContextProvider>
          <Main />
        </ChatContextProvider>
      </CardContextProvider>
    </TransactionContextProvider>;
  return <div>=(</div>
};

const App = () => <NavContextProvider>
  <TitleBarBtns />
  <Screen />
  <OverlaySpinner />
</NavContextProvider>;

export default App;
