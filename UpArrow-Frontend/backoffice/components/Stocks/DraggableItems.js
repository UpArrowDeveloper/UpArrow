// Growth Opportunities
//onDragEndForOppertunity
// setGrowthOppertunities

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

// setGrowthOppertunity
const flexColumn = { display: "flex", flexDirection: "column" };

const DraggableItems = ({
  title,
  onDragEnd,
  datas,
  setDatas,
  data,
  setData,
}) => {
  return (
    <>
      <h6 className="mb-8">{title}</h6>
      <div className="mb-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={title}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {datas.map((e, index) => (
                  <Draggable
                    key={e.summary}
                    draggableId={e.summary}
                    index={index}
                  >
                    {(provided2, snapshot) => (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                        }}
                        ref={provided2.innerRef}
                        className="oppertunity-style"
                        {...provided2.draggableProps}
                        {...provided2.dragHandleProps}
                      >
                        <Input
                          wrapperStyle={{ width: "30%" }}
                          value={e.summary}
                        />
                        <Input
                          wrapperStyle={{ width: "60%" }}
                          value={e.detail}
                        />
                        <Button
                          theme="danger"
                          onClick={() =>
                            setDatas((s) =>
                              s.filter((v) => v.summary !== e.summary)
                            )
                          }
                        >
                          DELETE
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div style={{ display: "flex", margin: "2.0rem 0", gap: "0.8rem" }}>
        <Input
          wrapperStyle={{ width: "30%" }}
          label=""
          className="mb-16"
          placeholder="Write Summary"
          value={data.summary}
          onChange={(e) =>
            setData((s) => ({
              ...s,
              summary: e.target.value,
            }))
          }
        />
        <Input
          wrapperStyle={{ width: "60%" }}
          label=""
          className="mb-16"
          placeholder="Write Somethings"
          value={data.detail}
          onChange={(e) =>
            setData((s) => ({
              ...s,
              detail: e.target.value,
            }))
          }
        />
        <Button
          theme="secondary"
          onClick={() => {
            setDatas((s) => [...s, data]);
            setData({ summary: "", detail: "" });
          }}
        >
          ADD
        </Button>
      </div>
    </>
  );
};

export default DraggableItems;
