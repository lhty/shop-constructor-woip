import React, { useContext, useState } from 'react';
import { Context } from './Provider';
import { useQuery } from 'react-apollo-hooks';
import { API_URL } from '../config';

const Promo = () => {
  const { PROMO } = useContext(Context);
  const { loading, data } = useQuery(PROMO);
  const [next, setNext] = useState(0);
  // const mapped = [...data];
  return (
    <>
      <section className="promo-container">
        <div className="promo">
          <button
            className="promo-prev"
            type="button"
            onClick={() => {
              setNext(next > 0 ? next - 1 : 0);
            }}
          ></button>
          {loading ? (
            <></>
          ) : (
            <div className="banner">
              <img
                src={`${API_URL}${
                  [...data.promos.map(val => val.promo_banners[0].url)][next]
                }`}
                alt=""
              ></img>
            </div>
          )}
          <button
            className="promo-next"
            type="button"
            onClick={() => {
              setNext(
                next <
                  [...data.promos.map(val => val.promo_banners[0].url)].length -
                    1
                  ? next + 1
                  : next
              );
            }}
          ></button>
        </div>
      </section>
      {Promobotlabel}
    </>
  );
};

const Promobotlabel = (
  <svg
    className="promo-svg-label"
    width="71"
    height="31"
    viewBox="0 0 71 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M4.5 0L36.3462 23L67.5 0H4.5Z" fill="#ffc2a859" />
    </g>
  </svg>
);

export default Promo;
