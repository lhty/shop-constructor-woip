import { API_URL } from '../../config';

export const ThumbnailUrl = img =>
  API_URL +
  img.images[0].url.slice(1, 9) +
  'thumbnail/th-' +
  img.images[0].url.slice(9);

export const ImgUrl = img => API_URL + img.images[0].url;
