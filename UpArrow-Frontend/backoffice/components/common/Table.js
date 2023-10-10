import styled from "@emotion/styled";
import { Body14Medium, HeadH5Bold } from "../../../styles/typography";
import color from "../../../styles/color";

const Table = ({ columns, datas, gridTemplateColumns, onEdit, onDelete }) => {
  return (
    <TableBlock gridTemplateColumns={gridTemplateColumns}>
      <div className="table-columns">
        {columns.map((column, idx) => (
          <div className="table-column" key={idx}>
            {column}
          </div>
        ))}
      </div>
      <div></div>
      {datas.map((data, idx1) => {
        return (
          <div className="table-item">
            {data.items.map((v, idx2) => {
              if (idx2 === 0) {
                return <img className="thumbnail" src={v} />;
              }
              return (
                <div
                  className="table-text-item"
                  key={idx1 * data.length + idx2}
                >
                  {v}
                </div>
              );
            })}
            <div className="button-wrapper">
              {onEdit && <button onClick={() => onEdit(data.id)}>수정</button>}
              {onDelete && (
                <button
                  className="delete"
                  onClick={() => {
                    onDelete(data.id);
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        );
      })}
    </TableBlock>
  );
};

export default Table;

const TableBlock = styled.div`
  display: flex;
  flex-direction: column;

  .table-column {
    ${Body14Medium}
    color: ${color.B40};
    padding: 1.6rem 0;
  }
  .table-columns {
    display: grid;
    grid-template-columns: ${({ gridTemplateColumns }) =>
        gridTemplateColumns.join(" ")} 14.8rem;
    column-gap: 1.6rem;
    row-gap: 1.6rem;
    border-bottom: 0.1rem solid rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  .table-item {
    display: grid;
    grid-template-columns: ${({ gridTemplateColumns }) =>
        gridTemplateColumns.join(" ")} 14.8rem;
    column-gap: 1.6rem;
    row-gap: 1.6rem;
    border-bottom: 0.1rem solid rgba(0, 0, 0, 0.1);
    padding: 0 0.8rem 1.2rem 0.8rem;
    margin-bottom: 2rem;
  }

  .table-text-item {
    display: flex;
    align-items: center;
    ${HeadH5Bold}
  }

  .button-wrapper {
    display: flex;
    justify-content: flex-end;
    gap: 1.6rem;

    button {
      width: 6.6rem;
      height: 4.8rem;
      background-color: white;
      border-radius: 0.8rem;
      ${HeadH5Bold}
      :hover {
        cursor: pointer;
      }

      &.delete {
        color: ${color.DISAGREE_RED};
        border: 1px solid ${color.DISAGREE_RED};
      }
    }
  }

  .thumbnail {
    width: 5.6rem;
    height: 5.6rem;
    object-fit: cover;
  }
`;
