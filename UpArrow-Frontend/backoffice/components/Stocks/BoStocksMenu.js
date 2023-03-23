import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import FilePreview from '../../../components/common/FilePreview';
import axios from 'axios';
import { env } from '../../../config';
import { useRouter } from 'next/router';
import { getYMD } from '../../../utils/date';
import { FileUploader } from '../common/FileUploader';
import { FormTitle } from '../common/FormTitle';

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
    router.push('/backoffice/stocks');
  };

  return (
    <form onSubmit={onSubmit}>
      <Typography variant='h2' sx={{ fontWeight: 'bold' }}>
        Stock
      </Typography>
      <FormTitle>Add Stock</FormTitle>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id='name'
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            label='stock name'
            fullWidth
            variant='standard'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id='ticker'
            name='ticker'
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            label='ticker'
            fullWidth
            InputLabelProps={{ shrink: true }}
            autoComplete='family-name'
            variant='outlined'
          />
        </Grid>
        <Divider sx={{ width: '100%', mt: 4 }} variant='middle' />
        <Grid item xs={6}>
          <FormTitle>Stock Image</FormTitle>
          <FileUploader
            name='stockImage'
            file={logoImage}
            url={stock?.logoUrl}
            setImage={setLogoImage}
          />
        </Grid>
        <Grid item xs={6}>
          <FormTitle>Stock Background Image</FormTitle>
          <FileUploader
            name='backgroundImage'
            file={backgroundImage}
            url={stock?.backgroundImageUrl}
            setImage={setBackgroundImage}
          />
        </Grid>
        <Divider sx={{ width: '100%', mt: 4 }} variant='middle' />
        <Grid item xs={12}>
          <FormTitle>Price</FormTitle>
          <TextField
            id='currentPrice'
            name='currentPrice'
            label='current price'
            value={currentPrice}
            onChange={(e) => setCurrentPrice(Number(e.target.value))}
            variant='standard'
            type='number'
          />
          <FormTitle>Target Prices</FormTitle>
          <TextField
            id='targetPriceName'
            name='targetPriceName'
            label='Name'
            variant='standard'
            value={targetPrice.name || ''}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {
              setTargetPrice((s) => ({ ...s, name: e.target.value }));
            }}
          />
          <TextField
            id='targetPrice'
            name='targetPrice'
            value={targetPrice.price || 0}
            label='Target Price'
            variant='standard'
            sx={{ marginLeft: 2 }}
            type='number'
            min={0}
            onChange={(e) => {
              if (Number(e.target.value) < 0) return;
              setTargetPrice((s) => ({ ...s, price: e.target.value }));
            }}
          />
          <Button
            variant='contained'
            component='label'
            sx={{ marginLeft: 2, marginTop: 2 }}
            disabled={!targetPrice.name || !targetPrice.price}
            onClick={() => {
              setTargetPrices((s) => [...s, { ...targetPrice }]);
              setTargetPrice({});
            }}
          >
            Add
          </Button>
          {targetPrices.map((targetPrice) => (
            <div>
              <span style={{ paddingRight: '11rem' }}>{targetPrice.name}</span>
              <span style={{ paddingRight: '10rem' }}>{targetPrice.price}</span>
              <Button
                size='large'
                onClick={() =>
                  setTargetPrices((s) =>
                    s.filter((v) => v.name !== targetPrice.name)
                  )
                }
              >
                X
              </Button>
            </div>
          ))}

          <FormTitle>Market Cap</FormTitle>
          <TextField
            id='marketCap'
            name='marketCap'
            value={marketCap}
            onChange={(e) => setMarketCap(Number(e.target.value))}
            InputLabelProps={{ shrink: true }}
            label='market cap'
            type='number'
            variant='standard'
          />
        </Grid>
        <Divider sx={{ width: '100%', mt: 4 }} variant='middle' />
        <Grid item xs={12}>
          <Typography variant='h2' sx={{ fontWeight: 'bold' }} gutterBottom>
            Analyses
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <FormTitle>Thumbnail</FormTitle>
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
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <FormTitle>Insights of Giants</FormTitle>
          <div style={flexColumn}>
            <TextField
              label='idea id'
              variant='outlined'
              value={ideaId}
              onChange={(e) => setIdeaId(e.target.value)}
            />
            <Button
              variant='contained'
              onClick={() => {
                setIdeaIds((s) => [...s, ideaId]);
                setIdeaId('');
              }}
            >
              Add
            </Button>
          </div>
        </Grid>
        <Grid item xs={8}>
          <div>
            {ideaIds.map((e) => (
              <div>
                {e}
                <Button
                  onClick={() => setIdeaIds((s) => s.filter((v) => v !== e))}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={4}>
          <FormTitle>Mission Statement</FormTitle>
          <TextField
            id='missionStatement'
            name='missionStatement'
            label='missionStatement'
            value={missionStatement}
            onChange={(e) => setMissionStatement(e.target.value)}
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
        </Grid>
        <Grid item xs={4}>
          <FormTitle>Business Model</FormTitle>
          <TextField
            id='businessModel'
            name='businessModel'
            label='businessModel'
            value={businessModel}
            onChange={(e) => setBusinessModel(e.target.value)}
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
        </Grid>
        <Grid item xs={4}>
          <FormTitle>Competitive Advantages</FormTitle>
          <TextField
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
        </Grid>
        <Grid item xs={4}>
          <FormTitle>Growth Opportunities</FormTitle>
          <div style={flexColumn}>
            <TextField
              label='Growth Opportunities'
              variant='outlined'
              value={growthOppertunity}
              onChange={(e) => setGrowthOppertunity(e.target.value)}
            />
            <Button
              variant='contained'
              onClick={() => {
                setGrowthOppertunities((s) => [...s, growthOppertunity]);
                setGrowthOppertunity('');
              }}
            >
              Add
            </Button>
          </div>
          <div>
            {growthOppertunities.map((e) => (
              <div style={{ padding: '0.6rem', fontSize: '1.4rem' }}>
                {e}
                <Button
                  size='large'
                  onClick={() =>
                    setGrowthOppertunities((s) => s.filter((v) => v !== e))
                  }
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={4}>
          <FormTitle>Potential Risks</FormTitle>
          <div style={flexColumn}>
            <TextField
              label='Potential Risks'
              variant='outlined'
              value={potentialRisk}
              onChange={(e) => setPotentialRisk(e.target.value)}
            />
            <Button
              variant='contained'
              onClick={() => {
                setPotentialRisks((s) => [...s, potentialRisk]);
                setPotentialRisk('');
              }}
            >
              Add
            </Button>
          </div>
          <div>
            {potentialRisks.map((e) => (
              <div style={{ padding: '0.6rem', fontSize: '1.4rem' }}>
                {e}
                <Button
                  size='large'
                  onClick={() =>
                    setPotentialRisks((s) => s.filter((v) => v !== e))
                  }
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={8}>
          <FormTitle>Financials</FormTitle>
          <TextField
            label='name'
            variant='standard'
            value={chartName}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setChartName(e.target.value)}
          />
          <TextField
            label='year'
            variant='standard'
            value={chartValue.year || 0}
            type='number'
            onChange={(e) => {
              if (Number(e.target.value) < 0) return;
              setChartValue((s) => ({ ...s, year: Number(e.target.value) }));
            }}
            sx={{ marginLeft: '1rem' }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            value={chartValue.value || 0}
            label='value'
            variant='standard'
            sx={{ marginLeft: 2 }}
            InputLabelProps={{ shrink: true }}
            type='number'
            onChange={(e) => {
              if (Number(e.target.value) < 0) return;
              setChartValue((s) => ({ ...s, value: Number(e.target.value) }));
            }}
          />
          <Button
            variant='contained'
            component='label'
            sx={{ marginLeft: 2, marginTop: 2 }}
            disabled={!chartValue.year || !chartValue.value}
            onClick={() => {
              setChartValues((s) => [...s, { ...chartValue }]);
              setChartValue({});
            }}
          >
            Add
          </Button>
          {chartValues.map((cv) => (
            <div>
              year : {cv.year} value : {cv.value}
              <Button
                onClick={() =>
                  setChartValues((s) =>
                    s.filter((v) => v.year !== cv.year || v.value !== cv.value)
                  )
                }
              >
                X
              </Button>
            </div>
          ))}
          <Button
            sx={{ marginTop: '3rem' }}
            fullWidth
            variant='contained'
            disabled={!chartName || chartValues.length === 0}
            onClick={() => {
              if (!chartName) return;
              setFinancials((s) => [...s, { name: chartName, chartValues }]);
              setChartValues([]);
              setChartName('');
            }}
          >
            Financial Add
          </Button>
        </Grid>
        <Grid item xs={4}>
          <FormTitle></FormTitle>
          {financials.map((cv) => (
            <div>
              <Typography variant='h6'>{cv.name}</Typography>
              {cv.chartValues.map((cvv) => JSON.stringify(cvv))}
              <Button
                onClick={() =>
                  setFinancials((s) => s.filter((v) => v.name !== cv.name))
                }
              >
                X
              </Button>
            </div>
          ))}
        </Grid>
        <Grid item xs={4}>
          <FormTitle>Opinions</FormTitle>
          <FileUploader
            name='opinion'
            onChange={(e) =>
              setOpinion((s) => ({ ...s, file: e.target.files[0] }))
            }
          />
        </Grid>
        <Grid item xs={4}>
          <FormTitle></FormTitle>
          <div style={flexColumn}>
            <TextField
              value={opinion.author || ''}
              label='author'
              variant='outlined'
              sx={{ marginLeft: 2, marginBottom: 2 }}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setOpinion((s) => ({ ...s, author: e.target.value }));
              }}
            />
            <TextField
              value={opinion.message || ''}
              label='message'
              variant='outlined'
              sx={{ marginLeft: 2 }}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => {
                setOpinion((s) => ({ ...s, message: e.target.value }));
              }}
            />
            <Button
              variant='contained'
              component='label'
              sx={{ marginLeft: 2, marginTop: 2 }}
              disabled={!opinion.author || !opinion.message}
              onClick={() => {
                setOpinions((s) => [...s, { ...opinion }]);
                setOpinion({});
              }}
            >
              Add
            </Button>
          </div>
        </Grid>
        <Grid item xs={4}>
          <FormTitle></FormTitle>
          {opinions.map((cv) => (
            <div>
              <FilePreview file={cv.file} url={cv.authorImageUrl} />
              author : {cv.author} message : {cv.message}
              <Button
                onClick={() =>
                  setOpinions((s) =>
                    s.filter(
                      (v) => v.author !== cv.author || v.message !== cv.message
                    )
                  )
                }
              >
                X
              </Button>
            </div>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Button variant='contained' type='submit' fullWidth>
            {isEdit ? 'Edit' : 'Add'} Stock
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
