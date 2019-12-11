import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../Providers/Queries";
import { useInterval } from "../Providers/Hooks/useInterval";
import Gallery from "../Gallery/Gallery";
import Spinner from "../Assets/Spinner";

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
    from: { y: -500 },
    y: 0,
    config: { mass: 1, tension: 300, friction: 40 }
  });

  const transitions = useTransition(collapse, null, {
    from: { opacity: 0, y: -500, display: `none` },
    enter: { opacity: 1, y: 0, display: `block` },
    leave: { opacity: 0, y: -500, display: `none` }
  });

  const [{ x, y, opacity, filter }, set] = useSpring(() => ({
    filter: `brightness(1)`,
    opacity: 1,
    y: 0,
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
    right: `50%`,
    y: 0
  }));

  const bind = useDrag(
    ({
      cancel,
      down,
      direction: [Xdir, Ydir],
      movement: [mx, my],
      vxvy: [vx]
    }) => {
      set({
        x:
          my < 1 && down
            ? Math.abs(mx) > ScreenWidth / 6
              ? Xdir > 0
                ? ScreenWidth
                : -ScreenWidth
              : mx + vx
            : 0,
        y: Math.abs(mx) < 5 && down && Ydir > 0 ? my : 0,
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
        setExpand({
          to: [
            { y: -5, scale: 1.5, opacity: 0.75 },
            { y: 0, scale: 1, opacity: 0.1 }
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
          : Ydir > 0 && my > 10
          ? setExpand({
              to: [
                { y: -20, opacity: 1 },
                {
                  y: 0,
                  opacity: 0.1,
                  transform: `rotate(${collapse ? `90deg` : `-90deg`})`
                }
              ]
            })
          : null;
      }
      if (Math.abs(mx) > ScreenWidth / 20)
        cancel(Xdir > 0 ? handleChange(true) : handleChange(false));
      if (Math.abs(my) > 50 && Ydir > 0) cancel(setCollapse(!collapse));
    },
    { dragDelay: 500 }
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
  return (
    <animated.div style={container}>
      <section className="Promo-container">
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
          style={{ x, y, opacity, filter }}
        >
          {!pages[index] ? (
            <Spinner />
          ) : (
            transitions.map(({ item, key, props }) =>
              item ? (
                <animated.div key={key} style={{ ...props }}>
                  <div className="Banner-wrapper">
                    <h1>{pages[index].title}</h1>
                    <p>{pages[index].description}</p>
                    <Gallery image={pages[index].promo_banners} />
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
      </section>
      <animated.div
        className="Promo-button"
        style={expand}
        onClick={() => {
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
        }}
      ></animated.div>
      <img src={border} alt="" />
    </animated.div>
  );
};

export default Promo;
