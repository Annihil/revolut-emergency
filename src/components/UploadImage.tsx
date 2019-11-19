import { PayloadUpload } from "../api";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import styled, { css } from "styled-components";

const StyledUploadImg = styled.img<{ fromClient: boolean }>`
  max-width: 10rem;
  max-height: 10rem;
	border-radius: 1rem;
	align-self: flex-start;
	margin: .5rem 0;
	
	${props => props.fromClient && css`
    align-self: flex-end;
  `}
`;

export const UploadImage = ({ payload, fromClient }: { payload: PayloadUpload, fromClient: boolean }) => {
  const { uploads, loadUpload } = useContext(UserContext);
  useEffect(() => {
    if (!uploads[payload.uploadId]) loadUpload(payload.uploadId);
    // eslint-disable-next-line
  }, []);

  if (!uploads[payload.uploadId]) return null;
  return <StyledUploadImg src={uploads[payload.uploadId]} fromClient={fromClient} />;
};
