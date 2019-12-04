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
    to: { opacity: 1, scale: 1 },
    config: { duration: 250 }
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
      if (Xdir < 0 && velocity > 0.99 && distance > 300) {
        setTimeout(
          () => setIndex(index < pages.length - 1 ? index + 1 : 0),
          300
        );
      }
      if (Xdir > 0 && velocity > 0.99 && distance > 300) {
        setTimeout(
          () => setIndex(index === 0 ? pages.length - 1 : index - 1),
          300
        );
      }
      set([
        {
          x: down
            ? distance < 50
              ? 0
              : mx * velocity
            : set({
                to: async next => {
                  await next({ opacity: distance < 300 ? 1 : 0 });
                  distance > 300 &&
                    (await next({ x: Xdir < 0 ? 3000 : -3000 }));
                  await next({ opacity: 1 });
                  await next({ x: 0 });
                }
              }),
          scale: down ? 1.05 : 1
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
