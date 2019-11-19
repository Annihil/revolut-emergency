import React, { useCallback, useContext, useEffect } from 'react'
import { UserContext } from "../contexts/UserContext";
import styled from 'styled-components';
import { ChatPreview } from "../components/ChatPreview";
import { NewChat } from "../components/NewChat";
import he from 'he';
import { Spinner } from "../components/Spinner";
import attach from '../assets/chat/attach.svg';
import { MessageItem } from "../components/MessageItem";
import { UploadImage } from "../components/UploadImage";
import { UploadPDF } from "../components/UploadPDF";
import { ResolveRatingBox } from "../components/ResolveRatingBox";

const FormData = window.require('form-data');
const fs = window.require('fs');
const { dialog } = window.require('electron').remote;

const Container = styled.div`
	display: flex;
	flex: 1;
	min-height: 0;
`;

const Side = styled.div`
	display: flex;
	min-height: 0;
	overflow-y: scroll;
	min-width: 20rem;
	flex-direction: column;
`;

const Main = styled.div`
	display: flex;
	min-height: 0;
	flex: 1;
	flex-direction: column;
`;

const Messages = styled.div`
	display: flex;
	min-height: 0;
	overflow-y: scroll;
	flex-direction: column-reverse;
	flex: 1;
	padding: 1rem;
`;

const Loader = styled(Spinner)`
  margin: auto;
`;

const ContainerTxt = styled.div`
  display: flex;
  border-top: 1px solid #d1d7dd;
`;

const TxtArea = styled.textarea`
  border: none;
  flex: 1;
  resize: none;
  outline: none;
  padding: .5rem .5rem;
  font-size: 16px;
`;

const SendButton = styled.div`
  color: #1378e8;
  font-family: 'Roboto Medium', sans-serif;
  align-self: center;
  margin: 0 .5rem;
  cursor: pointer;
`;

const UploadAttachmentBtn = styled.img`
  width: 2rem;
  height: 2rem;
  align-self: center;
  margin: 0 .5rem;
  cursor: pointer;
`;


export const Chats = () => {
  const { chatsHistory, messages, currentChat, setCurrentChat, loadMessages, openTicket, openTickets, text, setText, sendText, readChat, sendAttachment } = useContext(UserContext);

  const chat = currentChat ? messages[currentChat] : null;
  const chatHistory = currentChat ? [...openTickets, ...chatsHistory].find(c => c.id === currentChat) : null;

  useEffect(() => {
    if (!currentChat) return;
    loadMessages(currentChat);
    // eslint-disable-next-line
  }, [currentChat]);

  useEffect(() => {
    if (!currentChat || chat?.length === 0) return;
    readChat();
    // eslint-disable-next-line
  }, [currentChat, chat?.length]);

  const handleFile = useCallback(async () => {
    let result;
    try {
      result = await dialog.showOpenDialog({
        properties: ['openFile']
      });
    } catch (e) {
      return console.error(e);
    }

    console.log({ result });

    const file = fs.readFileSync(result.filePaths[0]);

    const formData = new FormData();
    formData.append('file', file, result.filePaths[0]);
    sendAttachment(formData);
    // eslint-disable-next-line
  }, [currentChat]);

  return <Container>
    <Side>
      {!openTickets.length && <NewChat onClick={() => openTicket()} />}
      {[...openTickets, ...chatsHistory].map(c => <ChatPreview
        active={currentChat === c.id}
        key={c.id}
        onClick={() => setCurrentChat(c.id)}
        chatHistory={c}
      />)}
    </Side>
    <Main>
      <Messages>
        {currentChat && !chat?.length && <Loader />}
        {chat?.length && chat.filter(m => m.payload.type.match(/text|upload|rated|resolved/)).map((m, i) => {
          if (m.payload.type === 'text')
            return <MessageItem key={m.id} fromClient={m.fromClient}>{he.decode(m.payload.text)}</MessageItem>;
          if (m.payload.type === 'upload') {
            if (m.payload.mediaType.startsWith('image')) {
              return <UploadImage key={m.id} payload={m.payload} fromClient={m.fromClient} />;
            }
            if (m.payload.mediaType === 'application/pdf') {
              return <UploadPDF key={m.id} payload={m.payload} fromClient={m.fromClient} />;
            }
          }
          if (m.payload.type === 'rated') {
            return <MessageItem key={m.id} fromClient={true}>★ {m.payload.rating}</MessageItem>;
          }
          if (m.payload.type === 'resolved' && i === 0) {
            return <ResolveRatingBox key={m.id} />;
          }
          return null;
        })
        }
      </Messages>
      {chatHistory?.readOnly === false &&
			<ContainerTxt>
				<TxtArea value={text} onChange={e => setText(e.target.value)} />
        {!text.length && <UploadAttachmentBtn src={attach} onClick={() => handleFile()} />}
        {!!text.length && <SendButton onClick={() => sendText()}>Send</SendButton>}
			</ContainerTxt>}
    </Main>
  </Container>
};
