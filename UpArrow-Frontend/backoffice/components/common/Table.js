import styled from "@emotion/styled";
import { Body14Medium, HeadH5Bold } from "../../../styles/typography";
import color from "../../../styles/color";

const Table = ({ columns, datas, gridTemplateColumns, onEdit, onDelete }) => {
  return (
    <TableBlock gridTemplateColumns={gridTemplateColumns}>
      {columns.map((column, idx) => (
        <div className="table-column" key={idx}>
          {column}
        </div>
      ))}
      <div></div>
      {datas.map((data, idx1) => {
        return (
          <>
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
          </>
        );
      })}
    </TableBlock>
  );
};

export default Table;

const TableBlock = styled.div`
  display: grid;
  grid-template-columns: ${({ gridTemplateColumns }) =>
      gridTemplateColumns.join(" ")} 14.8rem;
  column-gap: 1.6rem;
  row-gap: 1.6rem;

  .table-column {
    ${Body14Medium}
    color: ${color.B40};
    padding: 1.6rem 0;
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
