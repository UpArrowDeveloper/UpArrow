import styled from "@emotion/styled";
import color from "../../styles/color";
import { Body16Regular } from "../../styles/typography";
import { XIcon } from "../icons";
import { mobileWidth } from "../../styles/responsive";

const SearchInput = ({
  value,
  setValue,
  searchResult,
  clean,
  className,
  onSelect,
}) => {
  return (
    <SearchInputBlock className={className} hidden={searchResult.length === 0}>
      <div className="input-wrapper">
        <input value={value} onChange={(e) => setValue(e.target.value)} />
        <XIcon className="x-icon" onClick={() => clean()} />
      </div>
      <div className={`result-wrapper`}>
        {searchResult.map((stock) => {
          return (
            <div
              className="item"
              key={stock._id}
              onClick={() => {
                onSelect(stock);
              }}
            >
              {stock.name}
            </div>
          );
        })}
      </div>
    </SearchInputBlock>
  );
};

const SearchInputBlock = styled.div`
  display: flex;
  flex-direction: column;
  width: 12rem;
  border: 0.1rem solid ${color.B80};

  ${({ hidden }) => {
    return !hidden
      ? "padding-bottom: 0.8rem; border-radius: 1.6rem;"
      : "border-radius: 999rem";
  }};

  .input-wrapper {
    padding: 0.72rem 1.2rem 0.72rem 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    & > input {
      width: 6rem;
      height: 2.2rem;
      border: none;
      ${Body16Regular}

      &:focus {
        outline: none;
      }
    }

    .x-icon {
      cursor: pointer;
    }

    ${({ hidden }) => {
      return !hidden
        ? `border-bottom: 0.1rem solid ${color.B80}; margin-bottom: 0.4rem;`
        : "";
    }};
  }

  .result-wrapper {
    ${Body16Regular}

    .item {
      padding: 0.8rem 2rem;
      cursor: pointer;
      &:hover {
        background-color: rgba(0 0 0 / 1%);
      }
    }
    &.hidden {
      display: none;
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    .input-wrapper {
      height: 100%;
    }
  }
`;

export default SearchInput;
