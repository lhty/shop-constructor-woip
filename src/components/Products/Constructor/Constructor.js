import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { ITEM_QUERY, PROPORTION_QUERY } from "../../../containers/Queries";

import { ThumbnailUrl } from "../../../containers/ThumbnailUrls";
import boxsvg from "../../../resources/img/constructorBox.svg";
import sweetssvg from "../../../resources/img/constructorSweets.svg";
import { useSpring, animated } from "react-spring";

import Gallery from "../../Gallery/Gallery";
import ProductCard from "../Shared/ProductCard";
import ProductSort from "../Shared/ProductSort";
import Pages from "../Shared/Pages";
import useProducts from "../../../hooks/useProducts";
import { usePagination } from "../../../hooks/usePagination";

import "./Constructor.css";

export default ({ state, setState }) => {
  return (
    <>
      <Info {...{ state, setState }} />
      <Box {...{ state, setState }} />
      <Summary {...{ state, setState }} />
    </>
  );
};

//--------------------------------------------------------------------

const Info = ({ state: { product, current_page }, setState }) => {
  return (
    <div className="Constructor-progress">
      <div
        style={{
          alignSelf: "center",
          marginRight: "10px",
          cursor: "pointer",
          backgroundColor: " #ffbb96",
        }}
        onClick={() =>
          setState({
            current_page: product ? current_page - 1 : -1,
            product: current_page > 0 ? product : null,
            details: null,
          })
        }
      >
        {current_page > 0 ? "Back" : "Close"}
      </div>

      <div
        onClick={() => setState({ current_page: 0, details: null })}
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
              Выбери упаковку
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

      {product && current_page > 0 && (
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
        </>
      )}
    </div>
  );
};

const Box = ({ state, setState }) => {
  switch (state.current_page) {
    case 1:
      return <Slots {...state} setState={setState} />;
    case 2:
      return <ItemPicker {...state} setState={setState} />;
    case 3:
      return <Details {...{ state, setState }} />;
    case 4:
      return <Reshuffle {...state} />;
    default:
      return <SelectBox {...{ setState }} />;
  }
};

const SelectBox = ({ setState }) => {
  const { data, error, loading } = useQuery(PROPORTION_QUERY);

  if (loading || error) return <></>;
  return (
    <div className="boxselector-wrapper">
      {data?.proportions
        .filter((item) => item.construct)
        .map((size, i) => (
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
      scale: 0,
    },
    opacity: 1,
    scale: 1,
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
            <span
              onClick={() => setState({ current_page: 2 })}
              role="img"
              aria-label="candy"
            >
              🍬
            </span>
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
          <ProductCard
            {...{ key: index, product }}
            onClick={() => setState({ current_page: 3, details: product })}
          />
        ))}
      </div>
      <Pages {...controls} />
    </>
  );
};

const Details = ({ state, setState }) => {
  const [quantity, set] = useState(1);

  return (
    <div className="item-container">
      {state.product && (
        <div className="item-container-buttons">
          <>
            <div className="item-container-buttons-control">
              {!state.details.editable && (
                <button onClick={() => set(quantity - 1)}>-</button>
              )}
              <p>{quantity} шт</p>
              {!state.details.editable && (
                <button onClick={() => set(quantity + 1)}>+</button>
              )}
            </div>
            <button className="item-container-buttons-add" onClick={() => {}}>
              Добавить
            </button>
          </>
        </div>
      )}
      {state.details.editable ? (
        <form onSubmit={null}>
          <input
            required
            maxLength={null}
            value={""}
            onChange={(e) => {
              console.log(e.target.value);
            }}
          ></input>
        </form>
      ) : (
        <div className="item-container-info">
          <div className="item-container-info-details">
            <div className="item-container-info-details-size">
              <p>длинна : {state.details.size_length} мм</p>
              <p>высота : {state.details.size_height} мм</p>
              <p>ширина : {state.details.size_width} мм</p>
              <p>вес : {state.details.weight} грамм</p>
            </div>
            <div className="item-container-info-details-specs">
              <p>вкус : {state.details.taste}</p>
              <p>шоколад : {state.details.chocolate}</p>
            </div>
          </div>
          <div className="item-container-info-gallery">
            <Gallery image={state.details.image} />
          </div>
        </div>
      )}
      <div className="item-container-details">
        <h1 className="item-container-title">{state.details.name}</h1>
        <p className="item-container-description">
          {state.details.description}
        </p>
      </div>
      <div className="item-container-quantity">
        <p>{quantity} шт</p>
        <p>{quantity * state.details.price} руб</p>
      </div>
    </div>
  );
};

const Reshuffle = () => {
  return <div>Reshuffle</div>;
};

const Summary = () => {
  return (
    <div
      style={{
        alignSelf: "center",
        backgroundColor: " #ffbb96",
      }}
    >
      Summary
    </div>
  );
};
