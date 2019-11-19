import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROMO_QUERY } from "../Providers/Queries";
import Spinner from "../Assets/Spinner";
import { API_URL } from "../../config";
import { useInterval } from "../Providers/Hooks/useInterval";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

import border from "../../img/promoborder.svg";
import "./Promo.css";

const Promo = () => {
  const { data, error, loading } = useQuery(PROMO_QUERY);
  const [index, setIndex] = useState(0);
  const [collapse, setCollapse] = useState(false);
  useInterval(() => {
    if (!collapse) setIndex(index === data.promos.length - 1 ? 0 : index + 1);
  }, 35000);

  if (loading || error) return <Spinner />;

  return (
    <>
      <section className="Promo-container">
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
        <div className="Promo-banner">
          <Banner
            banner={data.promos[index]}
            collapse={collapse}
            setCollapse={setCollapse}
            next={() =>
              setIndex(index === data.promos.length - 1 ? 0 : index + 1)
            }
            prev={() =>
              setIndex(index === 0 ? data.promos.length - 1 : index - 1)
            }
          />
        </div>
      </section>
      <img className="Promo-bottom" src={border} alt="" />
    </>
  );
};

const Banner = ({ banner, collapse, setCollapse, next, prev }) => {
  const [{ x }, set] = useSpring(() => ({ x: 0 }));
  const bind = useDrag(({ down, movement: [mx, _] }) => {
    set({ x: down ? mx : mx });
    if (mx > 600) next();
    if (mx < -600) prev();
  });
  return (
    <animated.div
      className="Banner-wrapper"
      onClick={() => setCollapse(!collapse)}
      {...bind()}
      style={{ x }}
    >
      <div className="Banner-text">
        <h1>{banner.title}</h1>
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
        ></img>
      )}
    </animated.div>
  );
};

export default Promo;
