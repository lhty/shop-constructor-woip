import React, { useState, useReducer, useContext, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROPORTION_QUERY } from "../Providers/Queries";
import Spinner from "../Assets/Spinner";
import { ITEM_QUERY } from "../Providers/Queries";
import { API_URL } from "../../config";
import { Context } from "../Providers/Provider";
import { UserContext } from "../Providers/UserProvider";
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
      custom.set.splice(action.index, 1, false);
      return custom;
    case "UPDATE":
      return { ...custom, set: action.payload };
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
  const { data, error, loading } = useQuery(PROPORTION_QUERY);
  const [updatectx, setupdatectx] = useState(0);
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
      if (construct.details)
        viewDetails(
          construct.items.find(item => item.id === construct.details)
        );
    }
  }, [construct]);

  if (loading || error) return <Spinner />;

  return (
    <ConstructorContext.Provider
      value={{
        construct,
        custom,
        dispatch,
        slotIndex,
        setslotIndex,
        size,
        setSize,
        details,
        compose,
        setCompose,
        viewDetails,
        updatectx,
        setupdatectx
      }}
    >
      <div className="Constructor-wrapper">
        <ProgressBar />
        {!custom.set && (
          <BoxSelector
            sizes={data.proportions.filter(
              size => size.countmin !== null && size.construct
            )}
          />
        )}
        {slotIndex >= 0 ? <ItemList /> : custom.set && <Box />}
        {custom.set && slotIndex < 0 && <Summary set={custom.set} />}
      </div>
    </ConstructorContext.Provider>
  );
};

const Summary = () => {
  const { custom } = useContext(ConstructorContext);
  return (
    <div className="box-overall">
      <p>{`конфеты ${custom.set.filter(obj => obj).length} шт ${custom.set
        .map(obj => obj.price)
        .filter(obj => obj)
        .reduce((a, b) => a + b, 0)} руб`}</p>
      <p>{`коробка ${custom.proportion.type.toLowerCase()} ${
        custom.proportion.price
      } руб`}</p>
      <p>
        {`Итого : ${custom.set
          .map(obj => obj.price)
          .filter(obj => obj)
          .reduce((a, b) => a + b, 0) + custom.proportion.price} руб`}
      </p>
    </div>
  );
};

const ProgressBar = () => {
  const {
    custom,
    viewDetails,
    compose,
    setCompose,
    setslotIndex,
    dispatch
  } = useContext(ConstructorContext);
  return (
    <div className="Constructor-progress">
      <div
        className={custom.set ? "Constructor-stage" : "Constructor-stage empty"}
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
            {custom.set && custom.set.filter(obj => obj).length} /{" "}
            {custom.proportion.countmin}
          </p>
        )}
      </div>
      <div
        className={compose ? "Constructor-stage" : "Constructor-stage empty"}
      >
        <img src={done} alt="" />
      </div>
    </div>
  );
};

const BoxSelector = ({ sizes }) => {
  const { setSize, dispatch } = useContext(ConstructorContext);
  return (
    <div className="box-wrapper">
      {sizes.map((size, i) => (
        <div
          style={{ width: "20%", height: "100px" }}
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
                  price: size.price,
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

const Box = () => {
  const {
    custom,
    compose,
    setCompose,
    size = 0,
    details,
    viewDetails
  } = useContext(ConstructorContext);

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
          Расставить
        </button>
      )}
      {compose & (custom.set.length > 0) ? (
        <Reshuffle />
      ) : (
        <>
          {details ? (
            <Item item={details} viewDetails={viewDetails} />
          ) : (
            [...Array(size).keys()].map(
              (_, index) =>
                custom.set && (
                  <Slot
                    boxwidth={custom.proportion.x}
                    key={index}
                    currentitem={custom.set[index]}
                    index={index}
                  />
                )
            )
          )}
        </>
      )}
    </div>
  );
};

const Slot = ({ currentitem, boxwidth, index }) => {
  const {
    setslotIndex,
    viewDetails,
    dispatch,
    updatectx,
    setupdatectx
  } = useContext(ConstructorContext);
  const [item, setItem] = useState(currentitem);
  const slotStyle = {
    width: `${2500 / boxwidth}%`,
    minHeight: "70px",
    backgroundImage: `url(${item &&
      item.image.length > 0 &&
      item.name !== "Буква" &&
      API_URL + item.image[0].url})`
  };
  return (
    <div style={slotStyle} className="slot-wrapper">
      {item && (
        <div
          className="slot-wrapper-del"
          onClick={() => {
            dispatch({
              type: "REMOVE",
              index: index
            });
            setupdatectx(updatectx + 1);
            setItem(false);
          }}
        >
          +
        </div>
      )}
      {!item ? (
        <span
          onClick={() =>
            item
              ? (viewDetails(item), setslotIndex(index))
              : setslotIndex(index)
          }
        >
          +
        </span>
      ) : item.name === "Буква" ? (
        <h1
          onClick={() =>
            item
              ? (viewDetails(item), setslotIndex(index))
              : setslotIndex(index)
          }
        >
          {item.letter}
        </h1>
      ) : item.image.length > 0 ? (
        <div
          style={{ width: "100%", height: "100%" }}
          onClick={() =>
            item
              ? (viewDetails(item), setslotIndex(index))
              : setslotIndex(index)
          }
        ></div>
      ) : (
        item.image.length < 1 && <p>{item.name}</p>
      )}
    </div>
  );
};

const ItemList = () => {
  const { details, viewDetails } = useContext(ConstructorContext);
  const { data, error, loading } = useQuery(ITEM_QUERY);
  if (loading || error) return <Spinner />;
  const items = details ? (
    <Item />
  ) : (
    data.items.map(obj => (
      <ul
        onClick={() => {
          viewDetails(obj);
        }}
        className="slot-wrapper"
        style={{ width: `20%`, height: "100px" }}
        key={obj.id}
      >
        {obj.name}
      </ul>
    ))
  );
  return <div className="box-wrapper">{items}</div>;
};

const Item = () => {
  const {
    details,
    custom,
    slotIndex,
    viewDetails,
    setslotIndex,
    dispatch
  } = useContext(ConstructorContext);
  const [input, setInput] = useState();
  const [quantity, setQauntity] = useState(details.name === "Буква" ? 0 : 1);

  useEffect(() => {
    if (details.letter !== "") setInput([details.letter]);
  }, [details]);

  function hadleInput(e) {
    setInput(e.target.value.toUpperCase().match(/[а-я,-.1-9 ]/gi));
    setQauntity(
      e.target.value && input
        ? e.target.value.replace(/^\s+|\s+$/g, "").replace(/(\s\s\s*)/g, " ")
            .length
        : 0
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    input && input.length > 0
      ? input
          .filter(val => val !== " ")
          .map((letter, index) => {
            return dispatch({
              type: "ADD",
              payload: { ...details, letter: letter },
              index: slotIndex + index,
              quantity: 1
            });
          })
      : details.name !== "Буква" &&
        dispatch({
          type: "ADD",
          payload: details,
          index: slotIndex,
          quantity: quantity
        });
    setslotIndex(-1);
    viewDetails(false);
  }
  function handleRemove() {
    dispatch({
      type: "REMOVE",
      index: slotIndex
    });
    setslotIndex(-1);
    viewDetails(false);
  }
  return (
    <div className="item-container">
      <div className="buttons">
        {!custom.set[slotIndex] ? (
          <>
            <button onClick={handleSubmit}>Добавить</button>
            {details.name === "Буква" || (
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
            <button className="buttons-remove" onClick={handleRemove}>
              Удалить
            </button>
          </>
        )}
      </div>
      {details.name === "Буква"
        ? details.image[0] && (
            <>
              <img src={`${API_URL}${details.image[0].url}`} alt="" />
              <form onSubmit={input ? handleSubmit : null}>
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
        : details.image[0] && (
            <>
              <img src={`${API_URL}${details.image[0].url}`} alt="" />
              <h1>{details.name}</h1>
              <p>{details.description}</p>
            </>
          )}
      <div className="item-container-quantity">
        <p>{quantity} шт</p>
        <p>{details.price * quantity} руб</p>
      </div>
    </div>
  );
};

const Reshuffle = () => {
  const { custom, setCompose, dispatch } = useContext(ConstructorContext);
  const { user, active, setActive } = useContext(UserContext);
  const [set, setSet] = useState(custom.set);

  const SortableList = ({ set, setSet }) => {
    const items = set.map((item, i) => (
      <div
        data-id={item.letter || item.id}
        className="slot-wrapper"
        style={{
          width: `${(item.size_length * 100) / custom.proportion.x}%`,
          minHeight: "70px",
          backgroundImage: `url(${item &&
            item.image.length > 0 &&
            item.name !== "Буква" &&
            API_URL + item.image[0].url})`
        }}
        key={i}
      >
        {item.name === "Буква" && <h1>{item.letter}</h1>}
      </div>
    ));

    return (
      <Sortable
        options={{
          animation: 200,
          easing: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
          dragoverBubble: true,
          draggable: ".slot-wrapper",
          chosenClass: "chosen",
          ghostClass: "ghost",
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
          className="backward"
          onClick={() => {
            setCompose(false);
            dispatch({ type: "UPDATE", payload: set });
          }}
        >
          Назад
        </button>
        {user.online ? (
          <>
            <button>Не хочу расставлять</button>
            <button
              onClick={() => {
                console.log({ ...custom, set: set });
              }}
            >
              Готово
            </button>
          </>
        ) : (
          <div
            className="compose-offline"
            onClick={() => setActive({ ...active, auth: !active.auth })}
          >
            Необходимо <p>войти</p> или <p>зарегистрироваться</p>
          </div>
        )}
      </div>
      <SortableList set={set} setSet={setSet} />
    </>
  );
};

export default Constructor;
