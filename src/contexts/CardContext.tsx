import React, { ReactNode, useCallback, useState } from 'react'
import { ICard, rApi, routes } from "../api";

interface ICardContext {
  cards: ICard[]
  setCards: (card: ICard[]) => void
  loadCards: () => void
  blockCard: (card: ICard) => void
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
  }, []);

  const blockCard = useCallback(async (card: ICard) => {
    let res = null as { data: ICard } | null;
    try {
      res = await rApi.post(routes.myCardBlock(card.id)) as { data: ICard } | null;
    } catch (e) {
      return console.error(e.response);
    }

    console.log({ blockCard: res!.data });

    setCards(prevCards => prevCards.map(c => c.id === card.id ? res!.data : c));
  }, []);

  const value = React.useMemo(
    () => ({
      cards,
      setCards,
      loadCards,
      blockCard
    }),
    [cards],
  );

  return <CardContext.Provider value={value} {...props} />
};
