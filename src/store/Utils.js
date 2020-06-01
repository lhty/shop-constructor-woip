import { API_URL } from "../config";

export const ThumbnailUrl = (image, size) => {
  const _size = size ? size : "th";
  const _url = image.url ? image.url : image.length && image[0].url;
  return (
    image &&
    `${API_URL}${_url && _url.substring(1, 9)}thumbnail/${_size}-${
      _url && _url.substring(9)
    }`
  );
};

export const ImgUrl = ({ image }) => {
  return image && image[0].url && API_URL + image[0].url.substring(1);
};

export const composeBundle = (products = []) => {
  return products.length > 1
    ? products.map((product) => ({ ...product, ...composeSet(product) }))
    : { ...products, ...composeSet(products) };
};

const composeSet = ({ items = [], schema = [], proportion: { price = 0 } }) => {
  const set = [];
  for (let element of schema.split(",")) {
    let item = parseInt(element)
      ? items.find((item) => item.id === element)
      : {
          ...items.find((item) => item.name === "Буква"),
          letter: element,
        };
    price += item.price;
    set.push(item);
  }
  return {
    set,
    price,
    size: set.length,
  };
};
