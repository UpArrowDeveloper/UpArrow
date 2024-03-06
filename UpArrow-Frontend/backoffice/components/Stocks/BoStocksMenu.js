import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FilePreview from "../../../components/common/FilePreview";
import axios from "axios";
import { env } from "../../../config";
import { useRouter } from "next/router";
import { FileUploader } from "../common/FileUploader";
import styled from "@emotion/styled";
import {
  Body12Medium,
  Body16Regular,
  HeadH3Bold,
  HeadH5Bold,
  HeadH6Bold,
} from "../../../styles/typography";
import color from "../../../styles/color";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Divider from "../../../components/Divider";
import Textarea from "../../../components/common/Textarea";
import { TrashIcon } from "../../../components/icons";
import DraggableItems from "./DraggableItems";

export const BoStocksMenu = ({ stock, analysis }) => {
  const isEdit = !!stock;
  const [name, setName] = useState(stock?.name || "");
  const [ticker, setTicker] = useState(stock?.ticker || "");
  const [currentPrice, setCurrentPrice] = useState(stock?.currentPrice);
  const [marketCap, setMarketCap] = useState(stock?.marketCap);
  const [youtubeUrl, setYoutubeUrl] = useState(analysis?.youtubeUrl || "");
  const [youtubeTitle, setYoutubeTitle] = useState(
    analysis?.youtubeTitle || ""
  );
  const [youtubeDate, setYoutubeDate] = useState(analysis?.youtubeDate || "");

  const [giantImage, setGiantImage] = useState();
  const [missionStatement, setMissionStatement] = useState(
    analysis?.missionStatement || ""
  );
  const [businessModel, setBusinessModel] = useState(
    analysis?.businessModel || ""
  );
  const [competitiveAdvantage, setCompetitiveAdvantage] = useState(
    analysis?.competitiveAdvantage || ""
  );

  const [targetPrices, setTargetPrices] = useState(stock?.targetPrices || []);
  const [targetPrice, setTargetPrice] = useState({});

  const [chartName, setChartName] = useState("");
  const [chartValues, setChartValues] = useState([]);
  const [chartValue, setChartValue] = useState({});

  const [opinions, setOpinions] = useState(analysis?.opinions || []);
  const [opinion, setOpinion] = useState({});

  const [financials, setFinancials] = useState(analysis?.financials || []);

  const [strengths, setStrengths] = useState(analysis?.strengths || []);
  const [strength, setStrength] = useState("");
  const [weaknessList, setWeaknessList] = useState(analysis?.weaknesses || []);
  const [weakness, setWeakness] = useState("");
  const [growthOppertunities, setGrowthOppertunities] = useState(
    analysis?.growthOppertunities || []
  );
  const [growthOppertunity, setGrowthOppertunity] = useState("");

  const [potentialRisks, setPotentialRisks] = useState(
    analysis?.potentialRisks || []
  );
  const [potentialRisk, setPotentialRisk] = useState("");

  const [insightOfGiantsUrls, setInsightOfGiantsUrls] = useState(
    analysis?.insightOfGiantsUrls || []
  );
  const [insightOfGiant, setInsightOfGiant] = useState({
    summary: "",
    link: "",
  });

  const [logoImage, setLogoImage] = useState();
  const [backgroundImage, setBackgroundImage] = useState();
  const onDragEndForOppertunity = (result) => {
    if (!result.destination) {
      return;
    }
    setGrowthOppertunities((s) => {
      const newS = [...s];
      newS.splice(
        result.destination.index,
        0,
        newS.splice(result.source.index, 1)[0]
      );
      return newS;
    });
  };
  const onDragEndForPotentialRisks = (result) => {
    if (!result.destination) {
      return;
    }
    setPotentialRisks((s) => {
      const newS = [...s];
      newS.splice(
        result.destination.index,
        0,
        newS.splice(result.source.index, 1)[0]
      );
      return newS;
    });
  };
  const onDragEndForStrength = (result) => {
    if (!result.destination) {
      return;
    }
    setStrengths((s) => {
      const newS = [...s];
      newS.splice(
        result.destination.index,
        0,
        newS.splice(result.source.index, 1)[0]
      );
      return newS;
    });
  };
  const onDragEndForWeakness = (result) => {
    if (!result.destination) {
      return;
    }
    setWeaknessList((s) => {
      const newS = [...s];
      newS.splice(
        result.destination.index,
        0,
        newS.splice(result.source.index, 1)[0]
      );
      return newS;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const ticker = e.target.ticker.value;
    const currentPrice = e.target.currentPrice.value;
    const marketCap = e.target.marketCap.value;

    const missionStatement = e.target.missionStatement.value;
    const businessModel = e.target.businessModel.value;
    const competitiveAdvantage = e.target.competitiveAdvantage.value;
    const newOpinions = [];

    for await (const v of opinions) {
      if (v.authorImageUrl) {
        newOpinions.push(v);
        continue;
      }
      const imageForm = new FormData();
      imageForm.append("image", v.file);
      const { link } = (
        await axios.post(`${env.serverUrl}/file/upload`, imageForm)
      ).data;
      newOpinions.push({ ...v, file: undefined, authorImageUrl: link });
    }

    let logoUrl = "";
    if (logoImage) {
      const logoFormData = new FormData();
      logoFormData.append("image", logoImage);
      const { link } = (
        await axios.post(`${env.serverUrl}/file/upload`, logoFormData)
      ).data;
      logoUrl = link;
    } else if (stock?.logoUrl) {
      logoUrl = stock.logoUrl;
    }

    let backgroundImageUrl = "";
    if (backgroundImage) {
      const backgroundFormData = new FormData();
      backgroundFormData.append("image", backgroundImage);
      const { link } = (
        await axios.post(`${env.serverUrl}/file/upload`, backgroundFormData)
      ).data;
      backgroundImageUrl = link;
    } else if (stock?.backgroundImageUrl) {
      backgroundImageUrl = stock.backgroundImageUrl;
    }

    const splitedVideoUrl = youtubeUrl?.split("=")?.[1] || youtubeUrl;
    const payload = {
      name,
      ticker,
      logoUrl,
      backgroundImageUrl,
      currentPrice,
      targetPrices,
      missionStatement,
      businessModel,
      youtubeUrl: splitedVideoUrl,
      youtubeTitle,
      youtubeDate,
      insightOfGiantsUrls,
      strengths,
      weaknesses: weaknessList,
      competitiveAdvantage,
      growthOppertunities,
      potentialRisks,
      financials,
      ideaIds: stock?.ideaIds || [],
      marketCap,
      opinions: newOpinions,
    };
    if (isEdit) {
      await axios.put(`${env.serverUrl}/stock/${stock._id}`, payload);
    } else {
      await axios.post(`${env.serverUrl}/stock`, payload);
    }
    // no async
    axios.get("/api/revalidate/stock");
    axios.get(`/api/revalidate/stock/${ticker}`);
    axios.get("/api/revalidate");
    axios.get("/api/revalidate/idea");
    axios.get("/api/revalidate/investor");
    window.location.href = "/backoffice/stocks";
  };

  const onDragEndForChart = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = [...financials];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setFinancials(newItems);
  };

  const onDragEndForOpinion = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = [...opinions];
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setOpinions(newItems);
  };

  return (
    <BoStocksMenuBlock>
      <div className="content">
        <form onSubmit={onSubmit}>
          <h1>Add Stocks</h1>
          <h3 className="mb-24">Stock Info</h3>
          <div className="stock-image-inputs mb-24">
            <div>
              <h6 className="mb-8">Stock Image</h6>
              <FileUploader
                name="stockImage"
                file={logoImage}
                url={stock?.logoUrl}
                setImage={setLogoImage}
                previewStyle={{ width: "10.8rem", height: "10.8rem" }}
              />
              <p className="image-info">Image size - 160x160</p>
            </div>
            <div>
              <h6 className="mb-8">Stock Background Image</h6>
              <FileUploader
                name="backgroundImage"
                file={backgroundImage}
                url={stock?.backgroundImageUrl}
                setImage={setBackgroundImage}
                previewStyle={{ width: "49rem", height: "10.8rem" }}
              />
              <p className="image-info">Image size - 1280x214</p>
            </div>
          </div>
          <div className="stock-name-values-wrapper">
            <div>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Stock name"
                className="mb-24"
              />
              <Input
                id="ticker"
                name="ticker"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                label="Tickername"
                className="mb-24"
              />
              <Input
                id="currentPrice"
                name="currentPrice"
                label="Price"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                type="number"
                className="mb-24"
              />
              <Input
                id="marketCap"
                name="marketCap"
                value={marketCap}
                onChange={(e) => setMarketCap(e.target.value)}
                label="Market Cap"
                type="number"
                className="mb-24"
              />
            </div>
            <div>
              <h6 className="mb-8">Target Price</h6>
              <div className="target-prices">
                {targetPrices.map((targetPrice, index) => (
                  <div className="target-price-input-wrapper">
                    <Input
                      value={targetPrice.name}
                      onChange={(e) => {
                        setTargetPrices((s) => {
                          const newTargetPrices = [...s];
                          newTargetPrices[index] = {
                            ...newTargetPrices[index],
                            name: e.target.value,
                          };
                          return newTargetPrices;
                        });
                      }}
                      onCancel={() =>
                        setTargetPrices((s) => {
                          const newTargetPrices = [...s];
                          newTargetPrices[index] = {
                            ...newTargetPrices[index],
                            name: "",
                          };
                          return newTargetPrices;
                        })
                      }
                    />
                    <Input
                      value={targetPrice.price}
                      onChange={(e) => {
                        setTargetPrices((s) => {
                          const newTargetPrices = [...s];
                          newTargetPrices[index] = {
                            ...newTargetPrices[index],
                            price: e.target.value,
                          };
                          return newTargetPrices;
                        });
                      }}
                      onCancel={() =>
                        setTargetPrices((s) => {
                          const newTargetPrices = [...s];
                          newTargetPrices[index] = {
                            ...newTargetPrices[index],
                            price: 0,
                          };
                          return newTargetPrices;
                        })
                      }
                    />
                    <Button
                      className="target-price-button"
                      theme="danger"
                      onClick={() =>
                        setTargetPrices((s) =>
                          s.filter((v) => v.name !== targetPrice.name)
                        )
                      }
                    >
                      DELETE
                    </Button>
                  </div>
                ))}
                <div className="target-price-input-wrapper">
                  <Input
                    id="targetPriceName"
                    name="targetPriceName"
                    placeholder="Institution Name"
                    value={targetPrice.name || ""}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      setTargetPrice((s) => ({ ...s, name: e.target.value }));
                    }}
                  />
                  <Input
                    id="targetPrice"
                    name="targetPrice"
                    value={targetPrice.price}
                    placeholder="Target Price"
                    sx={{ marginLeft: 2 }}
                    type="number"
                    min={0}
                    onChange={(e) => {
                      if (Number(e.target.value) < 0) return;
                      setTargetPrice((s) => ({ ...s, price: e.target.value }));
                    }}
                  />
                  <Button
                    className="target-price-button"
                    theme="secondary"
                    disabled={!targetPrice.name || !targetPrice.price}
                    onClick={() => {
                      setTargetPrices((s) => [...s, { ...targetPrice }]);
                      setTargetPrice({});
                    }}
                  >
                    ADD
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className="analysis-wrapper">
            <h3 className="mb-24">Analysis</h3>
            <Input
              className="mb-16"
              name="youtubeUrl"
              label="UpArrow Analysis Youtube URL (Code)"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <Input
              className="mb-16"
              name="youtubeTitle"
              label=""
              placeholder="Youtube Title"
              value={youtubeTitle}
              onChange={(e) => setYoutubeTitle(e.target.value)}
            />
            <Input
              className="mb-16"
              name="youtubeDate"
              label=""
              placeholder="Youtube Date (ex: 2021. 01. 01)"
              value={youtubeDate}
              onChange={(e) => setYoutubeDate(e.target.value)}
            />
            <h6 className="mb-8">Updates on {name}</h6>
            <div>
              {insightOfGiantsUrls.map((e, index) => (
                <div key={e.summary} style={{ display: "flex", gap: "0.8rem" }}>
                  <Input
                    wrapperStyle={{ width: "40%" }}
                    className="mb-8"
                    value={e.summary}
                    onChange={(event) => {
                      setInsightOfGiantsUrls((s) => {
                        const insightOfGiantsUrls = [...s];
                        insightOfGiantsUrls[index] = {
                          ...insightOfGiantsUrls[index],
                          summary: event.target.value,
                        };
                        return insightOfGiantsUrls;
                      });
                    }}
                  />
                  <Input
                    wrapperStyle={{ width: "60%" }}
                    className="mb-8"
                    value={e.link}
                    onChange={(event) => {
                      setInsightOfGiantsUrls((s) => {
                        const insightOfGiantsUrls = [...s];
                        insightOfGiantsUrls[index] = {
                          ...insightOfGiantsUrls[index],
                          link: event.target.value,
                        };
                        return insightOfGiantsUrls;
                      });
                    }}
                    onClose={() =>
                      setInsightOfGiantsUrls((s) =>
                        s.filter((v) => v.link !== e.link)
                      )
                    }
                    onCancel={() =>
                      setInsightOfGiantsUrls((s) =>
                        s.map((v) => {
                          if (v.link === e.link) {
                            return { summary: "", link: "" };
                          }
                          return v;
                        })
                      )
                    }
                  />
                  <img height="46px" src={e.thumbnailLink} />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.8rem" }}>
              <Input
                wrapperStyle={{ width: "40%" }}
                label=""
                className="mb-16"
                value={insightOfGiant.summary}
                onChange={(e) =>
                  setInsightOfGiant((s) => ({
                    ...s,
                    summary: e.target.value,
                  }))
                }
              />
              <Input
                wrapperStyle={{ width: "60%" }}
                label=""
                className="mb-16"
                value={insightOfGiant.link}
                onChange={(e) =>
                  setInsightOfGiant((s) => ({
                    ...s,
                    link: e.target.value,
                  }))
                }
              />
              <FileUploader
                file={giantImage}
                setImage={setGiantImage}
                name="file-image"
                url="/images/apple.png"
                previewStyle={{ width: "40px", height: "40px" }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  theme="secondary"
                  className="add-btn"
                  type="button"
                  onClick={async () => {
                    const giantFormData = new FormData();
                    if (!giantImage) return alert("Please upload image");
                    giantFormData.append("image", giantImage);
                    const { link } = (
                      await axios.post(
                        `${env.serverUrl}/file/upload`,
                        giantFormData
                      )
                    ).data;
                    setInsightOfGiantsUrls((s) => [
                      ...s,
                      { ...insightOfGiant, thumbnailLink: link },
                    ]);
                    setInsightOfGiant({
                      summary: "",
                      link: "",
                    });
                  }}
                >
                  ADD
                </Button>
              </div>
            </div>
          </div>
          <Divider />
          <Textarea
            className="mb-32"
            id="missionStatement"
            name="missionStatement"
            label="Mission Statement"
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            variant="outlined"
            multiline
            fullWidth
            rows={6}
          />
          <Textarea
            className="mb-32"
            id="businessModel"
            name="businessModel"
            label="Business Model"
            value={businessModel}
            onChange={(e) => setBusinessModel(e.target.value)}
            variant="outlined"
            multiline
            fullWidth
            rows={6}
          />
          <Textarea
            id="competitiveAdvantage"
            name="competitiveAdvantage"
            label="Competitive Advantages"
            variant="outlined"
            value={competitiveAdvantage}
            onChange={(e) => setCompetitiveAdvantage(e.target.value)}
            multiline
            fullWidth
            rows={6}
          />
          <Divider />
          <DraggableItems
            title="Strengths"
            onDragEnd={onDragEndForStrength}
            datas={strengths}
            setDatas={setStrengths}
            data={strength}
            setData={setStrength}
          />
          <DraggableItems
            title="Weakness"
            onDragEnd={onDragEndForWeakness}
            datas={weaknessList}
            setDatas={setWeaknessList}
            data={weakness}
            setData={setWeakness}
          />
          <DraggableItems
            title="Growth Opportunities"
            onDragEnd={onDragEndForOppertunity}
            datas={growthOppertunities}
            setDatas={setGrowthOppertunities}
            data={growthOppertunity}
            setData={setGrowthOppertunity}
          />
          <DraggableItems
            title="Potential Risks"
            onDragEnd={onDragEndForPotentialRisks}
            datas={potentialRisks}
            setDatas={setPotentialRisks}
            data={potentialRisk}
            setData={setPotentialRisk}
          />

          <h3 className="mb-24">Financials</h3>
          <div className="financial mb-48">
            <div className="financial-left">
              <h6 className="mb-8">Add Chart</h6>
              <div className="add-chart">
                <Input
                  value={chartName}
                  placeholder="Chart Name"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setChartName(e.target.value)}
                />
                <Input
                  value={chartValue.year}
                  type="number"
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) return;
                    setChartValue((s) => ({
                      ...s,
                      year: e.target.value,
                    }));
                  }}
                  sx={{ marginLeft: "1rem" }}
                  InputLabelProps={{ shrink: true }}
                />
                <Input
                  value={chartValue.value}
                  sx={{ marginLeft: 2 }}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) return;
                    setChartValue((s) => ({
                      ...s,
                      value: e.target.value,
                    }));
                  }}
                />
                <Button
                  theme="secondary"
                  className="add-btn"
                  component="label"
                  sx={{ marginLeft: 2, marginTop: 2 }}
                  disabled={!chartValue.year || !chartValue.value}
                  onClick={() => {
                    setChartValues((s) => [...s, { ...chartValue }]);
                    setChartValue({});
                  }}
                >
                  ADD
                </Button>
              </div>
              <Divider />
              <h6 className="mb-8">Name : Revenue</h6>
              <div className="chart-value-wrapper">
                {chartValues.map((f) => (
                  <div className="chart-value">
                    <p>
                      year : {f.year} / value : {f.value}
                    </p>
                    <TrashIcon
                      className="trash-icon"
                      onClick={() =>
                        setChartValues((s) =>
                          s.filter(
                            (v) => v.year !== f.year && v.value !== f.value
                          )
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <Button
                className="create-chart"
                variant="contained"
                disabled={!chartName || chartValues.length === 0}
                onClick={() => {
                  if (!chartName) return;
                  setFinancials((s) => [
                    ...s,
                    { name: chartName, chartValues },
                  ]);
                  setChartValues([]);
                  setChartName("");
                }}
              >
                Create Chart {">"}
              </Button>
            </div>
            <div className="financial-right">
              <h6 className="mb-8">Created Chart</h6>
              <DragDropContext onDragEnd={onDragEndForChart}>
                <Droppable droppableId="chart">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="created-chart-wrapper"
                    >
                      {financials.map((cv, index) => (
                        <Draggable
                          index={index}
                          key={cv.name}
                          draggableId={cv.name}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="created-chart"
                            >
                              <div className="created-chart-left">
                                <h6>{cv.name}</h6>
                                {cv.chartValues.map((cvv) =>
                                  JSON.stringify(cvv)
                                )}
                              </div>
                              <TrashIcon
                                onClick={() =>
                                  setFinancials((s) =>
                                    s.filter((v) => v.name !== cv.name)
                                  )
                                }
                              >
                                X
                              </TrashIcon>
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
          </div>
          <h3 className="mb-24">Opinions</h3>
          <div className="opinion-wrapper mb-48">
            <div className="opinion-left">
              <h6 className="mb-8">Profile Image</h6>
              <FileUploader
                className="mb-32"
                name="opinion"
                file={opinion.file}
                onChange={(e) =>
                  setOpinion((s) => ({ ...s, file: e.target.files[0] }))
                }
                previewStyle={{
                  width: "4.8rem",
                  height: "4.8rem",
                  borderRadius: "999rem",
                }}
              />
              <Input
                value={opinion.author || ""}
                label="author"
                variant="outlined"
                sx={{ marginLeft: 2, marginBottom: 2 }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setOpinion((s) => ({ ...s, author: e.target.value }));
                }}
                className="mb-32"
              />
              <Textarea
                value={opinion.message || ""}
                label="message"
                variant="outlined"
                sx={{ marginLeft: 2 }}
                rows={6}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setOpinion((s) => ({ ...s, message: e.target.value }));
                }}
                className="mb-32"
              />
              <Button
                className="add-opinion"
                disabled={!opinion.author || !opinion.message}
                onClick={() => {
                  setOpinions((s) => [...s, { ...opinion }]);
                  setOpinion({});
                }}
              >
                Add
              </Button>
            </div>
            <div className="opinion-right">
              <h6 className="mb-8">Created Opinions</h6>
              <DragDropContext onDragEnd={onDragEndForOpinion}>
                <Droppable droppableId="opinions">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="opinion-block-wrapper"
                    >
                      {opinions.map((cv, index) => (
                        <Draggable
                          index={index}
                          key={cv.author}
                          draggableId={`opinions-${cv.author}`}
                        >
                          {(provided2) => (
                            <div
                              {...provided2.draggableProps}
                              {...provided2.dragHandleProps}
                              ref={provided2.innerRef}
                              className="opinion-block"
                            >
                              <div className="opinion-block-left">
                                <FilePreview
                                  className="opinion-block-image"
                                  file={cv.file}
                                  url={cv.authorImageUrl}
                                />
                                <div>
                                  <h6 clasName="mb-4">{cv.author}</h6>
                                  <p>"{cv.message}"</p>
                                </div>
                              </div>
                              <TrashIcon
                                onClick={() =>
                                  setOpinions((s) =>
                                    s.filter(
                                      (v) =>
                                        v.author !== cv.author ||
                                        v.message !== cv.message
                                    )
                                  )
                                }
                              />
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
          </div>
          <Divider />
          <div className="submit-button-wrapper">
            <Button type="submit" className="submit-button">
              {isEdit ? "Edit" : "Add"} Stocks
            </Button>
          </div>
        </form>
      </div>
    </BoStocksMenuBlock>
  );
};

const BoStocksMenuBlock = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .oppertunity-style {
    width: 100%;
    display: flex;
    padding: 0.6rem 0;
    font-size: 1.4rem;
    gap: 0.8rem;
  }
  .content {
    max-width: 120rem;

    h1 {
      font-family: "Pretendard";
      font-style: normal;
      font-weight: 600;
      font-size: 48px;
      line-height: 58px;
      margin-bottom: 2.4rem;
    }

    h3 {
      ${HeadH3Bold}
    }

    h6 {
      ${HeadH6Bold}
    }

    .mb-48 {
      margin-bottom: 4.8rem;
    }

    .mb-32 {
      margin-bottom: 3.2rem;
    }

    .mb-24 {
      margin-bottom: 2.4rem;
    }

    .mb-16 {
      margin-bottom: 1.6rem;
    }

    .mb-8 {
      margin-bottom: 0.8rem;
    }

    .mb-4 {
      margin-bottom: 0.4rem;
    }
  }

  input {
    height: 4.6rem;
  }

  .stock-image-inputs {
    display: flex;
    gap: 11.6rem;
  }

  .image-info {
    ${Body12Medium}
    color: ${color.B67}
  }

  .stock-name-values-wrapper {
    display: flex;
    gap: 2.4rem;
    & > div {
      flex: 1;
    }
  }

  .target-price-input-wrapper {
    display: flex;
    gap: 0.8rem;
  }

  .target-prices {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .target-price-button {
    width: 9.6rem;
    height: 4.6rem;
  }

  .add-btn {
    align-items: flex-end;
    padding: 1.2rem 1.6rem;
  }

  .add-chart {
    display: flex;
    gap: 0.8rem;
  }

  .financial {
    display: flex;
    gap: 2.4rem;

    &-left {
      flex: 1;
    }
    &-right {
      flex: 1;
    }

    .trash-icon {
      cursor: pointer;
    }

    .chart-value-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .chart-value {
      display: flex;
      justify-content: space-between;
      padding: 1rem 1.2rem;
      border: 0.1rem solid ${color.B80};
      border-radius: 0.8rem;
      ${Body16Regular}
    }

    .create-chart {
      width: 100%;
      margin-top: 2.4rem;
      ${HeadH5Bold}
    }

    .created-chart {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 1.2rem;
      background: rgba(56, 95, 233, 0.05);
      border: 0.1rem solid ${color.UpArrow_Blue};
      border-radius: 0.8rem;

      &-left {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        ${Body16Regular}
      }
    }

    .created-chart-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
  }
  .opinion-wrapper {
    display: flex;
    gap: 2.4rem;

    .opinion-left {
      flex: 1;
    }
    .opinion-right {
      flex: 1;
    }
  }
  .add-opinion {
    width: 100%;
    ${HeadH5Bold}
  }

  .opinion-block-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    .opinion-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(56, 95, 233, 0.05);
      border: 0.1rem solid ${color.UpArrow_Blue};
      border-radius: 0.8rem;
      padding: 0.8rem 1.2rem;

      .opinion-block-left {
        display: flex;
      }

      .opinion-block-image {
        width: 4.8rem;
        height: 4.8rem;
        border-radius: 9999rem;
        margin-right: 1.6rem;
      }
    }
  }

  .submit-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24rem;
    height: 5.6rem;
    ${HeadH5Bold}
  }

  .submit-button-wrapper {
    display: flex;
    justify-content: flex-end;
  }
`;
