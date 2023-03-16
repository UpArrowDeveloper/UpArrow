import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import { Button, Divider, TextField, Typography } from '@mui/material';
import FilePreview from '../../../components/common/FilePreview';
import axios from 'axios';
import { env } from '../../../config';
import { useRouter } from 'next/router';
import { getYMD } from '../../../utils/date';

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
      <Typography variant='h6' gutterBottom>
        Add Stock
      </Typography>
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
          <Typography variant='h6' gutterBottom>
            Upload Stock Image
          </Typography>
          <Button variant='contained' component='label'>
            Upload File
            <input
              type='file'
              id='stockImage'
              name='stockImage'
              hidden
              onChange={(e) => {
                setLogoImage(e.target.files[0]);
              }}
            />
          </Button>
          <FilePreview file={logoImage} url={stock?.logoUrl} />
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
              onChange={(e) => {
                setBackgroundImage(e.target.files[0]);
              }}
            />
          </Button>
          <FilePreview file={backgroundImage} url={stock?.backgroundImageUrl} />
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
            value={currentPrice}
            onChange={(e) => setCurrentPrice(Number(e.target.value))}
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
              <Button
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
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Market Cap
          </Typography>
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
              onChange={(e) => {
                setThumbnailImage(e.target.files[0]);
              }}
            />
          </Button>
          <FilePreview
            file={thumbnailImage}
            url={analysis?.thumbnailImageUrl}
          />
          <TextField
            id='thumbnailTitle'
            name='thumbnailTitle'
            label='thumbnail title'
            value={thumbnailTitle}
            onChange={(e) => setThumbnailTitle(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant='standard'
            sx={{ marginLeft: 2 }}
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
          <Typography variant='h6' gutterBottom>
            missionStatement
          </Typography>
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
          <Typography variant='h6' gutterBottom>
            businessModel
          </Typography>
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
          <Typography variant='h6' gutterBottom>
            Competitive Advantages
          </Typography>
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
              <div>
                {e}
                <Button
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
              <div>
                {e}
                <Button
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
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h6' gutterBottom>
            Financials
          </Typography>
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
          <FilePreview file={opinion.file} />
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
