import React, { useContext } from "react";
import styled from "styled-components";

import spinnerImg from '../assets/spinner.png';
import { UserContext } from "../contexts/UserContext";

export const Spinner = () => (
  <StyledSpinner src={spinnerImg} />
);

const StyledSpinner = styled.img`
  animation: rotate 1s linear infinite;
  width: 50px;
  height: 50px;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StyledOverlaySpinner = styled.div`
	background-color: rgba(255, 255, 255, .5);
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const OverlaySpinner = () => {
  const { loading } = useContext(UserContext);

  if (!loading) return null;

  return <StyledOverlaySpinner>
    <Spinner />
  </StyledOverlaySpinner>;
};

