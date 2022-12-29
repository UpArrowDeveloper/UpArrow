import styled from '@emotion/styled';

const AnalysesWrapper = styled.div`
  padding: 2rem 3.4rem;
  border: 0.1rem solid black;
  margin-bottom: 3rem;

  h2 {
    font-weight: bold;
  }

  .analyses-content {
    font-size: 1.6rem;
  }
`;

const Analyses = ({ title, children, type }) => {
  return (
    <AnalysesWrapper>
      <h2>{title}</h2>
      {type === 'html' ? (
        <div
          className='analyses-content'
          dangerouslySetInnerHTML={{ __html: children }}
        />
      ) : (
        <div className='analyses-content'>{children}</div>
      )}
    </AnalysesWrapper>
  );
};

export default Analyses;
