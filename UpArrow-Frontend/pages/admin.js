import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../apis';
import ObjectTable from './PriceTable';

const AdminBlock = styled.div`
  padding: 11rem;

  .stock-table {
    font-size: 2rem;
    * {
      padding: 2rem;
    }
  }
`;

export default function Admin() {
  const { data, isLoading } = useQuery(['config'], api.config.get);
  const { data: stockData, isLoading: isStockLoading } = useQuery(
    ['stock'],
    api.stock.get
  );
  const [configData, setConfigData] = useState();
  const updateConfig = useMutation(api.config.put(configData));

  useEffect(() => {
    if (data) {
      setConfigData(data);
    }
  }, [data]);
  const [priceObject, setPriceObject] = useState();

  useEffect(() => {
    if (!isStockLoading && stockData) {
      setPriceObject(
        stockData.reduce(
          (acc, stock) => ({ ...acc, [stock._id]: stock.currentPrice }),
          {}
        )
      );
    }
  }, [isStockLoading, stockData]);
  if (isLoading) return null;
  if (isStockLoading || !stockData) return null;
  if (!priceObject) return null;

  const parsedPriceList = configData ? Object.entries(configData.prices) : [];
  const parsedBoardList = configData ? Object.entries(configData.board) : [];
  const tickers = parsedPriceList.map((price) => price[0]);
  const prices = parsedPriceList.map((price) => price[1]);
  const boardKeys = parsedBoardList.map((board) => board[0]);
  const boardValues = parsedBoardList.map((board) => board[1]);

  return (
    <AdminBlock>
      {JSON.stringify(stockData)}
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

      <table className='stock-table'>
        <thead>
          <tr>
            <td>id</td>
            <td>name</td>
            <td>ticker</td>
            <td>currentPrice</td>
            <td>save</td>
          </tr>
        </thead>
        <tbody>
          {stockData.map((stock) => {
            return (
              <tr>
                <td>{stock._id}</td>
                <td>{stock.name}</td>
                <td>{stock.ticker}</td>
                <td>
                  <input
                    type='number'
                    value={priceObject[stock._id]}
                    onChange={(e) => {
                      setPriceObject((s) => ({
                        ...s,
                        [stock._id]: e.target.valueAsNumber,
                      }));
                    }}
                  />
                </td>
                <td>
                  <button
                    onClick={() => {
                      api.stock.savePriceById(stock._id, {
                        currentPrice: priceObject[stock._id],
                      })();
                    }}
                  >
                    save
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
