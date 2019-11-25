import React, { ReactNode, useState } from 'react'

interface INavContext {
  screen: string
  setScreen: (screen: string, save?: boolean) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export const NavContext = React.createContext<INavContext>({} as INavContext);

export const NavContextProvider = (props: { children: ReactNode }) => {
  const initialScreen = localStorage.getItem('screen');
  const [screen, setScreen] = useState<string>(initialScreen || 'login');
  const [loading, setLoading] = useState(false);

  const setScreenLocal = (screen: string, save = true) => {
    if (save) localStorage.setItem('screen', screen);
    setScreen(screen);
  };

  const value = React.useMemo(() => ({
      screen,
      setScreen: setScreenLocal,
      loading,
      setLoading
    }),
    [screen, loading],
  );

  return <NavContext.Provider value={value} {...props} />
};
