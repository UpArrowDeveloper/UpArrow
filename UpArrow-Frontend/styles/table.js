import { css } from '@emotion/react';
import color from './color';
import { Body14Medium, HeadH1Bold } from './typography';

export const commonListCss = css`
  padding-top: 3.2rem;
  header {
    padding: 1.6rem 3.2rem;
  }
  h1 {
    ${HeadH1Bold}
  }

  .order-option-wrapper {
    padding: 0.8rem 3.2rem;
    display: flex;
    gap: 0.8rem;
    margin-bottom: 4rem;
  }

  .view-more-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2.4rem;
  }
  .view-more {
    width: 24rem;
  }
`;

export const commonTableCss = css`
  .table-wrapper {
    padding: 0 3.2rem;

    tr {
      cursor: pointer;
    }
  }

  .image-container {
    padding: 1.2rem 0.8rem;
  }

  .image-wrapper {
    position: relative;
    width: 5.6rem;
    height: 5.6rem;
  }

  table {
    width: 100%;
    margin-bottom: 3.2rem;
    thead {
      th {
        ${Body14Medium}
        color: ${color.B40};
        text-align: left;
        padding-bottom: 1.6rem;
      }
      border-bottom: 0.1rem solid rgba(0 0 0 / 20%);
    }

    tbody {
      &:before {
        content: '-';
        display: block;
        line-height: 0.8rem;
        color: transparent;
      }
      tr {
        border-bottom: 0.1rem solid rgba(0 0 0 / 20%);
      }
    }
  }
`;
