import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useRouter } from 'next/router';
import StarRatings from 'react-star-ratings';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import styles from '../components/Stock.module.css';
import Grid from '@mui/material/Grid';
import Comment from '../components/Comment';
import Paper from '@material-ui/core/Paper';
import { useUser } from '@auth0/nextjs-auth0';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

export default function Dashboard() {
  return (
    <div>
      <ResponsiveAppBar />

      <Box
        sx={{
          width: 1000,
          display: 'flex',
          alignItems: 'center',
        }}
        pl={5}
      >
        <Typography variant='h6'>
          <strong> What other investors think about stocks </strong>
        </Typography>
      </Box>
      <br />
      <br />
      <div></div>
      <form>
        <Button type='submit' color='secondary' variant='contained'>
          Submit
        </Button>
      </form>
      <br />
      <br />
      <Typography align='center' style={{ color: '#459BF2' }} variant='h5'>
        What’s your decision?
      </Typography>
      <br />
      <br />
      <br />
      <br />
      <Box textAlign='center'></Box>
    </div>
  );
}
