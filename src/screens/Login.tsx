import React, { useContext, useEffect, useState } from 'react'
import { rApi, routes } from "../api";
import { UserContext } from "../contexts/UserContext";
import { PinkButton } from "../components/PinkButton";
import { FloatingInput } from "../components/FloatingInput";
import styled from "styled-components";
import { Spacer } from "../components/Spacer";
import Lottie from "react-lottie";
import loungeYo from '../assets/lottie/lounge_yo.json'

const Container = styled.div`
  display: flex;
  flex-direction: column;
	margin-top: auto;
	margin-bottom: auto;
	align-self: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 28rem;
	align-self: center;
`;

const Error = styled.div`
	color: #f44336;
	text-align: center;
`;

export const Login = () => {
  const [password, setPassword] = useState('');
  const { setScreen, phone, setPhone, setLoading, setLoginChannel, setVerificationOptions } = useContext(UserContext);
  const [error, setError] = useState<String | null>(null);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let res;
    try {
      res = await rApi.post(routes.login, { phone, password });
    } catch (e) {
      setLoading(false);
      if (e.response) {
        if (e.response.status === 400) {
          setError(e.response.data.message);
          setPhoneInvalid(true);
        }
        if (e.response.status === 401) {
          setError('Incorrect phone number or passcode');
          setPhoneInvalid(true);
          setPasswordInvalid(true);
        }
        return console.error(e.response);
      }
      return console.error(e);
    }
    setError(null);
    setLoading(false);
    console.log({ loginResult: res.data });
    setLoginChannel(res.data.channel);

    if (res.data.channel === 'EMAIL') {
      setLoading(true);
      try {
        const optionsRes = await rApi(routes.verificationOptions(phone!));
        setVerificationOptions(optionsRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    setScreen('confirm', false);
  };

  useEffect(() => {
    setPhoneInvalid(false);
    setPasswordInvalid(false);
  }, [phone, password]);

  return <Container>
    <Lottie
      options={{
        animationData: loungeYo
      }}
      height={400}
      width={400} />
    <Spacer height='3rem' />
    <Form onSubmit={e => handleSubmit(e)}>
      <FloatingInput
        value={phone}
        onChange={e => setPhone(e.target.value)}
        label='Phone number'
        width='100%'
        required
        invalid={phoneInvalid}
      />
      <Spacer />
      <FloatingInput
        value={password}
        onChange={e => setPassword(e.target.value)}
        label='Passcode'
        width='100%'
        type='password'
        required
        maxLength={4}
        code
        invalid={passwordInvalid}
      />
      <Spacer height='3rem' />
      {error && <>
				<Error>{error}</Error>
				<Spacer height='3rem' />
			</>}
      <PinkButton
        type="submit"
      >
        Login
      </PinkButton>
    </Form>
    <Spacer height='3rem' />
  </Container>
};
