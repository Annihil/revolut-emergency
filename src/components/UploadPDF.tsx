import styled, { css } from "styled-components";
import { PayloadUpload } from "../api";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import pdf from '../assets/chat/pdf.svg';

const { shell } = window.require('electron').remote;

const StyledUploadPdf = styled.img<{ fromClient: boolean }>`
  height: 10rem;
  padding: 2rem 2rem;
	border-radius: 1rem;
	align-self: flex-start;
	margin: .5rem 0;
	background-color: #f3f4f5;
	border: 1px solid #1378e8;
	cursor: pointer;
	
	${props => props.fromClient && css`
    align-self: flex-end;
  `}
`;

export const UploadPDF = ({ payload, fromClient }: { payload: PayloadUpload, fromClient: boolean }) => {
  const { uploads, loadUpload } = useContext(UserContext);
  useEffect(() => {
    if (!uploads[payload.uploadId]) loadUpload(payload.uploadId);
    // eslint-disable-next-line
  }, []);

  if (!uploads[payload.uploadId]) return null;
  return <StyledUploadPdf
    src={pdf}
    fromClient={fromClient}
    onClick={() => shell.openExternal(uploads[payload.uploadId])}
  />;
};
