import styled from "@emotion/styled";

const Table = ({ columns, datas, gridTemplateColumns }) => {
  console.log("datas : ", datas);
  return (
    <TableBlock gridTemplateColumns={gridTemplateColumns}>
      {columns.map((column, idx) => (
        <div key={idx}>{column}</div>
      ))}
      <div></div>
      {datas.map((data, idx1) => {
        return (
          <>
            {data.map((v, idx2) => {
              if (idx2 === 0) {
                return <img className="thumbnail" src={v} />;
              }
              return <div key={idx1 * data.length + idx2}>{v}</div>;
            })}
            <div className="button-wrapper">
              <button>수정</button>
              <button>삭제</button>
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
      gridTemplateColumns.join(" ")} 7rem;

  .button-wrapper {
    display: flex;
    justify-content: space-between;
  }

  .thumbnail {
    width: 5.6rem;
    height: 5.6rem;
    object-fit: cover;
  }
`;
