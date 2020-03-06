import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../Providers/Queries";
import { useInterval } from "../Hooks/useInterval";
import Gallery from "../Gallery/Gallery";

import { useSpring, useTransition, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

import border from "../../img/promoborder.svg";
import "./Promo.css";

const Promo = ({ ScreenWidth }) => {
  const { data, error, loading } = useQuery(PROMO_QUERY);
  const [pages, setPages] = useState([]);
  const [index, setIndex] = useState(0);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setPages(loading || error ? [] : data.promos);
  }, [loading, error, data, setPages]);

  const [collapse, setCollapse] = useState(false);

  useInterval(
    () => {
      if (!collapse) {
        set({
          to: [
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1 }
          ]
        });
        setIndex(index === pages.length - 1 ? 0 : index + 1);
      }
    },
    20,
    reset
  );

  const container = useSpring({
    from: { y: -500, opacity: 0 },
    opacity: 1,
    y: 0,
    config: { mass: 1, tension: 300, friction: 40 }
  });

  const transitions = useTransition(collapse, null, {
    from: { opacity: 0, y: -500, display: `none` },
    enter: { opacity: 1, y: 0, display: `block` },
    leave: { opacity: 0, y: -500, display: `none` }
  });

  const [{ x, opacity, filter }, set] = useSpring(() => ({
    filter: `brightness(1)`,
    opacity: 1,

    x: 0,
    config: { mass: 1, tension: 50, friction: 12 }
  }));

  const [prev, setPrev] = useSpring(() => ({
    transform: `scaleX(-1)`,
    scale: 1,
    opacity: 0.15,
    top: `60%`,
    left: 0,
    x: 0
  }));
  const [next, setNext] = useSpring(() => ({
    opacity: 0.15,
    scale: 1,
    top: `60%`,
    right: 0,
    x: 0
  }));
  const [expand, setExpand] = useSpring(() => ({
    transform: `rotate(90deg)`,
    scale: 1,
    opacity: 0.15,
    right: ScreenWidth > 800 ? `50%` : `1%`,
    y: ScreenWidth > 800 ? 0 : -40
  }));

  const bind = useDrag(
    ({ cancel, down, direction: [Xdir], movement: [mx], vxvy: [vx] }) => {
      set({
        x: down
          ? Math.abs(mx) > ScreenWidth / 6
            ? Xdir > 0
              ? ScreenWidth
              : -ScreenWidth
            : mx + vx
          : 0,

        filter: down ? `brightness(1.05)` : `brightness(1)`
      });
      if (down) {
        setPrev({
          to: [
            { x: 10, scale: 1.5, opacity: 0.75 },
            { x: 0, scale: 1, opacity: 0.15 }
          ]
        });
        setNext({
          to: [
            { x: -10, scale: 1.5, opacity: 0.75 },
            { x: 0, scale: 1, opacity: 0.15 }
          ]
        });
        return Xdir < 0 && mx < -10
          ? setPrev({
              to: [
                { x: 50, opacity: 1 },
                { x: 0, opacity: 0.15 }
              ]
            })
          : Xdir > 0 && mx > 10
          ? setNext({
              to: [
                { x: -50, opacity: 1 },
                { x: 0, opacity: 0.15 }
              ]
            })
          : null;
      }
      if (Math.abs(mx) > ScreenWidth / 20)
        cancel(Xdir > 0 ? handleChange(true) : handleChange(false));
    },
    { dragDelay: 100 }
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
    setReset(!reset);
  };

  const hadleExpand = () => {
    setCollapse(!collapse);
    setExpand({
      to: [
        { opacity: 0.75, scale: 1.5 },
        {
          opacity: 0.15,
          scale: 1,
          transform: `rotate(${collapse ? `90deg` : `-90deg`})`
        }
      ]
    });
  };
  return (
    <animated.aside style={container}>
      <aside className="Promo-container">
        <animated.div
          style={prev}
          className="Promo-button"
          onClick={() => {
            handleChange(false);
            setPrev({
              to: [
                { opacity: 0.75, scale: 1.5 },
                {
                  opacity: 0.15,
                  scale: 1
                }
              ]
            });
          }}
        />
        <animated.div
          className="Promo-content"
          {...bind()}
          style={{ x, opacity, filter }}
        >
          {pages[index] &&
            transitions.map(({ item, key, props }) =>
              item ? (
                <animated.div key={key} style={{ ...props }}>
                  <div className="Banner-wrapper">
                    <h1>{pages[index].title}</h1>
                    <p>{pages[index].description}</p>
                    <Gallery
                      image={pages[index].promo_banners}
                      isPromo={true}
                    />
                  </div>
                </animated.div>
              ) : (
                <animated.div key={key} style={props} className="Banner-text">
                  <h1>{pages[index].title}</h1>
                  <p>
                    {pages[index].description.length > 200 &&
                      pages[index].description.substring(0, 200) + " ..."}
                  </p>
                </animated.div>
              )
            )}
        </animated.div>
        <animated.div
          style={next}
          className="Promo-button"
          onClick={() => {
            handleChange(true);
            setNext({
              to: [
                { opacity: 0.75, scale: 1.5 },
                {
                  opacity: 0.15,
                  scale: 1
                }
              ]
            });
          }}
        ></animated.div>
      </aside>
      <animated.div
        onClick={hadleExpand}
        className="Promo-button"
        style={expand}
      ></animated.div>
      <img
        style={{ cursor: `pointer` }}
        onClick={hadleExpand}
        src={border}
        alt=""
        draggable="false"
      />
    </animated.aside>
  );
};

export default Promo;
