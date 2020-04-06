import { useState } from "react";

export const usePagination = (list, limit) => {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(list.length / limit);

  function jump(page) {
    const pageNumber = Math.max(1, page);
    setPage(page => Math.min(pageNumber, pages));
  }

  function currentPage() {
    const begin = (page - 1) * pages;
    const end = begin + pages;
    return list.slice(begin, end);
  }

  return { jump, currentPage, page, pages };
};
