import { API_URL } from '../../config';

export const ThumbnailUrl = ({ image }) => {
  return (
    image &&
    API_URL + image.url.slice(1, 9) + 'thumbnail/th-' + image.url.slice(9)
  );
};

export const ImgUrl = ({ image }) => {
  return image && API_URL + image.url;
};
