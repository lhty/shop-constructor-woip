export const debounce = (callback, wait) => {
  let timeout = null;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(args), wait);
  };
};
