export default (func, wait, immediate, ...rest) => {
  let timeout;
  return () => {
    let context = this,
      args = rest;
    let later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
