import { PayloadUpload } from "../api";
import React, { useContext, useEffect } from "react";
import styled, { css } from "styled-components";
import { ChatContext } from "../contexts/ChatContext";

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
  const { uploads, loadUpload } = useContext(ChatContext);
  useEffect(() => {
    if (!uploads[payload.uploadId]) loadUpload(payload.uploadId);
  }, []);

  if (!uploads[payload.uploadId]) return null;
  return <StyledUploadImg src={uploads[payload.uploadId]} fromClient={fromClient} />;
};
