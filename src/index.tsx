import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createGlobalStyle } from 'styled-components';
import RobotoRegular from './assets/roboto_regular.ttf';
import RobotoMediumFont from './assets/roboto_medium.ttf';
import RobotoMonoMediumFont from './assets/roboto_mono_medium.ttf';
import Ocra10 from './assets/ocra10.ttf';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto';
    src: url('${RobotoRegular}') format('truetype');
  }
  
  @font-face {
    font-family: 'Roboto Medium';
    src: url('${RobotoMediumFont}') format('truetype');
  }
  
  @font-face {
    font-family: 'Roboto Mono Medium';
    src: url('${RobotoMonoMediumFont}') format('truetype');
  }
  
  @font-face {
    font-family: 'ocra10';
    src: url('${Ocra10}') format('truetype');
  }
  
  html, body {
    font: 14px/1.21 'Roboto', sans-serif;
    font-weight: 400;
    height: 100%;
    margin: 0;
  }

  body {
    display: flex;
		justify-content: center;
  }
  
  #root {
		display: flex;
		flex: 1;
		flex-flow: column;
		width: 100%;
		height: 100%;
	}
	
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		display: none;
		-webkit-appearance: none;
		margin: 0;
	}
`;

ReactDOM.render(<>
  <App />
  <GlobalStyle />
</>, document.getElementById('root'));

serviceWorker.unregister();
