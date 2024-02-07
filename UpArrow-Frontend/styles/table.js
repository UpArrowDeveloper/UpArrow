import { css } from "@emotion/react";
import color from "./color";
import {
  Body14Bold,
  Body14Medium,
  HeadH1Bold,
  HeadH3Bold,
  HeadH6Bold,
} from "./typography";
import { mobileWidth } from "./responsive";

export const commonListCss = css`
  padding-top: 1.2rem;
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

    & > div {
      white-space: nowrap;
    }
  }

  .view-more-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 2.4rem;
  }
  .view-more {
    width: 24rem;
    height: 4.2rem;
    ${HeadH6Bold}
  }

  @media screen and (max-width: ${mobileWidth}) {
    h1 {
      ${HeadH3Bold}
    }

    header {
      padding: 0.8rem 2rem;
    }

    .order-option-wrapper {
      margin-bottom: 1.6rem;
      padding: 0.8rem 2rem;
      overflow-x: scroll;

      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        display: none;
      }

      & > div {
        padding: 0.6rem 1.4rem;
      }
    }
  }
`;

export const commonTableCss = css`
  .table-wrapper {
    padding: 0 3.2rem;
    overflow: scroll;

    tr {
      cursor: pointer;
    }
  }

  .image-container {
    padding: 1.6rem 0.8rem;
    margin-right: 0.8rem;
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
      tr {
        border-bottom: 0.1rem solid rgba(0 0 0 / 20%);
      }
    }
  }

  @media screen and (max-width: ${mobileWidth}) {
    .table-wrapper {
      padding: 0 2rem;
    }

    .title-author {
      h5 {
        ${Body14Bold}
      }
    }

    .image-wrapper {
      width: 4rem;
      height: 4rem;

      border: 0.1rem solid rgba(0 0 0 / 20%);
      border-radius: 999px;
    }

    .image-container {
      padding: 0.8rem;
    }
  }
`;
