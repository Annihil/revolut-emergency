import React from 'react'
import styled, { css } from 'styled-components';
import cross from '../assets/menu/cross.png';
import expand from '../assets/menu/expand.png';
import minus from '../assets/menu/minus.png';

const { remote } = window.require("electron");
const win = remote.BrowserWindow.getFocusedWindow();

const Container = styled.div`
	position: absolute;
	top: 1px;
	left: 4px;
	display: flex;
	align-items: center;
	justify-content: space-around;
	user-select: none;
`;

const StyledDiv = styled.div<{ purple?: boolean }>`
	width: 12px;
	height: 12px;
	border-radius: 6px;
	margin: 4px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	user-select: none;
	filter: grayscale(100%) brightness(125%);
	animation: all .3s ease;
	${window.process.platform === 'darwin' && css`background-color: #0075eb;`}
	${props => props.purple && window.process.platform === 'darwin' && css`background-color: #EB008D;`}
	
	:hover {
		filter: none;
	}
`;

const StyledImg = styled.img`
	width: 9px;
	height: 9px;
	${window.process.platform === 'darwin' && css`display: none;`}
`;

export const TitleBarBtns = () => <Container>
  <StyledDiv purple onClick={() => win.minimize()}>
    <StyledImg draggable={false} src={cross} />
  </StyledDiv>
  <StyledDiv onClick={() => win.close()}><StyledImg draggable={false} src={minus} /></StyledDiv>
  <StyledDiv onClick={() => {
    win.setFullScreen(!win.isFullScreen())
  }}>
    <StyledImg draggable={false} src={expand} />
  </StyledDiv>
</Container>;
