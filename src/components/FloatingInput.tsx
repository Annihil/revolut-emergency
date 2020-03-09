import React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.div`
  position: relative;
  margin: .67rem 0;
`;

export const Input = styled.input<{ width?: string, code?: boolean, rows?: number }>`
  font-size: 1rem;
  width: ${props => props.width || '20rem'};
  outline: none;
  padding: .5rem 0;
  border-color: #ced5db;
  border-width: 0 0 1px 0;
  resize: none;
  
  ${props => props.code ? css`letter-spacing: .25rem;` : ''}
`;

const labelFocusStyle = css`
  top: -1rem;
  font-size: .8rem;
  opacity: .8;
  color: #0075eb;
`;

const Label = styled.label<{ focus: boolean, invalid: boolean }>`
  position: absolute;
  pointer-events: none;
  left: 0;
  top: .5rem;
  transition: .2s ease all;
  color: #8b959e;

  ${Input}:focus ~ & {
    ${labelFocusStyle}
  }
  
  ${props => props.focus ? labelFocusStyle : ''}
  
  ${props => props.invalid ? css`
    color: #8b959e !important;
  ` : ''}
`;

const Line = styled.div<{ invalid: boolean }>`
  position: absolute;
  bottom: 0;
  height: 2px;
  width: 100%;
  background: #0075eb;
  transform-origin: left bottom;
  transform: scale(0);
  transition: transform 450ms cubic-bezier(.23, 1, .32, 1), background 450ms cubic-bezier(.23, 1, .32, 1);
  
  ${Input}:focus ~ & {
    transform: scale(1);
  }
  
  ${props => props.invalid ? css`
    background-color: #f44336;
    transform: scale(1);
  ` : ''}
`;

interface Props {
  value: string | undefined
  label: string
  rows?: number
  invalid: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  width?: string
  required?: boolean
  code?: boolean
  type?: string
  pattern?: string
  maxLength?: number
}

export const FloatingInput = ({ value, label, rows, invalid, ...rest }: Props) =>
  <Container>
    <Input rows={rows} value={value} {...rest} />
    <Label invalid={invalid} focus={value !== ''}>{label}</Label>
    <Line invalid={invalid} />
  </Container>;
