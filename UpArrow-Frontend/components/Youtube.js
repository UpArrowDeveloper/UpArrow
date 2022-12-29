const Youtube = ({ youtubeCode, width = '560', height = '315' }) => {
  return (
    <iframe
      width={width}
      height={height}
      src={`https://www.youtube.com/embed/${youtubeCode}`}
      title='YouTube video player'
      frameborder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowfullscreen
    />
  );
};

export default Youtube;
