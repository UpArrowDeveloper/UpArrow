import styled from '@emotion/styled';
import React from 'react';
import { Body16Regular, HeadH6Bold } from '../../styles/typography';

export default function Textarea({ className, label, ...props }) {
  return (
    <TextareaBlock>
      {!!label && <label htmlFor={props.id}>{label}</label>}
      <textarea className={`${className || ''}`} {...props} />
    </TextareaBlock>
  );
}

const TextareaBlock = styled.div`
  & > label {
    display: block;
    margin-bottom: 0.8rem;
    font-weight: bold;
    ${HeadH6Bold}
  }
  & > textarea {
    width: 100%;
    padding: 1.2rem 1.6rem;
    background: rgba(0 0 0 / 4%);
    border: 0.1rem solid rgba(0 0 0 / 10%);
    border-radius: 0.8rem;
    &::placeholder {
      ${Body16Regular}
    }
    resize: none;
  }
`;
