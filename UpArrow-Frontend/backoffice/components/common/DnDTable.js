import styled from "@emotion/styled";
import { Body14Medium, HeadH5Bold } from "../../../styles/typography";
import color from "../../../styles/color";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

const DndTable = ({
  columns,
  datas,
  gridTemplateColumns,
  onEdit,
  onDelete,
  onDragEnd,
}) => {
  console.log("datas : ", datas);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <DndTableBlock gridTemplateColumns={gridTemplateColumns}>
              <div className="dnd-columns">
                {columns.map((column, idx) => (
                  <div className="table-column" key={idx}>
                    {column}
                  </div>
                ))}
              </div>
              <div></div>
              {datas.map((item, index) => {
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className="dnd-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.items.map((v, idx2) => {
                          if (idx2 === 0) {
                            return <img className="thumbnail" src={v} />;
                          }
                          return (
                            <div
                              className="table-text-item"
                              key={index * v.length + idx2}
                            >
                              {v}
                            </div>
                          );
                        })}
                        <div className="button-wrapper">
                          {onEdit && (
                            <button onClick={() => onEdit(item.id)}>
                              수정
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="delete"
                              onClick={() => {
                                onDelete(item.id);
                              }}
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </DndTableBlock>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DndTable;

const DndTableBlock = styled.div`
  display: flex;
  flex-direction: column;

  .dnd-columns {
    display: grid;
    grid-template-columns: ${({ gridTemplateColumns }) =>
        gridTemplateColumns.join(" ")} 14.8rem;
    column-gap: 1.6rem;
    row-gap: 1.6rem;
    border-bottom: 0.1rem solid rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .dnd-item {
    display: grid;
    grid-template-columns: ${({ gridTemplateColumns }) =>
        gridTemplateColumns.join(" ")} 14.8rem;
    column-gap: 1.6rem;
    row-gap: 1.6rem;
    border-bottom: 0.1rem solid rgba(0, 0, 0, 0.1);
    padding: 0 0.8rem 1.2rem 0.8rem;
    margin-bottom: 2rem;
  }

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
