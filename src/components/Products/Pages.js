import React, { useState } from "react";

import "./Pages.css";

export const Pages = ({ length, limit }) => {
  const [sortstate, setSortstate] = useState({
    offset: 0,
    page: 0
  });
  const _pageQuantity = Math.ceil(length / limit);

  if (length <= 1 || length <= limit) return null;

  return (
    <div className="Pages-container">
      {sortstate.page >= 10 && (
        <>
          <div
            className="lastpage"
            onClick={() =>
              setSortstate({
                ...sortstate,
                offset: 0,
                page: 0
              })
            }
          >
            1
          </div>
          <div
            onClick={() =>
              setSortstate({ ...sortstate, page: sortstate.page - 10 })
            }
          >
            ...
          </div>
        </>
      )}
      {[...Array(_pageQuantity).keys()].map(
        (_, index, arr) =>
          index >= sortstate.page &&
          index < sortstate.page + 10 && (
            <div
              className={
                Math.ceil(sortstate.offset / limit) === index ? "active" : ""
              }
              key={index}
              onClick={() =>
                setSortstate({
                  ...sortstate,
                  offset: limit * index
                })
              }
            >
              {index + 1}
            </div>
          )
      )}
      {length && _pageQuantity > 10 && _pageQuantity - sortstate.page > 10 && (
        <>
          <div
            onClick={() =>
              setSortstate({ ...sortstate, page: sortstate.page + 10 })
            }
          >
            ...
          </div>
          <div
            className="lastpage"
            onClick={() =>
              setSortstate({
                ...sortstate,
                offset: limit * (_pageQuantity - 1),
                page: _pageQuantity - 10
              })
            }
          >
            {_pageQuantity}
          </div>
        </>
      )}
    </div>
  );
};
