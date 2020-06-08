import { useState, useEffect } from "react";

export const usePagination = (list, limit) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [currentPage, setCurrentPage] = useState([]);

  const pagesQuantity = Math.ceil(list.length / limit);

  useEffect(() => {
    const begin = pageNumber * limit;
    const end = begin + limit;

    list.length <= limit
      ? setCurrentPage(list)
      : setCurrentPage(list.slice(begin, end));
  }, [list, limit, pagesQuantity, pageNumber]);

  const changePage = (page) => {
    setPageNumber(Math.min(Math.max(0, page), pagesQuantity));
  };

  return {
    currentPage,
    controls: { pageNumber, pagesQuantity, changePage },
  };
};
