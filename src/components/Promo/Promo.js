import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../Providers/Queries";
import { API_URL } from "../../config";
import { useInterval } from "../Providers/Hooks/useInterval";
import Spinner from "../Assets/Spinner";

import { useSpring, config, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

import border from "../../img/promoborder.svg";
import "./Promo.css";

const Promo = () => {
  const { data, error, loading } = useQuery(PROMO_QUERY);
  const [pages, setPages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setPages(loading || error ? [] : data.promos);
  }, [loading, error, data, setPages]);

  const [collapse, setCollapse] = useState(false);

  useInterval(() => {
    if (!collapse) setIndex(index === pages.length - 1 ? 0 : index + 1);
  }, 35000);

  const [{ x, opacity, scale }, set] = useSpring(() => ({
    opacity: 1,
    scale: 1,
    config: config.gentle
  }));
  const bind = useDrag(
    ({
      down,
      movement: [mx],
      opacity,
      scale,
      distance,
      direction: [Xdir],
      velocity,
      offset: [Xoff]
    }) => {
      if (Xdir < 0 && distance > 250) {
        setTimeout(
          () => setIndex(index < pages.length - 1 ? index + 1 : 0),
          300
        );
      }
      if (Xdir > 0 && distance > 250) {
        setTimeout(
          () => setIndex(index === 0 ? pages.length - 1 : index - 1),
          300
        );
      }
      set([
        {
          x: down
            ? mx
            : set({
                to: [
                  { opacity: 0, scale: 1.5 },
                  { opacity: 1, x: 0, scale: 1 }
                ]
              }),
          scale: down ? (distance > 150 ? 0.3 : 1.2) : 1
        }
      ]);
    }
  );

  return (
    <>
      <section className="Promo-container">
        {!collapse && (
          <div className="Promo-buttons">
            <button
              className="Promo-button prev"
              type="button"
              onClick={() =>
                setIndex(index === 0 ? pages.length - 1 : index - 1)
              }
            ></button>
            <button
              className="Promo-button"
              type="button"
              onClick={() =>
                setIndex(index === pages.length - 1 ? 0 : index + 1)
              }
            ></button>
          </div>
        )}
        {loading ? (
          <Spinner />
        ) : (
          <animated.div {...bind()} style={{ x, opacity, scale }}>
            <Banner
              banner={pages[index]}
              collapse={collapse}
              setCollapse={setCollapse}
            />
          </animated.div>
        )}
      </section>
      <img className="Promo-bottom" src={border} alt="" />
    </>
  );
};

const Banner = ({ banner, collapse, setCollapse }) => {
  return (
    <>
      {banner ? (
        <div className="Banner-wrapper">
          <div className="Banner-text">
            <h1>{banner.title}</h1>
            {/* <p onClick={() => setCollapse(!collapse)}> */}
            <p>
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
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Promo;
