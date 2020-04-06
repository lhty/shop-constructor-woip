import React from "react";

import "./Pages.css";

const Pages = ({ pageNumber, pagesQuantity, changePage }) => {
  return (
    <div className="Pages-container">
      {pageNumber >= 10 && (
        <>
          <div className="lastpage" onClick={() => changePage(1)}>
            1
          </div>
          <div onClick={() => changePage(pageNumber - 10)}>...</div>
        </>
      )}
      {[...Array(pagesQuantity).keys()].map(
        (_, index) =>
          index <= pageNumber + 10 && (
            <div
              className={pageNumber === index ? "active" : ""}
              key={index}
              onClick={() => changePage(index)}
            >
              {index + 1}
            </div>
          )
      )}
      {pagesQuantity > 10 && pagesQuantity - pageNumber > 10 && (
        <>
          <div onClick={() => changePage(pageNumber + 10)}>...</div>
          <div className="lastpage" onClick={() => changePage(pagesQuantity)}>
            {pagesQuantity}
          </div>
        </>
      )}
    </div>
  );
};

export default Pages;
