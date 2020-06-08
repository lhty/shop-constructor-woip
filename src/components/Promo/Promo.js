import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../../store/Queries";
import { useInterval } from "../../hooks/useInterval";
import Gallery from "../Gallery/Gallery";

import useDoubleclick from "../../hooks/useDoubleclick";
import useResizeAware from "react-resize-aware";

import { useSpring, useTransition, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

import "./Promo.css";

const Promo = () => {
  const { data, error, loading } = useQuery(PROMO_QUERY);
  const [pages, setPages] = useState([]);
  const [index, setIndex] = useState(0);
  const [reset, setReset] = useState(false);

  const [resizeListener, sizes] = useResizeAware();

  useEffect(() => {
    setPages(loading || error ? [] : data.promos);
  }, [loading, error, data, setPages]);

  const [isOpen, toggle] = useState(false);

  useInterval(
    () => {
      if (!isOpen) {
        set({
          to: [
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1 },
          ],
        });
        setIndex(index === pages.length - 1 ? 0 : index + 1);
      }
    },
    20,
    reset
  );

  const handleExpand = useDoubleclick(() => toggle(!isOpen), 250);

  const container = useSpring({
    from: { y: -500 },
    height: 10 + sizes.height,
    y: 0,
    config: { mass: 1, tension: 300, friction: 40 },
  });

  const transitions = useTransition(isOpen, null, {
    from: { opacity: 0, y: -500, display: `none` },
    enter: { opacity: 1, y: 0, display: `block` },
    leave: { opacity: 0, y: -500, display: `none` },
  });

  const [{ x, opacity, filter }, set] = useSpring(() => ({
    filter: `brightness(1)`,
    opacity: 1,
    x: 0,
    config: { mass: 1, tension: 50, friction: 12 },
  }));

  const bind = useDrag(
    ({ cancel, down, direction: [Xdir], movement: [mx], vxvy: [vx] }) => {
      set({
        x: down
          ? Math.abs(mx) > window.innerWidth / 6
            ? Xdir > 0
              ? window.innerWidth
              : -window.innerWidth
            : mx + vx
          : 0,

        filter: down ? `brightness(1.05)` : `brightness(1)`,
      });

      if (Math.abs(mx) > window.innerWidth / 20)
        cancel(Xdir > 0 ? handleChange(true) : handleChange(false));
    },
    { dragDelay: 100 }
  );

  const handleChange = (direction) => {
    set({
      opacity: 0,
    });
    setTimeout(() => {
      set({ x: 0, opacity: 1 });
      isOpen && toggle(!isOpen);
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

    setReset(!reset);
  };

  return (
    <animated.section
      style={container}
      className="Promo-container main-bg w85 center"
    >
      <animated.div
        className="Promo-content"
        onClick={() => handleExpand()}
        {...bind()}
        style={{ x, opacity, filter }}
      >
        {resizeListener}
        {pages[index] &&
          transitions.map(({ item, key, props }) =>
            item ? (
              <animated.div key={key} style={{ ...props }}>
                <div className="Banner-wrapper">
                  <h2>{pages[index].title}</h2>
                  <p>{pages[index].description}</p>
                  <Gallery image={pages[index].promo_banners} isPromo={true} />
                </div>
              </animated.div>
            ) : (
              <animated.div key={key} style={props} className="Banner-text">
                <h2>{pages[index].title}</h2>
                <p>
                  {pages[index].description.length > 200 &&
                    pages[index].description.substring(0, 200) + " ..."}
                </p>
              </animated.div>
            )
          )}
        <div onClick={() => toggle(!isOpen)} className="arrow-icon">
          <span className={isOpen ? "left-bar open" : "left-bar"}></span>
          <span className={isOpen ? "right-bar openr" : "right-bar"}></span>
        </div>
      </animated.div>
    </animated.section>
  );
};

export default Promo;
