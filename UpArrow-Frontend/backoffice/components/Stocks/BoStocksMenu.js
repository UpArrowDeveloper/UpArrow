import React, { useState } from 'react';

import FilePreview from '../../../components/common/FilePreview';
import axios from 'axios';
import { env } from '../../../config';
import { useRouter } from 'next/router';
import { FileUploader } from '../common/FileUploader';
import styled from '@emotion/styled';
import {
  Body12Medium,
  Body16Regular,
  HeadH3Bold,
  HeadH5Bold,
  HeadH6Bold,
} from '../../../styles/typography';
import color from '../../../styles/color';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Divider from '../../../components/Divider';
import Textarea from '../../../components/common/Textarea';
import { TrashIcon } from '../../../components/icons';

const flexColumn = { display: 'flex', flexDirection: 'column' };
export const BoStocksMenu = ({ stock, analysis }) => {
  const isEdit = !!stock;
  const router = useRouter();
  const [name, setName] = useState(stock?.name || '');
  const [ticker, setTicker] = useState(stock?.ticker || '');
  const [currentPrice, setCurrentPrice] = useState(stock?.currentPrice || 0);
  const [marketCap, setMarketCap] = useState(stock?.marketCap || 0);
  const [thumbnailTitle, setThumbnailTitle] = useState(
    analysis?.thumbnailTitle || ''
  );
  const [thumbnailDate, setThumbnailDate] = useState(
    analysis?.thumbnailDate ? new Date(analysis?.thumbnailDate) : undefined
  );

  const [missionStatement, setMissionStatement] = useState(
    analysis?.missionStatement || ''
  );
  const [businessModel, setBusinessModel] = useState(
    analysis?.businessModel || ''
  );
  const [competitiveAdvantage, setCompetitiveAdvantage] = useState(
    analysis?.competitiveAdvantage || ''
  );

  const [targetPrices, setTargetPrices] = useState(stock?.targetPrices || []);
  const [targetPrice, setTargetPrice] = useState({});

  const [chartName, setChartName] = useState('');
  const [chartValues, setChartValues] = useState([]);
  const [chartValue, setChartValue] = useState({});

  const [opinions, setOpinions] = useState(analysis?.opinions || []);
  const [opinion, setOpinion] = useState({});

  const [financials, setFinancials] = useState(analysis?.financials || []);

  const [growthOppertunities, setGrowthOppertunities] = useState(
    analysis?.growthOppertunities || []
  );
  const [growthOppertunity, setGrowthOppertunity] = useState('');

  const [potentialRisks, setPotentialRisks] = useState(
    analysis?.potentialRisks || []
  );
  const [potentialRisk, setPotentialRisk] = useState('');

  const [ideaIds, setIdeaIds] = useState(analysis?.ideaIds || []);
  const [ideaId, setIdeaId] = useState('');

  const [logoImage, setLogoImage] = useState();
  const [backgroundImage, setBackgroundImage] = useState();
  const [thumbnailImage, setThumbnailImage] = useState();

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const ticker = e.target.ticker.value;
    const currentPrice = e.target.currentPrice.value;
    const marketCap = e.target.marketCap.value;

    const thumbnailTitle = e.target.thumbnailTitle.value;
    const thumbnailDate = e.target.thumbnailDate.value;

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
      imageForm.append('image', v.file);
      const { link } = (
        await axios.post(`${env.serverUrl}/file/upload`, imageForm)
      ).data;
      newOpinions.push({ ...v, file: undefined, authorImageUrl: link });
    }

    let logoUrl = '';
    if (logoImage) {
      const logoFormData = new FormData();
      logoFormData.append('image', logoImage);
      const { link } = (
        await axios.post(`${env.serverUrl}/file/upload`, logoFormData)
      ).data;
      logoUrl = link;
    } else if (stock?.logoUrl) {
      logoUrl = stock.logoUrl;
    }

    let backgroundImageUrl = '';
    if (backgroundImage) {
      const backgroundFormData = new FormData();
      backgroundFormData.append('image', backgroundImage);
      const { link } = (
        await axios.post(`${env.serverUrl}/file/upload`, backgroundFormData)
      ).data;
      backgroundImageUrl = link;
    } else if (stock?.backgroundImageUrl) {
      backgroundImageUrl = stock.backgroundImageUrl;
    }

    let thumbnailImageUrl = '';
    if (thumbnailImage) {
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('image', thumbnailImage);
      const { link } = (
        await axios.post(`${env.serverUrl}/file/upload`, thumbnailFormData)
      ).data;
      thumbnailImageUrl = link;
    } else if (analysis?.thumbnailImageUrl) {
      thumbnailImageUrl = analysis.thumbnailImageUrl;
    }

    const payload = {
      name,
      ticker,
      logoUrl,
      backgroundImageUrl,
      currentPrice,
      targetPrices,
      thumbnailImageUrl,
      thumbnailTitle,
      thumbnailDate,
      missionStatement,
      businessModel,
      competitiveAdvantage,
      growthOppertunities,
      potentialRisks,
      financials,
      ideaIds,
      marketCap,
      opinions: newOpinions,
    };
    if (isEdit) {
      await axios.put(`${env.serverUrl}/stock/${stock._id}`, payload);
    } else {
      await axios.post(`${env.serverUrl}/stock`, payload);
    }
    await axios.get('/api/revalidate');
    router.push('/backoffice/stocks');
  };

  return (
    <BoStocksMenuBlock>
      <div className='content'>
        <form onSubmit={onSubmit}>
          <h1>Add Stocks</h1>
          <h3 className='mb-24'>Stock Info</h3>
          <div className='stock-image-inputs mb-24'>
            <div>
              <h6 className='mb-8'>Stock Image</h6>
              <FileUploader
                name='stockImage'
                file={logoImage}
                url={stock?.logoUrl}
                setImage={setLogoImage}
              />
              <p className='image-info'>Image size - 160x160</p>
            </div>
            <div>
              <h6 className='mb-8'>Stock Background Image</h6>
              <FileUploader
                name='backgroundImage'
                file={backgroundImage}
                url={stock?.backgroundImageUrl}
                setImage={setBackgroundImage}
              />
              <p className='image-info'>Image size - 1280x214</p>
            </div>
          </div>
          <div className='stock-name-values-wrapper'>
            <div>
              <Input
                id='name'
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                label='Stock name'
                className='mb-24'
              />
              <Input
                id='ticker'
                name='ticker'
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                label='Tickername'
                className='mb-24'
              />
              <Input
                id='currentPrice'
                name='currentPrice'
                label='Price'
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                type='number'
                className='mb-24'
              />
              <Input
                id='marketCap'
                name='marketCap'
                value={marketCap}
                onChange={(e) => setMarketCap(Number(e.target.value))}
                label='Market Cap'
                type='number'
                className='mb-24'
              />
            </div>
            <div>
              <h6 className='mb-8'>Target Price</h6>
              <div className='target-prices'>
                {targetPrices.map((targetPrice, index) => (
                  <div className='target-price-input-wrapper'>
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
                            name: '',
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
                      className='target-price-button'
                      theme='danger'
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
                <div className='target-price-input-wrapper'>
                  <Input
                    id='targetPriceName'
                    name='targetPriceName'
                    placeholder='Institution Name'
                    value={targetPrice.name || ''}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      setTargetPrice((s) => ({ ...s, name: e.target.value }));
                    }}
                  />
                  <Input
                    id='targetPrice'
                    name='targetPrice'
                    value={targetPrice.price || 0}
                    placeholder='Target Price'
                    sx={{ marginLeft: 2 }}
                    type='number'
                    min={0}
                    onChange={(e) => {
                      if (Number(e.target.value) < 0) return;
                      setTargetPrice((s) => ({ ...s, price: e.target.value }));
                    }}
                  />
                  <Button
                    className='target-price-button'
                    theme='secondary'
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
          <div className='analysis-wrapper'>
            <h3 className='mb-24'>Analysis</h3>
            <Input className='mb-16' label='UpArrow Analysis Youtube URL' />
            <h6 className='mb-8'>Insight of Giants URL</h6>
            <div>
              {ideaIds.map((e) => (
                <Input
                  className='mb-8'
                  value={e}
                  onClose={() => 0}
                  onCancel={() => 0}
                />
              ))}
            </div>
            <Input
              label=''
              className='mb-16'
              value={ideaId}
              onChange={(e) => setIdeaId(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                theme='secondary'
                className='add-btn'
                type='button'
                onClick={() => {
                  setIdeaIds((s) => [...s, ideaId]);
                  setIdeaId('');
                }}
              >
                ADD
              </Button>
            </div>
            {/* <Grid item xs={4}> */}
            {/* <h6>Thumbnail</h6>
              <FileUploader
                name='thumbnailImage'
                file={thumbnailImage}
                url={analysis?.thumbnailImageUrl}
                setImage={setThumbnailImage}
              />
            </Grid>
            <Grid item xs={4}>
              <FormTitle></FormTitle>
              <div style={flexColumn}>
                <TextField
                  id='thumbnailTitle'
                  name='thumbnailTitle'
                  label='thumbnail title'
                  value={thumbnailTitle}
                  onChange={(e) => setThumbnailTitle(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant='standard'
                  sx={{ marginLeft: 2, marginBottom: 4 }}
                />
                <TextField
                  id='thumbnailDate'
                  name='thumbnailDate'
                  label='thumbnail date'
                  value={getYMD(thumbnailDate || new Date())}
                  onChange={(e) => setThumbnailDate(new Date(e.target.value))}
                  variant='outlined'
                  type='date'
                  InputLabelProps={{ shrink: true }}
                  sx={{ marginLeft: 2 }}
                />
              </div>
            </Grid> */}
          </div>

          <Divider />
          <Textarea
            className='mb-32'
            id='missionStatement'
            name='missionStatement'
            label='Mission Statement'
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
          <Textarea
            className='mb-32'
            id='businessModel'
            name='businessModel'
            label='Business Model'
            value={businessModel}
            onChange={(e) => setBusinessModel(e.target.value)}
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
          <Textarea
            id='competitiveAdvantage'
            name='competitiveAdvantage'
            label='Competitive Advantages'
            variant='outlined'
            value={competitiveAdvantage}
            onChange={(e) => setCompetitiveAdvantage(e.target.value)}
            multiline
            fullWidth
            rows={6}
          />
          <Divider />
          <h6 className='mb-8'>Growth Opportunities</h6>
          <div className='mb-8'>
            {growthOppertunities.map((e) => (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  padding: '0.6rem 0',
                  fontSize: '1.4rem',
                  gap: '0.8rem',
                }}
              >
                <Input style={{ flex: 1 }} value={e} />
                <Button
                  theme='danger'
                  onClick={() =>
                    setGrowthOppertunities((s) => s.filter((v) => v !== e))
                  }
                >
                  DELETE
                </Button>
              </div>
            ))}
          </div>
          <div style={flexColumn}>
            <Input
              label=''
              className='mb-16'
              placeholder='Write Something'
              value={growthOppertunity}
              onChange={(e) => setGrowthOppertunity(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                theme='secondary'
                className='add-btn'
                onClick={() => {
                  setGrowthOppertunities((s) => [...s, growthOppertunity]);
                  setGrowthOppertunity('');
                }}
              >
                ADD
              </Button>
            </div>
          </div>
          <h6 className='mb-8'>Potential Risks</h6>
          <div className='mb-8'>
            {potentialRisks.map((e) => (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  padding: '0.6rem 0',
                  fontSize: '1.4rem',
                  gap: '0.8rem',
                }}
              >
                <Input style={{ flex: 1 }} value={e} />
                <Button
                  theme='danger'
                  onClick={() =>
                    setPotentialRisks((s) => s.filter((v) => v !== e))
                  }
                >
                  DELETE
                </Button>
              </div>
            ))}
          </div>
          <div style={flexColumn}>
            <Input
              label=''
              className='mb-16'
              placeholder='Write Something'
              value={potentialRisk}
              onChange={(e) => setPotentialRisk(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                theme='secondary'
                className='add-btn'
                onClick={() => {
                  setPotentialRisks((s) => [...s, potentialRisk]);
                  setPotentialRisk('');
                }}
              >
                ADD
              </Button>
            </div>
          </div>
          <h3 className='mb-24'>Financials</h3>
          <div className='financial mb-48'>
            <div className='financial-left'>
              <h6 className='mb-8'>Add Chart</h6>
              <div className='add-chart'>
                <Input
                  value={chartName}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setChartName(e.target.value)}
                />
                <Input
                  value={chartValue.year || 0}
                  type='number'
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) return;
                    setChartValue((s) => ({
                      ...s,
                      year: Number(e.target.value),
                    }));
                  }}
                  sx={{ marginLeft: '1rem' }}
                  InputLabelProps={{ shrink: true }}
                />
                <Input
                  value={chartValue.value || 0}
                  sx={{ marginLeft: 2 }}
                  InputLabelProps={{ shrink: true }}
                  type='number'
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) return;
                    setChartValue((s) => ({
                      ...s,
                      value: Number(e.target.value),
                    }));
                  }}
                />
                <Button
                  theme='secondary'
                  className='add-btn'
                  component='label'
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
              <h6 className='mb-8'>Name : Revenue</h6>
              <div className='chart-value-wrapper'>
                {chartValues.map((f) => (
                  <div className='chart-value'>
                    <p>
                      year : {f.year} / value : {f.value}
                    </p>
                    <TrashIcon
                      className='trash-icon'
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
                className='create-chart'
                variant='contained'
                disabled={!chartName || chartValues.length === 0}
                onClick={() => {
                  if (!chartName) return;
                  setFinancials((s) => [
                    ...s,
                    { name: chartName, chartValues },
                  ]);
                  setChartValues([]);
                  setChartName('');
                }}
              >
                Create Chart {'>'}
              </Button>
            </div>
            <div className='financial-right'>
              <h6 className='mb-8'>Created Chart</h6>
              <div className='created-chart-wrapper'>
                {financials.map((cv) => (
                  <div className='created-chart'>
                    <div className='created-chart-left'>
                      <h6>{cv.name}</h6>
                      {cv.chartValues.map((cvv) => JSON.stringify(cvv))}
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
                ))}
              </div>
            </div>
          </div>

          <h3 className='mb-24'>Opinions</h3>
          <div className='opinion-wrapper mb-48'>
            <div className='opinion-left'>
              <h6 className='mb-8'>Profile Image</h6>
              <FileUploader
                className='mb-32'
                name='opinion'
                onChange={(e) =>
                  setOpinion((s) => ({ ...s, file: e.target.files[0] }))
                }
              />
              <Input
                value={opinion.author || ''}
                label='author'
                variant='outlined'
                sx={{ marginLeft: 2, marginBottom: 2 }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setOpinion((s) => ({ ...s, author: e.target.value }));
                }}
                className='mb-32'
              />
              <Textarea
                value={opinion.message || ''}
                label='message'
                variant='outlined'
                sx={{ marginLeft: 2 }}
                rows={6}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  setOpinion((s) => ({ ...s, message: e.target.value }));
                }}
                className='mb-32'
              />
              <Button
                className='add-opinion'
                disabled={!opinion.author || !opinion.message}
                onClick={() => {
                  setOpinions((s) => [...s, { ...opinion }]);
                  setOpinion({});
                }}
              >
                Add
              </Button>
            </div>
            <div className='opinion-right'>
              <h6 className='mb-8'>Created Opinions</h6>
              <div className='opinion-block-wrapper'>
                {opinions.map((cv) => (
                  <div className='opinion-block'>
                    <div className='opinion-block-left'>
                      <FilePreview
                        className='opinion-block-image'
                        file={cv.file}
                        url={cv.authorImageUrl}
                      />
                      <div>
                        <h6 clasName='mb-4'>{cv.author}</h6>
                        <p>"{cv.message}"</p>
                      </div>
                    </div>
                    <TrashIcon
                      onClick={() =>
                        setOpinions((s) =>
                          s.filter(
                            (v) =>
                              v.author !== cv.author || v.message !== cv.message
                          )
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Divider />
          <div className='submit-button-wrapper'>
            <Button type='submit' className='submit-button'>
              {isEdit ? 'Edit' : 'Add'} Stocks
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

  .content {
    max-width: 120rem;

    h1 {
      font-family: 'Pretendard';
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
