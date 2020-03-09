import React, { useContext, useEffect, useRef, useState } from 'react'
import { rApi, routes } from "../api";
import styled from "styled-components";
import { Spacer } from "../components/Spacer";
import { PinkButton } from "../components/PinkButton";
import { BackButton } from "../components/BackButton";
import { NavContext } from "../contexts/NavContext";
import { TransactionContext } from "../contexts/TransactionContext";

const FormData = window.require('form-data');
const fs = window.require('fs');

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: auto;
  align-self: center;
  justify-content: center;
`;

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 28rem;
  align-self: center;
  align-items: center;
`;

const Error = styled.div`
  color: #f44336;
  text-align: center;
`;

const Title = styled.div`
  color: #000;
  font-size: 1.3rem;
  text-align: center;
`;

const BackButtonStyled = styled(BackButton)`
  position: absolute;
  top: 3.2rem;
  left: 2rem;
`;

const StyledPinkButton = styled(PinkButton)`
  margin-bottom: 0;
`;

const Canvas = styled.canvas`
  display: none;
`;

export const Biometric = () => {
  const { setScreen, setLoading } = useContext(NavContext);
  const { setWallet } = useContext(TransactionContext);
  const [error, setError] = useState(null as null | string);
  const videoRef = useRef(null as null | HTMLVideoElement);
  const canvasRef = useRef(null as null | HTMLCanvasElement);
  const streamRef = useRef(null as null | MediaStream);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current!.srcObject = stream;
        streamRef.current = stream;
      }).catch(() => console.error);

    return function cleanup() {
      streamRef.current!.getTracks().forEach(track => track.stop())
    };
  }, []);

  const takePhoto = () => {
    canvasRef.current!.getContext('2d')!.drawImage(videoRef.current!, 0, 0, 800, 600);
    const dataUrl = canvasRef.current!.toDataURL('image/png');
    const data = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    const buffer = Buffer.from(data, 'base64');
    fs.writeFileSync('selfie.png', buffer);
    return fs.readFileSync('selfie.png');
  };

  const submit = async () => {
    let res;
    try {
      const formData = new FormData();
      const photo = await takePhoto();
      formData.append('selfie', photo, 'selfie');
      setLoading(true);
      res = await rApi.post(routes.loginBiometric, formData, { headers: formData.getHeaders() }) as { data: { id: string } };
    } catch (e) {
      setLoading(false);
      if (e.response) {
        console.error({ 'e.response': e.response });
      }
      return console.error(e);
    }
    setError(null);
    setLoading(false);

    console.log({ loginBiometricResult: res.data });

    try {
      setLoading(true);
      res = await rApi.post(routes.loginBiometricConfirm(res.data.id));
    } catch (e) {
      setLoading(false);
      if (e.response) {
        if (e.response.status === 403) {
          setError(e.response.data.message);
        }
      }
      return console.error(e.response);
    }
    setError(null);
    setLoading(false);

    console.log({ loginBiometricConfirmResult: res.data });

    rApi.defaults.auth = {
      username: res.data.user.id,
      password: res.data.accessToken
    };
    setWallet(res.data.wallet);
    localStorage.setItem('id', res.data.user.id);
    localStorage.setItem('accessToken', res.data.accessToken);
    setScreen('main/transactions');
  };

  return <Container>
    <BackButtonStyled onClick={() => setScreen('login')} />
    <Container2>
      <Title>Please take a Selfie</Title>
      <Spacer height='2.2rem' />
      <Canvas ref={canvasRef} width="800" height="600" />
      <video ref={videoRef} autoPlay />
      <Spacer height='3rem' />
      {error && <>
        <Error>{error}</Error>
        <Spacer height='3rem' />
      </>}
      <StyledPinkButton onClick={submit}>Take</StyledPinkButton>
    </Container2>
  </Container>
};
