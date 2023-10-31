import React, { useMemo, useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import StockCover from "../../components/StockCover";
import Financials from "../../components/Stock/Financials";
import InvestSimulatorIdeas from "../../components/Stock/InvestSimulatorIdeas";
import Overview from "../../components/Stock/Overview";
import Opinions from "../../components/Stock/Opinions";
import { useAppUser } from "../../hooks/useAppUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../apis";
import { MainLayout } from "../../Layouts";
import useModal from "../../hooks/useModal";
import { PurchaseModal } from "../../components/Popup/PurchaseModal";
import { mobileWidth } from "../../styles/responsive";
import { numberComma } from "../../utils/number";
import storage from "../../utils/storage";

export default function StockPage(props) {
  return (
    <MainLayout>
      <Stock {...props} />
    </MainLayout>
  );
}

function Stock({ stock, analysis }) {
  const { user, refetch: refetchUser } = useAppUser();
  const [comment, setComment] = useState("");
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();

  const [stockOrderQuantity, setStockOrderQuantity] = useState(0);
  const { data: currentStockValuationData, refetch } = useQuery(
    ["currentStockValuation", user?._id, stock?._id],
    api.price.get(stock?._id, user?._id),
    { enabled: !!(stock?._id && user?._id) }
  );
  const { data: liveStock, refetch: refetchLiveStock } = useQuery(
    ["liveStock", stock?.ticker],
    api.stock.getById(stock?._id),
    { enabled: !!stock?.ticker }
  );
  const { data: userCurrentStock, refetch: userCurrentStockRefetch } = useQuery(
    ["userCurrentStock", stock?._id, user?._id],
    api.user.getCurrentStock(user?._id, stock?._id),
    { enabled: !!stock?._id && !!user?._id }
  );

  const { data: ideaList } = useQuery(
    ["ideaList", stock?._id],
    api.stock.getIdeasById(stock._id),
    { enabled: !!stock._id }
  );
  const { data: comments, refetch: refetchComments } = useQuery(
    ["stockComments", liveStock?._id],
    (liveStock?.commentIds &&
      api.comment.getByIds(liveStock.commentIds?.join(","))) ||
      []
  );
  const postOrder = useMutation(api.order.post, {
    onMutate: (variables) => {
      const accessToken = storage.get("access_token");
      if (variables.type === "buy") {
        queryClient.setQueryData(
          ["user profile", accessToken || "ac"],
          ({ user }) => {
            return {
              user: {
                ...user,
                cash: (user?.cash || 0) - variables.price * variables.quantity,
              },
            };
          }
        );
        queryClient.setQueryData(
          ["currentStockValuation", user?._id, stock?._id],
          (old) => {
            return {
              ...old,
              price: old.price + variables.price * variables.quantity,
            };
          }
        );
      } else {
        queryClient.setQueryData(
          ["user profile", accessToken || "ac"],
          ({ user }) => {
            return {
              user: {
                ...user,
                cash: (user?.cash || 0) + variables.price * variables.quantity,
              },
            };
          }
        );
        queryClient.setQueryData(
          ["currentStockValuation", user._id, stock._id],
          (old) => {
            return {
              ...old,
              price: old.price - variables.price * variables.quantity,
            };
          }
        );
      }
    },
    onSuccess: (_, variables) => {
      if (variables.type === "buy") {
        openModal({
          children: ({ onConfirm }) => (
            <PurchaseModal
              onConfirm={onConfirm}
              message={`You purchased ${stockOrderQuantity} shares of ${
                stock?.name
              }\nAvailable UpArrow Cash: $${numberComma(
                Math.round(
                  user?.cash - stockOrderQuantity * stock?.currentPrice
                )
              )}`}
            />
          ),
          onConfirm: closeModal,
        });
      } else {
        openModal({
          children: ({ onConfirm }) => (
            <PurchaseModal
              onConfirm={onConfirm}
              message={`You sold ${stockOrderQuantity} shares of ${
                stock?.name
              }\n\nAvailable UpArrow Cash: $${
                stockOrderQuantity * stock?.currentPrice
              }  
            `}
            />
          ),
          onConfirm: closeModal,
        });
      }

      refetch();
      refetchUser();
      refetchLiveStock();
      userCurrentStockRefetch();
    },
    onError: (e) => {
      const message = e.response.data.message;
      if (message === "exceed cash") {
        openModal({
          children: ({ onConfirm }) => (
            <PurchaseModal
              title="UpArrow Cash is insufficient"
              onConfirm={onConfirm}
              message={`You don't have enough cash`}
            />
          ),
          onConfirm: closeModal,
        });
      }
      if (message === "exceed quantity") {
        openModal({
          children: ({ onConfirm }) => (
            <PurchaseModal
              title={`You own ${currentStockValuationData?.quantity} ${stock.name} shares`}
              onConfirm={onConfirm}
              message={`You cannnot sell more shares than you own`}
            />
          ),
          onConfirm: closeModal,
        });
      }
    },
  });

  const submitComment = async () => {
    if (comment && stock && user?.email) {
      const data = await api.user.getByEmail(user.email)();

      try {
        await api.comment.post({
          stockId: String(stock._id),
          userId: String(data._id),
          content: comment,
          likes: [],
        })();
        await axios.get(`/api/revalidate/stock/${stock.ticker}`);
        refetchLiveStock();
        setTimeout(() => {
          refetchComments();
        }, 300);
      } catch (e) {
        console.error("e : ", e);
      } finally {
        setComment("");
      }
    }
  };

  const onBuyClick = (stockOrderQuantity) => {
    postOrder.mutate({
      stockId: stock._id,
      userId: user._id,
      price: stock.currentPrice,
      quantity: stockOrderQuantity,
      type: "buy",
    });
  };

  const onSellClick = (stockOrderQuantity) => {
    postOrder.mutate({
      stockId: stock._id,
      userId: user._id,
      price: stock.currentPrice,
      quantity: stockOrderQuantity,
      type: "sell",
    });
  };

  return (
    <StockWrapper>
      <div className="stock-content">
        <StockCover
          stockImageUrl={stock.logoUrl}
          stockCoverImageUrl={stock.backgroundImageUrl}
          stockName={stock.name}
        />
        <InvestSimulatorIdeas
          stock={liveStock || stock}
          user={user}
          userCurrentStock={userCurrentStock}
          ideaList={
            ideaList
              ?.sort((a, b) => {
                return a.createdAt - b.createdAt;
              })
              .slice(0, 5) || []
          }
          onBuyClick={onBuyClick}
          onSellClick={onSellClick}
          stockOrderQuantity={stockOrderQuantity}
          setStockOrderQuantity={setStockOrderQuantity}
          currentStockValuation={currentStockValuationData?.price}
          className="section"
        />
        <Overview
          className="section"
          analysis={analysis}
          analysisIdeaList={analysis.insightOfGiantsUrls || []}
        />
        <Financials className="section" analysis={analysis} />
        <Opinions
          analysis={analysis}
          className="section"
          comment={comment}
          setComment={setComment}
          comments={comments || []}
          submitComment={submitComment}
        />
      </div>
    </StockWrapper>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const ticker = context.params.ticker;
  const stock = (
    await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${ticker}/ticker`
    )
  ).data;
  const analysisId = stock.analysisId;
  const analysis = (
    await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/analysis/${analysisId}`
    )
  ).data;

  return {
    props: {
      stock,
      analysis: {
        ...analysis,
        opinions: analysis.opinions?.reverse?.() || [],
      },
    },
  };
}

const StockWrapper = styled.div`
  display: flex;
  justify-content: center;

  .section {
    margin-bottom: 3.2rem;
    & > div {
      width: 50%;
    }
  }
  .stock-content {
    max-width: 128rem;
    width: 100%;
  }

  .content {
    padding: 0 3rem;

    .button-wrapper {
      display: flex;
      justify-content: center;
      gap: 5rem;
    }
  }

  .financial {
    margin-bottom: 5rem;
  }

  .investor-wrapper {
    display: flex;
    gap: 5rem;
  }

  .buy-sale-btn-group {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 5rem;
    margin-bottom: 10rem;
  }

  @media screen and (max-width: ${mobileWidth}) {
    .section {
      & > div {
        width: 100%;
      }
    }

    .stock-content {
      & > :not(:first-child) {
        margin: 0 2rem;
      }
    }
  }
`;
