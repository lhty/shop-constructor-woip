import { API_URL } from "../config";

export const ThumbnailUrl = (image, size) => {
  const prefix = (size) => {
    switch (true) {
      case size <= 800:
        return "uploads/thumbnail/sm-";
      case size > 2000:
        return "uploads/";
      default:
        return "uploads/thumbnail/th-";
    }
  };

  return API_URL + prefix(size) + (image.url || image[0].url).substring(9);
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
