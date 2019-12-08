import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../Providers/Queries";
import { useInterval } from "../Providers/Hooks/useInterval";
import Gallery from "../Gallery/Gallery";
import Spinner from "../Assets/Spinner";

import { useSpring, animated, to } from "react-spring";
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

  const [{ offsetY }] = useSpring(() => ({
    from: { offsetY: -200 },
    offsetY: 0,
    config: { mass: 1, tension: 180, friction: 12 }
  }));

  const [{ x, y, opacity }, set] = useSpring(() => ({
    opacity: 1,
    y: 0,
    x: 0,
    config: { mass: 1, tension: 50, friction: 12 }
  }));
  const bind = useDrag(
    ({
      cancel,
      down,
      direction: [Xdir, Ydir],
      movement: [mx, my],
      vxvy: [vx, vy]
    }) => {
      set({
        x:
          my < 10 && down
            ? Math.abs(mx) > ScreenWidth / 6
              ? Xdir > 0
                ? ScreenWidth
                : -ScreenWidth
              : mx + vx
            : 0,
        y: mx < 5 && down && my > 0 ? my : 0
      });
      if (Math.abs(mx) > ScreenWidth / 6)
        cancel(Xdir > 0 ? handleChange(true) : handleChange(false));
      if (Math.abs(my) > ScreenWidth / 20) cancel(setCollapse(!collapse));
    }
  );

  const handleChange = direction => {
    set({
      opacity: 0
    });
    setTimeout(() => {
      set({ x: 0, opacity: 1 });
      setIndex(
        direction
          ? index === pages.length - 1
            ? 0
            : index + 1
          : index === 0
          ? pages.length - 1
          : index - 1
      );
    }, 1200);
  };

  return (
    <animated.div
      style={{
        transform: to(offsetY, off => `translateY(${off}px)`),
        position: `relative`
      }}
    >
      <section className="Promo-container">
        {!collapse && (
          <div className="Promo-buttons">
            <button
              className="Promo-button prev"
              type="button"
              onClick={() => handleChange(false)}
            ></button>
            <button
              className="Promo-button"
              type="button"
              onClick={() => handleChange(true)}
            ></button>
          </div>
        )}
        {!collapse ? (
          <animated.div
            className="Promo-content"
            {...bind()}
            style={{ x, y, opacity }}
          >
            {!pages[index] ? (
              <Spinner />
            ) : (
              <div className="Banner-text">
                <h1>{pages[index].title}</h1>
                <p>
                  {pages[index].description.length > 200 &&
                    pages[index].description.substring(0, 200) + " ..."}
                </p>
              </div>
            )}
          </animated.div>
        ) : (
          <Banner
            banner={pages[index]}
            collapse={collapse}
            setCollapse={setCollapse}
          />
        )}
      </section>
      <button
        className="Promo-expand"
        style={{ transform: `rotate(${collapse ? `-90` : `90`}deg)` }}
        type="button"
        onClick={() => {
          setCollapse(!collapse);
        }}
      ></button>
      <img src={border} alt="" />
    </animated.div>
  );
};

const Banner = ({ banner, collapse }) => {
  const props = useSpring({
    from: { opacity: 0, scale: 0.95 },
    opacity: 1,
    scale: 1
  });

  return (
    <>
      {banner && (
        <animated.div style={props} className="Banner-wrapper">
          <h1>{banner.title}</h1>
          <p>{banner.description}</p>
          <Gallery image={banner.promo_banners} />
        </animated.div>
      )}
    </>
  );
};

export default Promo;
