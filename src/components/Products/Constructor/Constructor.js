import React, { useReducer } from "react";
import { useQuery } from "react-apollo-hooks";
import { ThumbnailUrl } from "../../Providers/ThumbnailUrls";
import sweetssvg from "../../../img/constructorSweets.svg";
import boxsvg from "../../../img/constructorBox.svg";
import { useSpring, animated } from "react-spring";

import ProductCard from "../Shared/ProductCard";
import ProductSort from "../Shared/ProductSort";
import Pages from "../Shared/Pages";
import useProducts from "../../Hooks/useProducts";
import { usePagination } from "../../Hooks/usePagination";

import { ITEM_QUERY } from "../../Providers/Queries";
import { PROPORTION_QUERY } from "../../Providers/Queries";

import "./Constructor.css";

const Constructor = () => {
  const [state, setState] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      current_page: 0,
      product: null,
      details: null,
    }
  );

  const { data, error, loading } = useQuery(PROPORTION_QUERY);

  const styleProps = useSpring({
    config: { mass: 1, tension: 280, friction: 40 },
    width: state.product || state.details ? `100%` : `20%`,
  });

  if (loading || error) return <></>;
  return (
    <animated.div className="Constructor" style={styleProps}>
      {/* {console.log(state)} */}
      <Info {...state} setState={setState} />
      <Box
        {...{ state, setState }}
        sizes={data.proportions.filter((item) => item.construct)}
      />
      <Summary />
    </animated.div>
  );
};

//--------------------------------------------------------------------

const Info = ({ product, setState }) => {
  return (
    <div className="Constructor-progress">
      <div
        onClick={() => setState({ current_page: 0, product: null })}
        className={product ? "Constructor-stage" : "Constructor-stage empty"}
      >
        <img src={boxsvg} alt="" draggable="false" />
        <div className="Constructor-stage-info">
          {!product ? (
            <p
              style={{
                lineHeight: "15px",
                letterSpacing: "0",
                textAlign: `center`,
              }}
            >
              Собери свой набор
            </p>
          ) : (
            product.proportion && (
              <>
                <p>{product.proportion.type}</p>{" "}
                <p>{product.proportion.shape}</p>
              </>
            )
          )}
        </div>
      </div>
      {product && (
        <>
          <div
            onClick={() => setState({ current_page: 1 })}
            className={
              product.set && product.set.filter((obj) => obj).length > 0
                ? "Constructor-stage"
                : "Constructor-stage empty"
            }
          >
            <img src={sweetssvg} alt="" draggable="false" />
            {product.set && (
              <p>
                {product.set && product.set.filter((obj) => obj).length} /{" "}
                {product.proportion.countmin}
              </p>
            )}
          </div>
          {/* <div
        className={
          compose ? "Constructor-stage" : "Constructor-stage empty"
        }
      >
        <img src={done} alt="" />
      </div> */}
        </>
      )}
    </div>
  );
};

const Box = ({ sizes, state, setState }) => {
  switch (state.current_page) {
    case 1:
      return <Slots {...state} setState={setState} />;
    case 2:
      return <ItemPicker {...state} setState={setState} />;
    case 3:
      return <Reshuffle {...state} />;
    default:
      return <SelectBox {...{ sizes, setState }} />;
  }
};

const SelectBox = ({ sizes, setState }) => {
  return (
    <div className="boxselector-wrapper">
      {sizes.map((size, i) => (
        <div
          className="boxselector-slot"
          onClick={() => {
            let _id =
              new Date().getTime() + Math.floor(Math.random(size.countmin));
            setState({
              product: {
                name: `Custom bundle ${_id}`,
                proportion: size,
                set: new Array(size.countmin).fill(false),
              },
              current_page: 1,
            });
          }}
          key={i}
        >
          <div
            className={
              size.shape === "Сердце"
                ? `box-shape heart`
                : size.shape === "Квадрат"
                ? `box-shape square`
                : `box-shape rectangle`
            }
          />
          <div className="boxselector-slot-info">
            <p>
              Вместимость : {size.countmin}-{size.countmax} шт.
            </p>
            <p>Тип : {size.type}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Slots = ({ product, setState }) => {
  const style_props = useSpring({
    from: {
      opacity: 0,
      width: `${(2500 / product.proportion.x).toFixed()}%`,
      margin: 0,
    },
    opacity: 1,
    width: `${(2500 / product.proportion.x).toFixed()}%`,
    margin: 10,
    minHeight: "50px",
  });

  return (
    <div className="box-wrapper">
      {product.set.map((slot, i) => (
        <animated.div
          key={i}
          style={{
            ...style_props,
            backgroundImage: `url(${
              slot && slot.image.length > 0 && ThumbnailUrl(slot.image, "sm")
            })`,
          }}
          className="slot-wrapper"
        >
          {slot && (
            <div
              className="slot-wrapper-del"
              onClick={() => console.log("del slot")}
            >
              +
            </div>
          )}
          {!slot ? (
            <span onClick={() => setState({ current_page: 2 })}>+</span>
          ) : slot.editable ? (
            <h1 onClick={() => console.log("dunno")}>{slot.letter}</h1>
          ) : slot.image.length > 0 ? (
            <div
              style={{ width: "100%", height: "100%" }}
              onClick={() => console.log("woot")}
            ></div>
          ) : (
            slot.image.length < 1 && <p>{slot.name}</p>
          )}
        </animated.div>
      ))}
    </div>
  );
};

const ItemPicker = ({ setState }) => {
  const {
    output: { filtered, sortProps },
    dispatch,
  } = useProducts(ITEM_QUERY);

  const { currentPage, controls } = usePagination(filtered, 30);

  return (
    <>
      <ProductSort {...{ sortProps, dispatch, controls }} />
      <div className="Item-list">
        {currentPage.map((product, index) => (
          <ProductCard {...{ key: index, product }} />
        ))}
      </div>
      <Pages {...controls} />
    </>
  );
};

const Reshuffle = () => {
  return <div></div>;
};

const Summary = () => {
  return <div></div>;
};

export default Constructor;
