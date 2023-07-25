import styled from "@emotion/styled";
import "@toast-ui/editor/dist/toastui-editor.css";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { env } from "../config";
import api from "../apis";
import { Body12Medium, HeadH1Bold } from "../styles/typography";
import color from "../styles/color";
import SearchInput from "./common/SearchInput";
import TagPill from "./Editor/TagPill";
import { PlusIcon } from "./icons";
import { useRouter } from "next/router";
import { useAppUser } from "../hooks/useAppUser";
import { mobileWidth } from "../styles/responsive";
import { useMobile } from "../hooks/useMobile";

const ToastEditor = dynamic(() => import("../components/ToastEditor"), {
  ssr: false,
});
const Editor = ({ editData }) => {
  const { user } = useAppUser({ isAuthorized: true });
  // https://www.youtube.com/watch?v=fzEcKYFmQxM ex video url
  const [videoUrl, setVideoUrl] = useState("");
  const [postForm, setPostForm] = useState(
    editData || { title: "", content: "", thumbnailImageUrl: "", stockIds: [] }
  );
  const router = useRouter();
  const { isMobile } = useMobile();
  const [stockTextForSearch, setStockTextForSearch] = useState("");
  const [stockSearchResult, setStockSearchResult] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [file, setFile] = useState();

  const titleInputRef = useRef();

  useEffect(() => {
    if (stockTextForSearch.length === 0) return;
    const search = async () => {
      const res = (
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/stock/search`, {
          params: {
            name: stockTextForSearch,
          },
        })
      ).data;
      setStockSearchResult(res);
    };
    search();
  }, [stockTextForSearch]);

  useEffect(() => {
    const getStocks = async () => {
      const res = await Promise.all(
        editData.stockIds.map((stockId) => {
          return api.stock.getById(stockId)();
        })
      );
      setSelectedStocks(res);
    };
    if (editData?.stockIds) {
      getStocks();
    }
    setStockSearchResult(editData?.stockIds || []);
  }, [editData?.stockIds]);

  useEffect(() => {
    setTimeout(() => {
      titleInputRef.current.focus();
    }, 300);
  }, []);

  const submit = async () => {
    const link = postForm.content.split('src="')?.[1]?.split('"')?.[0];

    if (!link) {
      alert("no thumbnail");
      return;
    }

    if (selectedStocks.length === 0) {
      alert("no stocks");
      return;
    }

    const splitedVideoUrl = videoUrl?.split("=")?.[1];
    const payload = {
      ...postForm,
      stockIds: selectedStocks.map(({ _id }) => _id),
      email: user.email,
      thumbnailImageUrl: link,
      youtubeCode: splitedVideoUrl || null,
    };
    let result;
    if (editData) {
      await api.idea.updateById(editData._id, payload);
      axios.get("/api/revalidate/idea/" + editData._id);
      router.push(`/idea/${editData._id}`);
    } else {
      result = await api.idea.post(payload);
      router.push(`/idea/${result.data._id}`);
    }
    axios.get("/api/revalidate/idea");
  };

  return (
    <EditorBlock>
      <InputWrapper isOpen={searchModalOpen}>
        <input
          className="title-input"
          value={postForm.title}
          onChange={(e) =>
            setPostForm((s) => ({ ...s, title: e.target.value }))
          }
          ref={titleInputRef}
          placeholder="Title Here"
        />
        <div className="stock-search-wrapper">
          <span className="stock-search-label">
            What stocks are you writing about?
          </span>
          <div className="stock-search">
            {selectedStocks.map((stock) => (
              <TagPill
                key={stock._id}
                label={stock.name}
                stockImageUrl={stock.logoUrl}
                clean={() => {
                  setSelectedStocks((s) =>
                    s.filter((v) => v._id !== stock._id)
                  );
                }}
              />
            ))}
            <div className="stock-with-search-input">
              <button
                className="stock-plus"
                onClick={() => {
                  setSearchModalOpen(true);
                }}
              >
                <PlusIcon />
              </button>
              <SearchInput
                className="stock-search-input"
                value={stockTextForSearch}
                setValue={setStockTextForSearch}
                searchResult={stockSearchResult.filter(
                  (v) => !selectedStocks.some((s) => s._id === v._id)
                )}
                clean={() => {
                  setStockTextForSearch("");
                  setSearchModalOpen(false);
                  setStockSearchResult([]);
                }}
                onSelect={(v) => {
                  if (selectedStocks.some((s) => s._id === v._id)) return;
                  setSelectedStocks((s) => [...s, v]);
                  setSearchModalOpen(false);
                  setStockTextForSearch("");
                }}
              />
            </div>
          </div>
        </div>
        <div className="file-selector">
          {isMobile && <SubmitBtn onClick={() => submit()}>Post</SubmitBtn>}
        </div>
        <ToastEditor
          placeholder="Write something"
          content={postForm.content}
          setPostForm={setPostForm}
          url={videoUrl}
          setFile={setFile}
          setUrl={setVideoUrl}
        />
        {!isMobile && <SubmitBtn onClick={() => submit()}>Post</SubmitBtn>}
        <div
          className="stock-search-input-cover"
          onClick={() => setSearchModalOpen(false)}
        ></div>
      </InputWrapper>
    </EditorBlock>
  );
};

const EditorBlock = styled.div`
  display: flex;
  justify-content: center;

  @media screen and (max-width: ${mobileWidth}) {
    display: block;
    padding: 2rem;
  }
`;

const SubmitBtn = styled.button`
  background-color: ${color.UpArrow_Blue};
  width: 8rem;
  height: 4rem;
  border: none;
  border-radius: 0.8rem;
  color: white;
  cursor: pointer;
  margin-left: auto;
  margin-top: 1.6rem;

  @media screen and (max-width: ${mobileWidth}) {
    margin-top: 0;
    margin-right: 1.6rem;
    width: 6rem;
    height: 3rem;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 72rem;
  padding: 3.2rem 0;

  .title-input {
    border: none;
    ${HeadH1Bold};
    color: ${color.B13};

    &:focus {
      outline: none;
    }
    &::placeholder {
      color: ${color.B80};
    }
    margin-bottom: 2.4rem;
  }

  .stock-search-wrapper {
    padding: 0.8rem 0;
    display: flex;
    margin-bottom: 1.2rem;
    flex-direction: column;

    .empty {
      flex: 1;
    }
  }

  .stock-search-label {
    margin-bottom: 0.8rem;
    ${Body12Medium}
    color: #999999;
  }

  .stock-search {
    position: relative;
    display: flex;
    gap: 0.8rem;
    height: 3.8rem;

    .stock-search-input {
      ${({ isOpen }) =>
        isOpen
          ? `
        display: block;
      `
          : `
        display: none;
      `}
      z-index: 30;
      top: 0;
      left: 5rem;
      position: absolute;
      opacity: 1;
      background-color: white;
    }

    .stock-plus {
      display: flex;
      background-color: transparent;
      border: 0.1rem solid ${color.B80};
      border-radius: 999rem;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      width: 3.8rem;
      height: 3.8rem;
    }
  }
  .stock-with-search-input {
    position: relative;
  }

  .stock-image-input {
    display: flex;
    flex-direction: column;
  }

  .stock-search-input-cover {
    ${({ isOpen }) =>
      isOpen
        ? `
        display: block;
      `
        : `
        display: none;
      `}
    position: fixed;
    z-index: 20;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .file-selector {
    display: flex;
    align-items: center;
    padding: 0.8rem 0;
  }

  @media screen and (max-width: ${mobileWidth}) {
    .stock-search {
      .stock-search-input {
        left: 4.5rem;
      }
    }

    .file-selector {
      position: fixed;
      background-color: white;
      align-items: center;
      left: 0;
      bottom: 0;
      width: 100%;
      z-index: 100;
      gap: 0.8rem;
      padding: 0.8rem 0.4rem;
      padding-left: 1rem;
      border-top: 0.1rem solid ${color.B80};
    }
  }
`;

export default Editor;
