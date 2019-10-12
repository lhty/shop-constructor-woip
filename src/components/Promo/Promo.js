import React, { useContext, useState } from 'react';
import { Context } from '../Providers/Provider';
import { useInterval } from '../Providers/Hooks/useInterval';
import { useQuery } from 'react-apollo-hooks';
import { API_URL } from '../../config';

import './Promo.css';

const Promo = () => {
  const { PROMO_QUERY } = useContext(Context);
  const { data, error, loading } = useQuery(PROMO_QUERY);
  const [current, setCurrent] = useState(0);

  useInterval(() => {
    setCurrent(current === data.promos.length - 1 ? 0 : current + 1);
  }, 35000);

  if (loading || error) return <></>;

  return (
    <>
      <section className="Promo-container">
        <div className="Promo">
          <button
            className="Promo-prev"
            type="button"
            onClick={() => {
              setCurrent(current === 0 ? data.promos.length - 1 : current - 1);
            }}
          ></button>
          <div className="Promo-banner">
            {data.promos.length > 0 ? (
              <img
                className="Promo-img"
                src={`${API_URL}${
                  data.promos.map(banner => banner.promo_banners[0].url)[
                    current
                  ]
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
              setCurrent(current === data.promos.length - 1 ? 0 : current + 1);
            }}
          ></button>
        </div>
      </section>
    </>
  );
};

export default Promo;
