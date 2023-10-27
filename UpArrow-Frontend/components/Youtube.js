const Youtube = ({
  youtubeCode,
  width = "560",
  height = "315",
  autoplay = false,
  style,
}) => {
  return (
    <iframe
      width={width}
      height={height}
      src={
        `https://www.youtube.com/embed/${youtubeCode}` +
        (autoplay ? "?autoplay=1&mute=1" : "")
      }
      style={style}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default Youtube;
