import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../Providers/Queries";
import { API_URL } from "../../config";
import { useInterval } from "../Providers/Hooks/useInterval";

import { useSpring, animated } from "react-spring";

import border from "../../img/promoborder.svg";
import "./Promo.css";

const Promo = () => {
  const { data, error, loading } = useQuery(PROMO_QUERY);
  const [index, setIndex] = useState(0);
  const [collapse, setCollapse] = useState(false);
  useInterval(() => {
    if (!collapse) setIndex(index === data.promos.length - 1 ? 0 : index + 1);
  }, 35000);

  const animatedProps = useSpring({
    to: [
      { transform: `translateX(100%)`, opacity: 0 },
      { transform: `translateX(0)`, opacity: 1 }
    ]
  });

  if (loading || error) return <></>;

  return (
    <>
      <section className="Promo-container">
        {!collapse && (
          <div className="Promo-buttons">
            <button
              className="Promo-button prev"
              type="button"
              onClick={() =>
                setIndex(index === 0 ? data.promos.length - 1 : index - 1)
              }
            ></button>
            <button
              className="Promo-button"
              type="button"
              onClick={() =>
                setIndex(index === data.promos.length - 1 ? 0 : index + 1)
              }
            ></button>
          </div>
        )}

        <div className="Promo-banner">
          <animated.div style={animatedProps}>
            <Banner
              banner={data.promos[index]}
              collapse={collapse}
              setCollapse={setCollapse}
            />
          </animated.div>
        </div>
      </section>
      <img className="Promo-bottom" src={border} alt="" />
    </>
  );
};

const Banner = ({ banner, collapse, setCollapse }) => {
  return (
    <div className="Banner-wrapper">
      <div className="Banner-text">
        <h1>{banner.title}</h1>
        <p onClick={() => setCollapse(!collapse)}>
          {!collapse
            ? banner.description.length > 200 &&
              banner.description.substring(0, 200) + " ..."
            : banner.description}
        </p>
      </div>
      {collapse && banner.promo_banners[0] && (
        <img
          className="Banner-img"
          src={`${API_URL}${banner.promo_banners[0].url}`}
          alt=""
          draggable="false"
        ></img>
      )}
    </div>
  );
};

export default Promo;
