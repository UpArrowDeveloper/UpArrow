import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from '@emotion/styled';

const InvestorSocialBlock = styled.div`
  .social-button {
    background-color: transparent;
    border: solid 0.3rem transparent;
    box-shadow: 0rem 0rem 1rem #c4c7cc;
    border-radius: 0.6rem;
    width: 12rem;
    color: rgb(32, 38, 46);
    font-size: 1.6rem;
    margin-bottom: 2rem;
    font-weight: 900;
    :hover {
      border: 0.3rem solid gray;
    }
  }
`;

const DialogBlock = styled.div`
  .modal-title {
    font-size: 3rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const ModalBlock = styled.div`
  display: flex;
  align-items: center;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  :hover {
    background-color: rgba(0 0 0 /10%);
  }

  .avatar {
    margin-right: 1rem;
  }

  .avatar > img {
    width: 9rem;
    height: 9rem;
    border-radius: 99.9rem;
    border: 0.1rem solid rgba(0 0 0 /10%);
    margin-right: 2rem;
    object-fit: cover;
  }

  .avatarName {
    font-size: 1.8rem;
    font-weight: bold;
    margin-right: 3rem;
  }

  .follow-button {
    font-size: 1.8rem;
    font-weight: bold;
    margin-left: auto;
    width: 8rem;
    border: 0.1rem solid black;
    border-radius: 0.6rem;
    padding: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
      background-color: rgba(0 0 0 /30%);
    }
  }
`;

function SimpleDialog(props) {
  const [docList, setDocList] = useState([]);

  useEffect(() => {
    const getDocList = async () => {
      var investorStrId = localStorage.getItem('investorStrId');
      if (props.modalTitle == 'Invested') {
        const stockDocumentListResponse = await axios.get(
          `http://localhost:4000/api/v1/investor/purchases/${investorStrId}`
        );
        setDocList(stockDocumentListResponse.data);
      }
      if (props.modalTitle == 'Followers') {
        const followersDocumentListResponse = await axios.get(
          `http://localhost:4000/api/v1/investor/followers/${investorStrId}`
        );
        setDocList(followersDocumentListResponse.data);
      }
      if (props.modalTitle == 'Following') {
        const followingsDocumentListResponse = await axios.get(
          `http://localhost:4000/api/v1/investor/followings/${investorStrId}`
        );
        setDocList(followingsDocumentListResponse.data);
      }
    };
    if (open) {
      getDocList();
    }
  }, [props.open]);

  const { onClose, selectedValue, open } = props;

  const router = useRouter();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = async (id, isStock, currUserId) => {
    var currUserStringId = String(currUserId);
    if (isStock) {
      localStorage.setItem('stockIdStrModal', id);
      localStorage.removeItem('stockIdStr');
      router.push('/stock');
    } else {
      localStorage.setItem('investorStrId', id);
      router.push('/investor');
      router.reload();
    }
  };

  const onFollow = async (id, isStock, currUserId) => {
    var currUserStringId = String(currUserId);
    const response = await axios.put(
      `http://localhost:4000/api/v1/investor/following/${currUserStringId}/${id}`
    );
  };

  const renderedEmailList = docList.map((doc) => {
    var id = String(doc._id);
    var isStock = false;
    var isFollowing = false;
    if (doc.ticker) {
      isStock = true;
    } else {
      var userFollowersList = doc.followers;
      if (userFollowersList.includes(props.currentUserId)) {
        isFollowing = true;
      }
    }
    var followText = isFollowing ? 'Unfollow' : 'Follow';
    return (
      <ModalBlock
        key={doc._id}
        onClick={() => handleListItemClick(id, isStock, props.currentUserId)}
      >
        <div className='avatar'>
          <img alt={doc.name} src={doc.profile_image_url} />
        </div>

        <div className='avatarName'>{doc.name}</div>

        {!isStock && (
          <div className='follow-button'>
            <div
              onClick={() => onFollow(id, isStock, props.currentUserId)}
              variant='outlined'
            >
              {followText}
            </div>
          </div>
        )}
      </ModalBlock>
    );
  });

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogBlock>
        <DialogTitle>
          <div className='modal-title'>{props.title}</div>
        </DialogTitle>
        <List sx={{ pt: 0 }}>{renderedEmailList}</List>
      </DialogBlock>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

const ProfileModal = ({ title, docJSONList, currentUserId, modalTitle }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedValue();
  };

  return (
    <InvestorSocialBlock>
      <button
        className='social-button'
        variant='outlined'
        onClick={handleClickOpen}
      >
        {`${docJSONList.length} ${title}`}
      </button>

      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        title={modalTitle}
        modalDocList={docJSONList}
        currentUserId={currentUserId}
        modalTitle={title}
      />
    </InvestorSocialBlock>
  );
};

export default ProfileModal;
