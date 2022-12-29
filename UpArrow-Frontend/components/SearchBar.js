import React, { Component, useState, useEffect } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import './SearchBar.module.css';
import styled from '@emotion/styled';

const SearchBarWrapper = styled.div`
  .searchSelect__control {
    height: 5.5rem;
    font-size: 2rem;
    margin-bottom: 3rem;
  }
`;

const SearchBar = (props) => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    getOptions(props.options);
  }, []);

  const getOptions = (options) => {
    setSelectedOptions(options);
  };

  const handleChange = (e) => {
    setValue({ value: e });
    var stockIdStr = e.stockId;
    if (user) {
      localStorage.setItem('stockIdStr', stockIdStr);
      router.push('/stock');
    } else {
      router.push('/api/auth/login');
    }
  };

  return (
    <SearchBarWrapper>
      <Select
        classNamePrefix='searchSelect'
        options={selectedOptions}
        placeholder='Search Stocks'
        onChange={handleChange}
      />
    </SearchBarWrapper>
  );
};

export default SearchBar;
