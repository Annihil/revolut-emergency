import React, { ReactNode, useState } from 'react'
import { IVerificationOption } from "../api";

interface IGuestContext {
  loginChannel: IVerificationOption['channel'] | null
  setLoginChannel: (loginChannel: IVerificationOption['channel']) => void
  verificationOptions: IVerificationOption[] | null
  setVerificationOptions: (verificationOptions: IVerificationOption[]) => void
  phone: string
  setPhone: (phone: string) => void
}

export const GuestContext = React.createContext<IGuestContext>({} as IGuestContext);

export const GuestContextProvider = (props: { children: ReactNode }) => {
  const [loginChannel, setLoginChannel] = useState<IVerificationOption['channel'] | null>(null);
  const [verificationOptions, setVerificationOptions] = useState<IVerificationOption[] | null>(null);
  const [phone, setPhone] = useState('');

  const value = React.useMemo(
    () => ({
      phone,
      setPhone,
      loginChannel,
      setLoginChannel,
      verificationOptions,
      setVerificationOptions,
    }),
    [
      phone,
      loginChannel,
      verificationOptions,
    ],
  );

  return <GuestContext.Provider value={value} {...props} />
};
