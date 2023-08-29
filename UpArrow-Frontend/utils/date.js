export const getYMD = (date, seperateChar = "-") => {
  return `${date.getFullYear()}${seperateChar}${String(
    date.getMonth() + 1
  ).padStart(2, "0")}${seperateChar}${String(date.getDate()).padStart(2, "0")}`;
};

export const getBannerYMD = (date) => {
  return Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
};
