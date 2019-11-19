import styled, { css } from "styled-components";

export const MessageItem = styled.div<{ fromClient: boolean }>`
	padding: .75rem;
	border-radius: 1rem;
	background-color: #f3f4f5;
	align-self: flex-start;
	margin: .5rem 0;
	max-width: 30rem;
	
	${props => props.fromClient && css`
    background-color: #1378e8;
    color: #fff;
    align-self: flex-end;
  `}
`;
