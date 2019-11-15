import React, { useState, useReducer, useContext, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROPORTION_QUERY } from "../Providers/Queries";
import Spinner from "../Assets/Spinner";
import { ITEM_QUERY } from "../Providers/Queries";
import { API_URL } from "../../config";
import { Context } from "../Providers/Provider";
import Sortable from "react-sortablejs";
import boxsvg from "../../img/constructorBox.svg";
import sweetssvg from "../../img/constructorSweets.svg";
import done from "../../img/constructorDone.svg";
import "./Constructor.css";

const ConstructorContext = React.createContext();

const Reducer = (custom, action) => {
  switch (action.type) {
    case "CREATE_BOX":
      return action.payload;
    case "ADD":
      let iter = action.quantity;
      action.quantity > 1
        ? custom.set.map(
            (obj, i) =>
              !obj &&
              iter !== 0 &&
              custom.set.splice(i, 1, action.payload) &&
              iter--
          )
        : custom.set.splice(action.index, 1, action.payload);
      return custom;
    case "REMOVE":
      custom.set[action.index] = false;
      return custom;
    case "CLEAR_BOX":
      return {};
    default:
      return custom;
  }
};

const Constructor = () => {
  const { construct } = useContext(Context);

  const [size, setSize] = useState();
  const [slotIndex, setslotIndex] = useState(-1);
  const [details, viewDetails] = useState(false);
  const [compose, setCompose] = useState(false);
  const [custom, dispatch] = useReducer(Reducer, {});

  useEffect(() => {
    if (construct) {
      setSize(construct.proportion.countmin);
      setCompose(false);
      dispatch({
        type: "CREATE_BOX",
        payload: {
          name: `Custom bundle ${new Date().getTime() +
            Math.floor(Math.random(construct.proportion.countmin))}`,
          proportion: construct.proportion,
          set: construct.set
        }
      });
    }
  }, [construct]);

  const { data, error, loading } = useQuery(PROPORTION_QUERY);
  if (loading || error) return <Spinner />;

  return (
    <ConstructorContext.Provider
      value={{
        custom,
        dispatch,
        slotIndex,
        setslotIndex,
        details,
        viewDetails
      }}
    >
      <div className="Constructor-wrapper">
        <div className="Constructor-progress">
          <div
            className={
              custom.set ? "Constructor-stage" : "Constructor-stage empty"
            }
          >
            <img
              onClick={() => {
                dispatch({ type: "CLEAR_BOX" });
                setslotIndex(-1);
                viewDetails(false);
                setCompose(false);
              }}
              src={boxsvg}
              alt=""
            />
            {custom.proportion && (
              <div className="Constructor-stage-info">
                <p>{custom.proportion.type}</p> <p>{custom.proportion.shape}</p>
              </div>
            )}
          </div>
          <div
            className={
              custom.set && custom.set.filter(obj => obj).length > 0
                ? "Constructor-stage"
                : "Constructor-stage empty"
            }
          >
            <img
              onClick={() => {
                setslotIndex(-1);
                setCompose(false);
                viewDetails(false);
              }}
              src={sweetssvg}
              alt=""
            />
            {custom.set && (
              <p>
                {custom.set.filter(obj => obj).length} /{" "}
                {custom.proportion.countmin}
              </p>
            )}
          </div>
          <div
            className={
              compose ? "Constructor-stage" : "Constructor-stage empty"
            }
          >
            <img
              onClick={() => {
                custom.proportion.countmin <=
                  custom.set.filter(obj => obj).length && setCompose(true);
              }}
              src={done}
              alt=""
            />
          </div>
        </div>
        {!custom.set && (
          <BoxSelector
            sizes={data.proportions.filter(
              size => size.countmin !== null && size.construct
            )}
            setSize={setSize}
            dispatch={dispatch}
          />
        )}
        {slotIndex >= 0 ? (
          <ItemList />
        ) : (
          custom.set && (
            <Box
              compose={compose}
              setCompose={setCompose}
              size={size}
              dispatch={dispatch}
            />
          )
        )}
        {custom.set && slotIndex < 0 && (
          <div className="box-overall">
            <p>
              {`Overall price: ${[...custom.set.map(obj => obj.price)]
                .filter(obj => obj)
                .reduce((a, b) => a + b, 0)}руб`}
            </p>
            <p>
              {`Overall quantity:
          ${custom.set.filter(obj => obj.price).length}шт`}
            </p>
          </div>
        )}
      </div>
    </ConstructorContext.Provider>
  );
};

const BoxSelector = ({ sizes, setSize, dispatch }) => {
  return (
    <div className="box-wrapper">
      {sizes.map((size, i) => (
        <div
          className="slot-wrapper"
          onClick={() => {
            let _id =
              new Date().getTime() + Math.floor(Math.random(size.countmin));
            setSize(size.countmin);
            dispatch({
              type: "CREATE_BOX",
              payload: {
                name: `Custom bundle ${_id}`,
                proportion: {
                  id: size.id,
                  countmin: size.countmin,
                  countmax: size.countmax,
                  shape: size.shape,
                  type: size.type,
                  x: size.x,
                  y: size.y,
                  z: size.z
                },
                set: Array.from(Array(size.countmin).fill(false))
              }
            });
          }}
          key={i}
        >
          на {size.countmin} конфет
        </div>
      ))}
    </div>
  );
};

const Box = ({ compose, setCompose, size = 0 }) => {
  const { custom, details, viewDetails } = useContext(ConstructorContext);
  return (
    <div className="box-wrapper">
      {custom.set.indexOf(false) < 0 && !compose && !details && (
        <button
          className="compose"
          onClick={() => {
            custom.proportion.countmin <=
              custom.set.filter(obj => obj).length && setCompose(true);
          }}
        >
          Разложить
        </button>
      )}
      {compose & (custom.set.length > 0) ? (
        <Reshuffle setCompose={setCompose} custom={custom} />
      ) : (
        <>
          {details ? (
            <Item item={details} viewDetails={viewDetails} />
          ) : (
            [...Array(size).keys()].map(
              (slot, index) =>
                custom.set && (
                  <Slot key={index} item={custom.set[index]} index={index} />
                )
            )
          )}
        </>
      )}
    </div>
  );
};

const Slot = ({ item, index }) => {
  const { setslotIndex, viewDetails } = useContext(ConstructorContext);
  return (
    <div
      className="slot-wrapper"
      onClick={() =>
        item ? (viewDetails(item), setslotIndex(index)) : setslotIndex(index)
      }
    >
      {!item ? (
        index + 1
      ) : item.name === "Буква" ? (
        <h1>{item.letter}</h1>
      ) : item.image.length > 0 ? (
        <img
          className="slot-thumb"
          src={`${API_URL}${item.image[0].url}`}
          alt=""
        ></img>
      ) : (
        <p>{item.name}</p>
      )}
    </div>
  );
};

const ItemList = () => {
  const { details, viewDetails } = useContext(ConstructorContext);
  const { data, error, loading } = useQuery(ITEM_QUERY);
  if (loading || error) return <Spinner />;
  const items = details ? (
    <Item item={details} viewDetails={viewDetails} />
  ) : (
    data.items.map(obj => (
      <ul
        onClick={() => {
          viewDetails(obj);
        }}
        className="slot-wrapper"
        key={obj.id}
      >
        {obj.name}
      </ul>
    ))
  );
  return <div className="box-wrapper">{items}</div>;
};

const Item = ({ item, viewDetails }) => {
  const [input, setInput] = useState();
  const [quantity, setQauntity] = useState(item.name === "Буква" ? 0 : 1);
  const { custom, slotIndex, setslotIndex, dispatch } = useContext(
    ConstructorContext
  );

  function hadleInput(e) {
    setInput(e.target.value.toUpperCase().match(/[а-я,-.1-9]/gi));
    setQauntity(e.target.value && input ? e.target.value.length : 0);
  }

  return (
    <div className="item-container">
      <div className="buttons">
        {!custom.set[slotIndex] ? (
          <>
            <button
              onClick={() => {
                input && input.length > 0
                  ? input.map(letter =>
                      dispatch({
                        type: "ADD",
                        payload: { ...item, letter: letter },
                        index: slotIndex,
                        quantity: quantity
                      })
                    )
                  : dispatch({
                      type: "ADD",
                      payload: item,
                      index: slotIndex,
                      quantity: quantity
                    });
                setslotIndex(-1);
                viewDetails(false);
              }}
            >
              Добавить
            </button>
            {item.name === "Буква" || (
              <>
                <button
                  onClick={() => {
                    setQauntity(quantity === 1 ? 1 : quantity - 1);
                  }}
                >
                  -
                </button>
                <p>{quantity} шт</p>
                <button
                  onClick={() => {
                    setQauntity(
                      custom.set &&
                        custom.set.filter(obj => !obj).length === quantity
                        ? quantity
                        : quantity + 1
                    );
                  }}
                >
                  +
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setslotIndex(-1);
                viewDetails(false);
              }}
            >
              Назад
            </button>
            <button
              className="buttons-remove"
              onClick={() => {
                dispatch({
                  type: "REMOVE",
                  index: slotIndex
                });
                setslotIndex(-1);
                viewDetails(false);
              }}
            >
              Удалить
            </button>
          </>
        )}
      </div>
      {item.name === "Буква"
        ? item.image[0] && (
            <>
              <img src={`${API_URL}${item.image[0].url}`} alt="" />
              <form onSubmit={e => e.preventDefault()}>
                <input
                  required
                  maxLength={custom.set.filter(obj => !obj).length}
                  value={input ? input.join("") : ""}
                  onChange={e => {
                    hadleInput(e);
                  }}
                ></input>
              </form>
            </>
          )
        : item.image[0] && (
            <>
              <img src={`${API_URL}${item.image[0].url}`} alt="" />
              <h1>{item.name}</h1>
              <p>{item.description}</p>
            </>
          )}
      <div className="item-container-quantity">
        <p>{quantity} шт</p>
        <p>{item.price * quantity} руб</p>
      </div>
    </div>
  );
};

const Reshuffle = ({ setCompose, custom }) => {
  const [set, setSet] = useState(custom.set);

  const SharedGroup = ({ set, setSet }) => {
    const items = set.map((item, i) => (
      <div data-id={item.letter || item.id} className="slot-wrapper" key={i}>
        {item.name === "Буква" ? (
          <h1>{item.letter}</h1>
        ) : (
          item.image[0] && (
            <img
              key={i}
              className="slot-thumb"
              src={`${API_URL}${item.image[0].url}`}
              alt=""
            />
          )
        )}
      </div>
    ));

    return (
      <Sortable
        options={{
          animation: 200,
          easing: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
          group: "shared",
          swapThreshold: 1,
          invertSwap: false,
          dragoverBubble: true,
          removeCloneOnHide: false,
          chosenClass: "chosen",
          dragClass: "drag"
        }}
        onChange={order => {
          setSet(
            order.map(val =>
              set.find(obj =>
                parseInt(val) ? obj.id === val : obj.letter === val
              )
            )
          );
        }}
        tag="section"
      >
        {items}
      </Sortable>
    );
  };

  return (
    <>
      <div className="compose-nav">
        <button
          onClick={() => {
            setCompose(false);
          }}
        >
          Назад
        </button>
        <button
          onClick={() => {
            console.log({ ...custom, set: set });
          }}
        >
          Done (console.log)
        </button>
      </div>
      <SharedGroup set={set} setSet={setSet} />
    </>
  );
};

export default Constructor;
