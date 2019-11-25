import React, { useContext, useEffect, useState } from 'react'
import { rApi, routes } from "../api";
import styled from "styled-components";
import { FloatingInput } from "../components/FloatingInput";
import { Spacer } from "../components/Spacer";
import { PinkButton } from "../components/PinkButton";
import Lottie from "react-lottie";
import loungeOnPc from "../assets/lottie/lounge_on_pc.json";
import { BackButton } from "../components/BackButton";
import { GuestContext } from "../contexts/GuestContext";
import { NavContext } from "../contexts/NavContext";
import { TransactionContext } from "../contexts/TransactionContext";

const shell = window.require('electron').shell;

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

const ChannelInfo = styled.div`
	color: #8b959e;
	text-align: center;
	max-width: 28rem;
`;

const BackButtonStyled = styled(BackButton)`
	position: absolute;
	top: 3.2rem;
  left: 2rem;
`;

const StyledSpan = styled.span`
	margin-left: .25rem;
	cursor: pointer;
	
	:hover {
		color: #0075eb;
	}
`;

const StyledLink = styled.a`
	text-align: center;
	color: #0075eb;
	cursor: pointer;
	margin-top: .3rem;
`;

const loginChannelMap = {
  'SMS': 'SMS',
  'EMAIL': 'email',
  'CALL': 'phone call'
};

export const Confirm = () => {
  const [code, setCode] = useState('');
  const { setScreen, setLoading } = useContext(NavContext);
  const { phone, loginChannel, verificationOptions } = useContext(GuestContext);
  const { setWallet } = useContext(TransactionContext);
  const [error, setError] = useState(null as null | string);
  const [codeInvalid, setCodeInvalid] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let res;
    try {
      setLoading(true);
      res = await rApi.post(routes.loginConfirm, { code, phone });
    } catch (e) {
      setLoading(false);
      if (e.response) {
        if (e.response.status === 422) {
          setError('Incorrect code');
          setCodeInvalid(true);
        }
      }
      return console.error(e.response);
    }
    setError(null);
    setLoading(false);

    console.log({ loginConfirmResult: res.data });
    rApi.defaults.auth = {
      username: res.data.user.id,
      password: res.data.accessToken
    };
    setWallet(res.data.wallet);
    localStorage.setItem('id', res.data.user.id);
    localStorage.setItem('accessToken', res.data.accessToken);
    setScreen('main/transactions');
  };

  useEffect(() => {
    setCodeInvalid(false);
  }, [code]);

  const openEmailWiki = () => {
    shell.openExternal('https://github.com/Annihil/revolut-emergency/wiki/How-to-login-with-email');
  };

  const requestCall = () => {
    rApi.post(routes.verificationCodeCall, { phone });
  };

  const requestSMS = () => {
    rApi.post(routes.verificationCodeResend, { phone });
  };

  const channel = verificationOptions && verificationOptions.find(option => option.channel === loginChannel);
  const loginChannelPretty = loginChannelMap[loginChannel!];

  return <Container>
    <BackButtonStyled onClick={() => setScreen('login')} />
    <Lottie
      options={{
        animationData: loungeOnPc
      }}
      height={400}
      width={400} />
    <Spacer height='3rem' />
    <Form onSubmit={e => handleSubmit(e)}>
      {loginChannel === 'SMS' && <>
				<ChannelInfo>A 6-digit verification code has been sent to you via {loginChannelPretty}</ChannelInfo>
				<StyledLink onClick={requestSMS}>Resend code</StyledLink>
			</>}
      {loginChannel === 'EMAIL' && <>
				<ChannelInfo>
					A 6-digit verification code has been sent to you via {loginChannelPretty} at {channel!.value}
          {loginChannel === 'EMAIL' && <StyledSpan onClick={openEmailWiki}>[?]</StyledSpan>}
				</ChannelInfo>
				<StyledLink onClick={requestCall}>Get code via phone call</StyledLink>
			</>}
      <Spacer height='3rem' />
      <FloatingInput
        value={code}
        onChange={e => setCode(e.target.value)}
        label='Code'
        width='100%'
        required
        code
        type='number'
        pattern='[0-9]*'
        invalid={codeInvalid}
      />
      <Spacer height='3rem' />
      {error && <>
				<Error>{error}</Error>
				<Spacer height='3rem' />
			</>}
      <PinkButton
        type="submit"
      >
        Confirm
      </PinkButton>
    </Form>
    <Spacer height='3rem' />
  </Container>
};
