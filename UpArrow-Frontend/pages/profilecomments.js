import React from 'react';
import Comment from '../components/Comment';

export default function ProfileComments({ data, stockLogoList }) {
  const newCommentsList = data.map((comment) => {
    return (
      <div key={comment._id}>
        <Comment commentJSON={comment} stockList={stockLogoList} />
        <br />
      </div>
    );
  });
  return <div> {newCommentsList} </div>;
}

export async function getServerSideProps() {
  const response = await fetch(
    'http://localhost:4000/api/v1/investor/fetch/all/user/comments/6232b9db69c746d0e7f01700'
  );
  const data = await response.json();
  const stockLogoList = [];

  for (var i = 0; i < data.length; i++) {
    var comment = data[i];
    var stockId = comment.stockId;
    var userId = comment.userId;
    const stockResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/stock/${stockId}`
    );
    const stockDocument = await stockResponse.json();
    stockLogoList.push(stockDocument);
  }

  return {
    props: { data, stockLogoList },
  };
}
