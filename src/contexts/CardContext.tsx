import React, { ReactNode, useCallback, useState } from 'react'
import { ICard, rApi, routes } from "../api";

interface ICardContext {
  cards: ICard[]
  setCards: (card: ICard[]) => void
  loadCards: () => void
}

export const CardContext = React.createContext<ICardContext>({} as ICardContext);

export const CardContextProvider = (props: { children: ReactNode }) => {
  const [cards, setCards] = useState<ICard[]>([]);

  const loadCards = useCallback(async () => {
    let res;
    try {
      res = await rApi(routes.myCards);
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ cards: res.data });
    setCards(res.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = React.useMemo(
    () => ({
      cards,
      setCards,
      loadCards,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      cards,
    ],
  );

  return <CardContext.Provider value={value} {...props} />
};
