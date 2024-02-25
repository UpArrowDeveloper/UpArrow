import styled from "@emotion/styled";
import React from "react";
import { Body16Regular, HeadH6Bold } from "../../styles/typography";
import { TrashIcon, FillXIcon } from "../icons";

export default function Input({
  className,
  label,
  onCancel,
  onClose,
  ...props
}) {
  return (
    <InputBlock style={props.wrapperStyle}>
      {!!label && <label htmlFor={props.id}>{label}</label>}
      <div className="input-wrapper">
        <input className={`${className || ""}`} {...props} />
        {onCancel && (
          <FillXIcon
            className={`fill-icon ${!!onClose ? "trash-exist" : ""}`}
            onClick={() => onCancel()}
          />
        )}
        {onClose && (
          <TrashIcon className="trash-icon" onClick={() => onClose()} />
        )}
      </div>
    </InputBlock>
  );
}

const InputBlock = styled.div`
  & > label {
    display: block;
    margin-bottom: 0.8rem;
    font-weight: bold;
    ${HeadH6Bold}
  }

  .input-wrapper {
    position: relative;

    .fill-icon {
      cursor: pointer;
      position: absolute;
      right: 1.4rem;
      top: calc(50% - 1rem);

      &.trash-exist {
        right: 5.2rem;
      }
    }

    .trash-icon {
      cursor: pointer;
      position: absolute;
      right: 1.4rem;
      top: calc(50% - 1.2rem);
    }
  }

  & > div > input {
    width: 100%;
    padding: 1.2rem 1.6rem;
    background: rgba(0 0 0 / 4%);
    border: 0.1rem solid rgba(0 0 0 / 10%);
    border-radius: 0.8rem;
    &::placeholder {
      ${Body16Regular}
    }
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
