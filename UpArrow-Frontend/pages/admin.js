import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import styled from '@emotion/styled';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../apis';
import ObjectTable from './PriceTable';

const AdminBlock = styled.div`
  padding: 11rem;
`;

export default function Admin() {
  const { data, isLoading } = useQuery(['config'], api.config.get);
  const [configData, setConfigData] = useState();
  const updateConfig = useMutation(api.config.put(configData));

  useEffect(() => {
    if (data) {
      setConfigData(data);
    }
  }, [data]);

  if (isLoading) return null;

  const parsedPriceList = configData ? Object.entries(configData.prices) : [];
  const parsedBoardList = configData ? Object.entries(configData.board) : [];
  const tickers = parsedPriceList.map((price) => price[0]);
  const prices = parsedPriceList.map((price) => price[1]);
  const boardKeys = parsedBoardList.map((board) => board[0]);
  const boardValues = parsedBoardList.map((board) => board[1]);

  return (
    <AdminBlock>
      <select>
        <option>config</option>
      </select>
      <div>
        <input
          placeholder='banner image url'
          name='banner'
          value={configData?.bannerImageUrl}
          onChange={(e) =>
            setConfigData((config) => ({
              ...config,
              bannerImageUrl: e.target.value,
            }))
          }
        />
      </div>
      <ObjectTable
        tickers={tickers}
        prices={prices}
        setConfigData={setConfigData}
        property='prices'
      />
      <ObjectTable
        tickers={boardKeys}
        prices={boardValues}
        setConfigData={setConfigData}
        type='input'
        property='board'
      />
      <button
        onClick={() => {
          updateConfig.mutate(configData);
        }}
      >
        Save
      </button>
    </AdminBlock>
  );
}
