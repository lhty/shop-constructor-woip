import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../../store/Queries";
import { useInterval } from "../../hooks/useInterval";
import Gallery from "../Gallery/Gallery";

import useDoubleclick from "../../hooks/useDoubleclick";

import { useSpring, a } from "react-spring";
import { useDrag } from "react-use-gesture";

import "./Promo.css";

const Promo = () => {
  const { data, error, loading } = useQuery(PROMO_QUERY);
  const [index, setIndex] = useState(0);
  const [reset, setReset] = useState(false);

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
        setIndex(index === data.promos.length - 1 ? 0 : index + 1);
      }
    },
    20,
    reset
  );

  const handleExpand = useDoubleclick(() => toggle(!isOpen), 250);

  const [{ x, opacity }, set] = useSpring(() => ({
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
          ? index === data.promos.length - 1
            ? 0
            : index + 1
          : index === 0
          ? data.promos.length - 1
          : index - 1
      );
    }, 1200);

    setReset(!reset);
  };

  if (loading || error) return null;

  return (
    <section className="Promo-container">
      <a.div
        className="Promo-content"
        onClick={() => handleExpand()}
        {...bind()}
        style={{ x, opacity }}
      >
        <div className="Banner-text">
          <h2>{data.promos[index].title}</h2>
          <p>
            {isOpen
              ? data.promos[index].description
              : data.promos[index].description.substring(0, 200) + " ..."}
          </p>
          {isOpen && <Gallery image={data.promos[index].promo_banners} />}
        </div>
        <div onClick={() => toggle(!isOpen)} className="arrow-icon">
          <span className={isOpen ? "left-bar open" : "left-bar"}></span>
          <span className={isOpen ? "right-bar openr" : "right-bar"}></span>
        </div>
      </a.div>
    </section>
  );
};

export default Promo;
