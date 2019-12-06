import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../Providers/Queries";
import { API_URL } from "../../config";
import { ThumbnailUrl } from "../Providers/ThumbnailUrls";
import { useInterval } from "../Providers/Hooks/useInterval";

import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

import border from "../../img/promoborder.svg";
import "./Promo.css";

const Promo = ({ ScreenWidth }) => {
  const { data, error, loading } = useQuery(PROMO_QUERY);
  const [pages, setPages] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setPages(loading || error ? [] : data.promos);
  }, [loading, error, data, setPages]);

  const [collapse, setCollapse] = useState(false);

  useInterval(() => {
    if (!collapse) {
      set({
        to: [
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1 }
        ]
      });
      setIndex(index === pages.length - 1 ? 0 : index + 1);
    }
  }, 35000);

  const [{ x, opacity, scale }, set] = useSpring(() => ({
    from: { x: ScreenWidth, opacity: 0, scale: 0.95 },
    opacity: 1,
    x: 0,
    config: { mass: 1, tension: 300, friction: 20 }
  }));
  const bind = useDrag(
    ({
      reverse,
      reset,
      cancel,
      down,
      movement: [mx],
      delta: [dx, dy],
      direction: [Xdir],
      offset: [Xoff]
    }) => {
      down && Math.abs(mx) > ScreenWidth / 10
        ? Xdir > 0
          ? cancel(setIndex(index === 0 ? pages.length - 1 : index - 1))
          : cancel(setIndex(index < pages.length - 1 ? index + 1 : 0))
        : set({
            opacity: down && Math.abs(mx) > ScreenWidth / 5 ? 0 : 1,
            scale: down ? 1.05 : 1
          });
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
              onClick={() => {
                set({
                  to: [
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1 }
                  ]
                });
                setIndex(index === 0 ? pages.length - 1 : index - 1);
              }}
            ></button>
            <button
              className="Promo-button"
              type="button"
              onClick={() => {
                set({
                  to: [
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1 }
                  ]
                });
                setIndex(index === pages.length - 1 ? 0 : index + 1);
              }}
            ></button>
          </div>
        )}
        <animated.div {...bind()} style={{ x, opacity, scale }}>
          <Banner
            banner={pages[index]}
            collapse={collapse}
            setCollapse={setCollapse}
          />
        </animated.div>
      </section>
      <img className="Promo-bottom" src={border} alt="" />
    </>
  );
};

const Banner = ({ banner, collapse, setCollapse }) => {
  return (
    <>
      {banner && (
        <div className="Banner-wrapper">
          <div className="Banner-text">
            <h1>{banner.title}</h1>

            <p>
              {!collapse
                ? banner.description.length > 200 &&
                  banner.description.substring(0, 200) + " ..."
                : banner.description}
            </p>
          </div>
          {/* <img
            className="Banner-img"
            src={ThumbnailUrl(banner.promo_banners)}
            alt=""
            draggable="false"
          ></img> */}
        </div>
      )}
    </>
  );
};

export default Promo;
