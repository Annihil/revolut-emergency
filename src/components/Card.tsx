import React from 'react';

import styled, { css } from "styled-components";
import visaLogo from "../assets/visa.png";
import mcLogo from "../assets/mc_white.svg";
import rLogo from "../assets/r_logo.svg";
import { ICard } from "../api";

const ratio = 4;

const StyledCard = styled.div<Pick<ICard, 'design' | 'state'>>`
    position: relative;
    display: flex;
    color: white;
    flex-direction: column;
    margin: 2rem;
    min-width: 20rem;
    width: calc(1013px / ${ratio});
    height: calc(623px / ${ratio});
    border-radius: calc(60px / ${ratio});
    user-select: none;
    
    ${props => props.design === 'ORIGINAL' && css`background: linear-gradient(35deg, #b340b2, #7952b4, #1d66b5, #1d51ad);`}
    ${props => props.design === 'COPPER' && css`background-color: #b87333;`}
    ${props => props.design === 'COPPER_BLACK' && css`background-color: #452100;`}
    ${props => props.design === 'ROSE_GOLD' && css`background-color: #d1c2be;`}
    ${props => props.design === 'ROSE_GOLD_BLACK' && css`background: linear-gradient(180deg, #d1c2be, #1c2124);`}
    ${props => props.design === 'SILVER' && css`background-color: #dbdcde;`}
    ${props => props.design === 'BLACK_SILVER' && css`background-color: #36363f;`}
    ${props => props.design === 'SPACE_GREY' && css`background-color: #54545d;`}
    ${props => props.design === 'METAL' && css`background-color: #1c2124;`}
    ${props => props.design === 'PRIDE' && css`background: linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0);`}
    ${props => props.design === 'ROSE_GOLD_METAL' && css`background-color: #d3c4c0;`}
    ${props => props.design === 'SILVER_METAL' && css`background-color: #d0d0d0;`}
    ${props => props.design === 'SPACE_GREY_METAL' && css`background-color: #585861;`}
    ${props => props.design === 'GOLD_METAL' && css`background-color: #d5bc93;`}
    ${props => props.design === 'GOLD_PLASTIC' && css`background-color: #d5bc93;`}
    ${props => props.design === 'YOUTH_ORIGINAL' && css`background-color: red;`}
    ${props => props.design === 'EZYLET' && css`background-color: #ffe001;`}
    ${props => props.design === 'PRIMETEL' && css`background-color: #ce3f41;`}
    ${props => props.design === 'BOOKING' && css`background-color: blue;`}
    ${props => props.design === 'HELLAS_DIRECT' && css`background-color: #5e5e60;`}
    ${props => props.design === 'ORIGINAL_VIRTUAL' && css`background-color: #90c4f9;`}
    ${props => props.design === 'ORIGINAL_DISPOSABLE' && css`background-color: #ff80ab;`}
    
    ${props => props.state === 'BLOCKED' && css`filter: grayscale(100%) brightness(120%);`}
`;

const Type = styled.div`
	position: absolute;
	left: calc(67px / ${ratio});
	top: calc(79px / ${ratio});
	font: calc(44px / ${ratio}) 'ocra10';
	text-transform: uppercase;
`;

const Label = styled.div`
	position: absolute;
	left: calc(67px / ${ratio});
	top: calc(183px / ${ratio});
	font: calc(44px / ${ratio}) 'ocra10';
`;

const Number = styled.div`
	position: absolute;
	left: calc(76px / ${ratio});
	bottom: calc(238px / ${ratio});
	font: calc(64px / ${ratio}) 'ocra10';
`;

const ExpiryDate = styled.div`
	position: absolute;
	left: calc(66px / ${ratio});
	bottom: calc(73px / ${ratio});
	font: calc(54px / ${ratio}) 'ocra10';
`;

const Rlogo = styled.img`
	position: absolute;
	right: calc(66px / ${ratio});
	top: calc(62px / ${ratio});
	height: calc(71px / ${ratio});
`;

const Brand = styled.img<Pick<ICard, 'brand'>>`
	position: absolute;
	right: calc(66px / ${ratio});
	bottom: calc(29px / ${ratio});
	
	${props => props.brand === 'VISA' && css`
		height: calc(70px / ${ratio});
		width: calc(216px / ${ratio});
	`}
	
	${props => props.brand === 'MASTERCARD' && css`
		height: calc(143px / ${ratio});
		width: calc(183px / ${ratio});
		right: calc(60px / ${ratio});
		bottom: calc(44px / ${ratio});
	`}
`;

const brandLogo = (brand: ICard['brand']) => {
  if (brand === 'VISA')
    return visaLogo;
  if (brand === 'MASTERCARD')
    return mcLogo;
};

export const Card = ({ expiryDate, lastFour, brand, design, disposable, virtual, state, label }: ICard) =>
  <StyledCard design={design} state={state}>
    <Type>
      {disposable && 'disposable'} {virtual && 'virtual'}
      {design.includes('METAL') && 'metal'}
    </Type>
    <Label>{label}</Label>
    <Rlogo />
    <Number>**** **** **** {lastFour}</Number>
    <ExpiryDate>{expiryDate.substr(5, 2)}/{expiryDate.substr(2, 2)}</ExpiryDate>
    <Brand src={brandLogo(brand)} brand={brand} />
    <Rlogo src={rLogo} />
  </StyledCard>;
