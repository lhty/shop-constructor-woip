import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import Sortable from "react-sortablejs";

import { ITEM_QUERY, PROPORTION_QUERY } from "../../../store/Queries";
import { ThumbnailUrl } from "../../../store/Utils";
// import { UserContext } from "../../../store/UserProvider";
// import boxsvg from "../../../resources/img/constructorBox.svg";
import sweetssvg from "../../../resources/img/constructorSweets.svg";
import { useSpring, animated } from "react-spring";

import Gallery from "../../Gallery/Gallery";
import ProductCard from "../Shared/ProductCard";
import ProductSort from "../Shared/ProductSort";
import Pages from "../Shared/Pages";
import { useSort } from "../../../hooks/useSort";
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
            current_page: product
              ? current_page > 3
                ? current_page - 3
                : current_page - 1
              : -1,
            product: current_page > 1 ? product : null,
            details: null,
          })
        }
      >
        {current_page > 1 && product ? "Back" : "Close"}
      </div>

      {/* <div
        // onClick={() => setState({ current_page: 0, details: null })}
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
            product.proportion && <p>{product.proportion.type}</p>
          )}
        </div>
      </div> */}

      {product && (
        <div
          onClick={() => setState({ current_page: 1 })}
          className={
            product.set?.filter(Boolean).length > 0
              ? "Constructor-stage"
              : "Constructor-stage empty"
          }
        >
          <img src={sweetssvg} alt="" draggable="false" />
          <p>
            {product?.set.filter(Boolean).length} / {product?.set.length}
          </p>
        </div>
      )}
      {product &&
        product.set.filter(Boolean).length >= product.proportion.countmin && (
          <div
            style={{
              alignSelf: "center",
              marginRight: "10px",
              cursor: "pointer",
              backgroundColor: " #ffbb96",
            }}
            onClick={() => {
              current_page === 4
                ? console.log(
                    "schema-" +
                      product.set
                        .map((item) => item.letter || item.id)
                        .join(",")
                  )
                : setState({
                    current_page: 4,
                    details: null,
                  });
            }}
          >
            {current_page === 4 ? "Finish" : "Next"}
          </div>
        )}
    </div>
  );
};

const Box = ({ state, setState }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  switch (state.current_page) {
    case 1:
      return <Slots {...{ state, setState, setSelectedSlot }} />;
    case 2:
      return <ItemPicker {...{ setState }} />;
    case 3:
      return <Details {...{ state, setState, selectedSlot }} />;
    case 4:
      return <Reshuffle {...{ state }} />;
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
                  id: null,
                  name: `Custom bundle ${_id}`,
                  proportion: size,
                  set: new Array(size.countmin).fill(false),
                },
                current_page: 1,
              });
            }}
            key={i}
          >
            <div className="boxselector-slot-info">
              <p>
                {size.countmin}-{size.countmax} шт.
              </p>
              <p>{`${size.x / 10} x ${size.y / 10} x ${size.z / 10} см.`}</p>
              <p>{size.shape}</p>
              <p>{size.type}</p>
              <p>{size.price} руб.</p>
            </div>
          </div>
        ))}
    </div>
  );
};

const Slots = ({ state: { product }, setState, setSelectedSlot }) => {
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
    <>
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
                onClick={() => setState({ type: "REMOVE_ITEM", index: i })}
              >
                +
              </div>
            )}
            {!slot ? (
              <span
                onClick={() => {
                  setState({ current_page: 2 });
                  setSelectedSlot(i);
                }}
                role="img"
                aria-label="candy"
              >
                🍬
              </span>
            ) : slot.editable ? (
              <h1
                onClick={() => {
                  setState({ current_page: 2 });
                  setSelectedSlot(i);
                }}
              >
                {slot.letter}
              </h1>
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
      <div className="expand-wrapper">
        {Array.apply(null, {
          length: Math.max(product.proportion.countmax - product.set.length, 0),
        }).map(
          (_, index) =>
            product.set && (
              <div
                key={index}
                className="expand-slot-wrapper"
                onClick={() => setState({ type: "EXPAND" })}
              >
                +1
              </div>
            )
        )}
      </div>
    </>
  );
};

const ItemPicker = ({ setState }) => {
  const { data } = useQuery(ITEM_QUERY);
  const {
    output: { filtered, sortProps },
    dispatch,
  } = useSort(data?.items);

  const { currentPage, controls } = usePagination(filtered, 30);

  return (
    <>
      <ProductSort
        {...{
          sortProps,
          dispatch,
          controls,
          options: [
            ["Ключевые слова", "tags", data?.tags],
            ["Вкусы", "taste", data?.items],
            ["Номер", "id", data?.items],
            "price",
            "size",
          ],
        }}
      />
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

const Details = ({ state, setState, selectedSlot }) => {
  const [quantity, setQuantity] = useState(state.details.editable ? 0 : 1);
  const [input, setInput] = useState("");

  const _maxAddLimit = state?.product?.set.filter((item) => !item).length;
  const _fillInputRange = useSpring({
    width: `${(quantity * 100) / _maxAddLimit}%`,
  });

  const hadleInput = (e) => {
    setQuantity(input.length);
    setInput(e.target.value.toUpperCase());
  };

  return (
    <div className="item-container">
      {state.product && state.product.set.filter((item) => !item).length > 0 && (
        <div className="item-container-buttons">
          <>
            {!state.details.editable && (
              <button
                disabled={quantity === 1}
                onClick={() => setQuantity(quantity - 1)}
              >
                -
              </button>
            )}
            <div className="item-container-buttons-control">
              <animated.div
                style={_fillInputRange}
                className="item-container-buttons-quantity"
              ></animated.div>
              <input
                type="range"
                disabled={state.details.editable}
                onChange={(e) => setQuantity(Math.max(e.target.value, 1))}
                value={quantity}
                max={_maxAddLimit}
              />
              <p>{quantity} шт</p>
            </div>
            {!state.details.editable && (
              <button
                disabled={quantity === _maxAddLimit}
                onClick={() =>
                  setQuantity(Math.min(quantity + 1, _maxAddLimit))
                }
              >
                +
              </button>
            )}
            <button
              className="item-container-buttons-add"
              disabled={quantity < 1}
              onClick={() => {
                setState({
                  type: "ADD",
                  fromIndex: selectedSlot,
                  quantity,
                  payload: state.details,
                  current_page: 1,
                });
              }}
            >
              Добавить
            </button>
          </>
        </div>
      )}
      {state.product && state.details.editable && (
        <form onSubmit={null}>
          <input
            className="item-container-letter"
            required
            type="text"
            spellCheck="false"
            maxLength={_maxAddLimit}
            value={input}
            onChange={(e) => hadleInput(e)}
          ></input>
        </form>
      )}
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

const Reshuffle = ({ state: { product } }) => {
  const [reshuffledSet, reshuffle] = useState(product.set);

  return (
    <Sortable
      options={{
        animation: 200,
        easing: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
        dragoverBubble: true,
        removeCloneOnHide: true,
        draggable: ".item-wrapper",
        chosenClass: "chosen",
        ghostClass: "ghost",
        dragClass: "drag",
      }}
      onChange={(order) => {
        reshuffle(
          order.map((val) =>
            reshuffledSet.find((obj) =>
              val.charAt(0) === "$"
                ? obj.id === val.substring(1)
                : obj.letter === val
            )
          )
        );
      }}
      className="box-reshuffle"
    >
      {reshuffledSet
        .filter((item) => item)
        .map((item, i) => (
          <div
            data-id={item.letter || "$" + item.id}
            className="item-wrapper"
            style={{
              width: `${(item.size_length * 100) / product.proportion.x}%`,
              margin: 2,
              backgroundImage: `url(${
                item &&
                item.image.length > 0 &&
                !item.editable &&
                ThumbnailUrl(item.image)
              })`,
            }}
            key={i}
            draggable="false"
          >
            {item.editable && <h1>{item.letter}</h1>}
          </div>
        ))}
    </Sortable>
  );
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
