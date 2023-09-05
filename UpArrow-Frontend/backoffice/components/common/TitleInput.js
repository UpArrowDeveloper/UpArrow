import styled from "@emotion/styled";
import { HeadH6Bold } from "../../../styles/typography";

const TitleInput = ({ title, value, onChange, placeHolder, style }) => {
  return (
    <TitleInputBlock style={style}>
      <div className="title">{title}</div>
      <input value={value} onChange={onChange} placeholder={placeHolder} />
    </TitleInputBlock>
  );
};

export default TitleInput;

const TitleInputBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2.4rem;

  .title {
    ${HeadH6Bold}
  }

  input {
    background-color: rgba(0, 0, 0, 0.04);
    padding: 1.2rem 1.6rem;
    border-radius: 0.8rem;
    border: 0.1rem solid rgba(0, 0, 0, 0.1);
  }
`;
