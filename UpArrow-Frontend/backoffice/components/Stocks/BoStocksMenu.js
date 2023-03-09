import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { Button, Divider, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { env } from '../../../config';

export const BoStocksMenu = () => {
  const [targetPrices, setTargetPrices] = useState([]);
  const [targetPrice, setTargetPrice] = useState({});

  const [chartName, setChartName] = useState('');
  const [chartValues, setChartValues] = useState([]);
  const [chartValue, setChartValue] = useState({});

  const [opinions, setOpinions] = useState([]);
  const [opinion, setOpinion] = useState({});

  const [financials, setFinancials] = useState([]);

  const [growthOppertunities, setGrowthOppertunities] = useState([]);
  const [growthOppertunity, setGrowthOppertunity] = useState('');

  const [potentialRisks, setPotentialRisks] = useState([]);
  const [potentialRisk, setPotentialRisk] = useState('');

  const [ideaIds, setIdeaIds] = useState([]);
  const [ideaId, setIdeaId] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const ticker = e.target.ticker.value;
    const currentPrice = e.target.currentPrice.value;
    const logoImage = e.target.stockImage.files?.[0];
    const backgroundImage = e.target.backgroundImage.files?.[0];
    const marketCap = e.target.marketCap.value;

    const thumbnailImage = e.target.thumbnailImage.files?.[0];
    const thumbnailTitle = e.target.thumbnailTitle.value;
    const thumbnailDate = e.target.thumbnailDate.value;

    const missionStatement = e.target.missionStatement.value;
    const businessModel = e.target.businessModel.value;
    const competitiveAdvantage = e.target.competitiveAdvantage.value;
    const newOpinions = [];

    for await (const v of opinions) {
      const imageForm = new FormData();
      imageForm.append('image', v.file);
      const { link } = (
        await axios.post(`${env.serverUrl}/file/upload`, imageForm)
      ).data;
      newOpinions.push({ ...v, file: undefined, authorImageUrl: link });
    }

    const logoFormData = new FormData();
    logoFormData.append('image', logoImage);
    const { link: logoUrl } = (
      await axios.post(`${env.serverUrl}/file/upload`, logoFormData)
    ).data;
    const backgroundFormData = new FormData();
    backgroundFormData.append('image', backgroundImage);
    const { link: backgroundImageUrl } = (
      await axios.post(`${env.serverUrl}/file/upload`, backgroundFormData)
    ).data;
    const thumbnailFormData = new FormData();
    thumbnailFormData.append('image', thumbnailImage);
    const { link: thumbnailImageUrl } = (
      await axios.post(`${env.serverUrl}/file/upload`, thumbnailFormData)
    ).data;

    await axios.post(`${env.serverUrl}/stock`, {
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
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <Typography variant='h6' gutterBottom>
        Add Stock
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id='name'
            name='name'
            label='stock name'
            fullWidth
            variant='standard'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id='ticker'
            name='ticker'
            label='ticker'
            fullWidth
            autoComplete='family-name'
            variant='outlined'
          />
        </Grid>
        <Divider sx={{ width: '100%', mt: 4 }} variant='middle' />
        <Grid item xs={6}>
          <Typography variant='h6' gutterBottom>
            Upload Stock Image
          </Typography>
          <Button variant='contained' component='label'>
            Upload File
            <input type='file' id='stockImage' name='stockImage' hidden />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='h6' gutterBottom>
            Upload Stock Background Image
          </Typography>
          <Button variant='contained' component='label'>
            Upload File
            <input
              type='file'
              id='backgroundImage'
              name='backgroundImage'
              hidden
            />
          </Button>
        </Grid>
        <Divider sx={{ width: '100%', mt: 4 }} variant='middle' />
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Price
          </Typography>
          <TextField
            id='currentPrice'
            name='currentPrice'
            label='current price'
            variant='standard'
            type='number'
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Target Prices
          </Typography>
          <TextField
            id='targetPriceName'
            name='targetPriceName'
            label='Name'
            variant='standard'
            value={targetPrice.name || ''}
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
              <span>{targetPrice.name}</span>
              <span>({targetPrice.price})</span>
            </div>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Market Cap
          </Typography>
          <TextField
            id='marketCap'
            name='marketCap'
            label='market cap'
            type='number'
            variant='standard'
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h3' gutterBottom>
            Analyses
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='h6' gutterBottom>
            Thumbnail
          </Typography>
          <Button variant='contained' component='label'>
            Thumbnail Image Upload
            <input
              type='file'
              id='thumbnailImage'
              name='thumbnailImage'
              hidden
            />
          </Button>
          <TextField
            id='thumbnailTitle'
            name='thumbnailTitle'
            label='thumbnail title'
            variant='standard'
            sx={{ marginLeft: 2 }}
          />
          <TextField
            id='thumbnailDate'
            name='thumbnailDate'
            label='thumbnail date'
            variant='outlined'
            type='date'
            InputLabelProps={{ shrink: true }}
            sx={{ marginLeft: 2 }}
          />
        </Grid>

        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Insights of Giants
          </Typography>
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
          <div>
            {ideaIds.map((e) => (
              <div>{e}</div>
            ))}
          </div>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            missionStatement
          </Typography>
          <TextField
            id='missionStatement'
            name='missionStatement'
            label='missionStatement'
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            businessModel
          </Typography>
          <TextField
            id='businessModel'
            name='businessModel'
            label='businessModel'
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Competitive Advantages
          </Typography>
          <TextField
            id='competitiveAdvantage'
            name='competitiveAdvantage'
            label='Competitive Advantages'
            variant='outlined'
            multiline
            fullWidth
            rows={6}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Growth Opportunities
          </Typography>
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
          <div>
            {growthOppertunities.map((e) => (
              <div>{e}</div>
            ))}
          </div>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='h6' gutterBottom>
            Potential Risks
          </Typography>
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
          <div>
            {potentialRisks.map((e) => (
              <div>{e}</div>
            ))}
          </div>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='h6' gutterBottom>
            Financials
          </Typography>
          <TextField
            label='name'
            variant='outlined'
            value={chartName}
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

          <Button
            variant='contained'
            disabled={!chartName || chartValues.length === 0}
            onClick={() => {
              if (!chartName) return;
              setFinancials((s) => [...s, { name: chartName, chartValues }]);
              setChartValues([]);
              setChartName('');
            }}
          >
            Add
          </Button>
          {chartValues.map((cv) => (
            <div>
              year : {cv.year} value : {cv.value}
            </div>
          ))}
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Financials
          </Typography>
          {financials.map((cv) => (
            <div>
              <Typography variant='h6'>{cv.name}</Typography>
              {cv.chartValues.map((cvv) => JSON.stringify(cvv))}
            </div>
          ))}
        </Grid>
        <Grid item xs={8}>
          <Typography variant='h6' gutterBottom>
            Opinions
          </Typography>

          <Button variant='contained' component='label'>
            Upload File
            <input
              type='file'
              onChange={(e) =>
                setOpinion((s) => ({ ...s, file: e.target.files[0] }))
              }
              hidden
            />
          </Button>
          <TextField
            value={opinion.author || ''}
            label='author'
            variant='outlined'
            sx={{ marginLeft: 2 }}
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

          {opinions.map((cv) => (
            <div>
              hasFile : {cv.file ? 'O' : 'X'}author : {cv.author} message :{' '}
              {cv.message}
            </div>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Button variant='contained' type='submit' fullWidth>
            Add Stock
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
