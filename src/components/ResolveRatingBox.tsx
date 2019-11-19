import styled from "styled-components";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import starOutline from "../assets/chat/star_outline.svg";
import starSolid from "../assets/chat/star_solid.svg";

const ResolveContainer = styled.div`
  background-color: #f3f4f5;
  padding: 1rem;
	border-radius: 1rem;
	align-self: flex-start;
	display: flex;
	flex-direction: row-reverse;
	
	img:hover,
  img:hover ~ img {
    background: url(${starSolid});
  }
`;

const Star = styled.img`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  margin: 0 .5rem;
`;

export const ResolveRatingBox = () => {
  const { rateTicket } = useContext(UserContext);

  return <ResolveContainer>
    {[5, 4, 3, 2, 1].map(e => <Star key={e} src={starOutline} onClick={() => rateTicket(e)} />)}
  </ResolveContainer>;
};
