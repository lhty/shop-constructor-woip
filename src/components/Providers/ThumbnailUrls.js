import { API_URL } from "../../config";

export const ThumbnailUrl = (image, size) => {
  const _size = size ? size : "th";
  const _url = image.url ? image.url : image[0].url;
  return (
    image &&
    `${API_URL}${_url.substring(1, 9)}thumbnail/${_size}-${_url.substring(9)}`
  );
};

export const ImgUrl = ({ image }) => {
  return image && API_URL + image[0].url.substring(1);
};
