import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Providers/Provider';
import { useQuery } from 'react-apollo-hooks';
import { API_URL } from '../../config';

import './Promo.css';

const Promo = () => {
  const { PROMO } = useContext(Context);
  const { data, error, loading } = useQuery(PROMO);
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState([]);

  useEffect(() => {
    const onCompleted = data => {
      setList([...data.promos]);
    };
    const onError = error => {
      return <></>;
    };
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
    setTimeout(
      () => setCurrent(current === list.length - 1 ? 0 : current + 1),
      35000
    );
  }, [loading, data, error, list.length, current]);

  return (
    <>
      <section className="Promo-container">
        <div className="Promo">
          <button
            className="Promo-prev"
            type="button"
            onClick={() => {
              setCurrent(current === 0 ? list.length - 1 : current - 1);
            }}
          ></button>
          <div className="Promo-banner">
            {list.length > 0 ? (
              <img
                src={`${API_URL}${
                  list.map(banner => banner.promo_banners[0].url)[current]
                }`}
                alt=""
              ></img>
            ) : (
              <></>
            )}
          </div>
          <button
            className="Promo-next"
            type="button"
            onClick={() => {
              setCurrent(current === list.length - 1 ? 0 : current + 1);
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
    className="Promo-svg-label"
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
