import React, { useState, useReducer, useContext, useEffect } from "react";
import { useQuery } from "react-apollo-hooks";
import { PROPORTION_QUERY } from "../Providers/Queries";
import Gallery from "../Gallery/Gallery";
import { ThumbnailUrl } from "../Providers/ThumbnailUrls";
import { ITEM_QUERY } from "../Providers/Queries";
import { Context } from "../Providers/DataProvider";
import { UserContext } from "../Providers/UserProvider";
import Sortable from "react-sortablejs";
import boxsvg from "../../img/constructorBox.svg";
import sweetssvg from "../../img/constructorSweets.svg";
import { useSpring, animated } from "react-spring";
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
    case "EXPAND":
      custom.set.push(false);
      return custom;
    default:
      return custom;
  }
};

const Constructor = ({ size, setSize }) => {
  const { construct } = useContext(Context);
  const { user } = useContext(UserContext);
  const [slotIndex, setslotIndex] = useState(-1);
  const [details, viewDetails] = useState(false);
  const [compose, setCompose] = useState(false);
  const [custom, dispatch] = useReducer(Reducer, {});
  const { data, error, loading } = useQuery(PROPORTION_QUERY);
  const [updatectx, setupdatectx] = useState(0);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (construct) {
      setupdatectx("loading");
      dispatch({ type: "CLEAR_BOX" });
      setTimeout(() => {
        setSize(construct.set.length);
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
        setupdatectx(0);
      }, 150);
    }
    if (construct.details)
      viewDetails(construct.items.find(item => item.id === construct.details));
  }, [construct, setSize]);

  if (loading || error) return <></>;

  const _permissionBasedSizes = user
    ? user.role.id > 1
      ? data.proportions.filter(size => size.countmin && size.countmax)
      : data.proportions.filter(
          size => size.countmin && size.countmax && size.construct
        )
    : data.proportions.filter(
        size => size.countmin && size.countmax && size.construct
      );

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
        setupdatectx,
        edit,
        setEdit
      }}
    >
      <div className="Constructor-wrapper">
        {updatectx === "loading" ? (
          <></>
        ) : (
          <>
            <ProgressBar size={size} setSize={setSize} />
            {!custom.set && <BoxSelector sizes={_permissionBasedSizes} />}
            {slotIndex >= 0 ? <ItemList /> : custom.set && <Box />}
            {custom.set && slotIndex < 0 && !details && (
              <Summary set={custom.set} />
            )}
          </>
        )}
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

const ProgressBar = ({ size, setSize }) => {
  const {
    custom,
    viewDetails,
    setCompose,
    setslotIndex,
    dispatch
  } = useContext(ConstructorContext);
  return (
    <div className="Constructor-progress">
      <div
        onClick={() => {
          dispatch({ type: "CLEAR_BOX" });
          setslotIndex(-1);
          viewDetails(false);
          setCompose(false);
          setSize(0);
        }}
        className={custom.set ? "Constructor-stage" : "Constructor-stage empty"}
      >
        <img src={boxsvg} alt="" draggable="false" />
        <div className="Constructor-stage-info">
          {!custom.set ? (
            <p
              style={{
                lineHeight: "15px",
                letterSpacing: "0",
                textAlign: `center`
              }}
            >
              Собери свой набор
            </p>
          ) : (
            custom.proportion && (
              <>
                <p>{custom.proportion.type}</p> <p>{custom.proportion.shape}</p>
              </>
            )
          )}
        </div>
      </div>
      {custom.set && (
        <>
          <div
            onClick={() => {
              setslotIndex(-1);
              setCompose(false);
              viewDetails(false);
            }}
            className={
              custom.set && custom.set.filter(obj => obj).length > 0
                ? "Constructor-stage"
                : "Constructor-stage empty"
            }
          >
            <img src={sweetssvg} alt="" draggable="false" />
            {custom.set && (
              <p>
                {custom.set && custom.set.filter(obj => obj).length} / {size}
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

const BoxSelector = ({ sizes }) => {
  const { setSize, dispatch } = useContext(ConstructorContext);
  return (
    <div className="boxselector-wrapper">
      {sizes.map((size, i) => (
        <div
          className="boxselector-slot"
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
            {/* <p>Форма : {size.shape}</p> */}
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

const Box = () => {
  const {
    custom,
    compose,
    setCompose,
    size = 0,
    setSize,
    details,
    viewDetails,
    edit
  } = useContext(ConstructorContext);

  const [expand, setExpand] = useState(
    custom.proportion.countmax - custom.proportion.countmin
  );

  const _createBox = [...Array(size).keys()].map(
    (_, index) =>
      custom.set && (
        <Slot
          boxwidth={custom.proportion.x}
          key={index}
          currentitem={custom.set[index]}
          index={index}
        />
      )
  );
  const _expandableSlots = [...Array(expand).keys()].map(
    (_, index) =>
      custom.set && (
        <ExpandableSlot
          key={index}
          size={size}
          setSize={setSize}
          expand={expand}
          setExpand={setExpand}
        />
      )
  );
  return (
    <>
      <div className="box-wrapper">
        {custom.proportion.countmin <= custom.set.filter(obj => obj).length &&
          !compose &&
          !details && (
            <button
              className="compose"
              onClick={() => {
                custom.proportion.countmin <=
                  custom.set.filter(obj => obj).length && setCompose(true);
              }}
            >
              Продолжить
            </button>
          )}
        {compose & (custom.set.length > 0) ? (
          edit ? (
            <Edit />
          ) : (
            <Reshuffle />
          )
        ) : (
          <>
            {details ? (
              <Item item={details} viewDetails={viewDetails} />
            ) : (
              <>{_createBox}</>
            )}
          </>
        )}
      </div>
      {!details && size < custom.proportion.countmax && !compose && (
        <div className="expand-wrapper">{_expandableSlots}</div>
      )}
    </>
  );
};

const ExpandableSlot = ({ size, setSize, expand, setExpand }) => {
  const { dispatch } = useContext(ConstructorContext);
  return (
    <div
      className="expand-slot-wrapper"
      onClick={() => {
        dispatch({ type: "EXPAND" });
        setSize(size + 1);
        setExpand(expand - 1);
      }}
    >
      +1
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
  const slotStyle = useSpring({
    from: { opacity: 0, width: `${2500 / boxwidth}%` },
    opacity: 1,
    width: `${2500 / boxwidth}%`,
    minHeight: "50px",
    delay: 1000
  });
  return (
    <animated.div
      style={{
        ...slotStyle,
        backgroundImage: `url(${item &&
          item.image.length > 0 &&
          !item.editable &&
          ThumbnailUrl(item.image)})`
      }}
      className="slot-wrapper"
    >
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
      ) : item.editable ? (
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
    </animated.div>
  );
};

const ItemList = () => {
  const { user } = useContext(UserContext);
  const { details, viewDetails } = useContext(ConstructorContext);
  const { data, error, loading } = useQuery(ITEM_QUERY);

  if (loading || error) return <></>;

  const _permissionBasedList = user.online
    ? user.role.id > 1
      ? data.items
      : data.items.filter(item => item.construct)
    : data.items.filter(item => item.construct);

  const items = details ? (
    <Item />
  ) : (
    _permissionBasedList.map(obj => (
      <ul
        onClick={() => {
          viewDetails(obj);
        }}
        className="slot-wrapper"
        style={{ width: `20%`, height: "50px", margin: `5px` }}
        key={obj.id}
      >
        <p>{obj.name}</p>
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
  const [quantity, setQauntity] = useState(details.editable ? 0 : 1);

  useEffect(() => {
    if (details.editable && details.letter !== "") setInput([details.letter]);
    return () => setInput();
  }, [details]);

  function hadleInput(e) {
    setInput(e.target.value.toUpperCase().match(/[а-я,-.0-9 ]/gi));
    setQauntity(
      e.target.value
        ? e.target.value.replace(/ /g, "").length
        : input.length && 0
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    input && input.length > 0 && input[0]
      ? input
          .filter(val => val !== " ")
          .forEach((letter, index) => {
            dispatch({
              type: "ADD",
              payload: { ...details, letter: letter },
              index: slotIndex + index,
              quantity: 1
            });
          })
      : !details.editable &&
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
      <div className="item-container-buttons">
        {!custom.set[slotIndex] ? (
          <>
            <button
              className="item-container-buttons-back"
              onClick={() => viewDetails(false)}
            >
              Назад
            </button>
            {details.editable || (
              <div className="item-container-buttons-control">
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
              </div>
            )}
            <button
              className="item-container-buttons-add"
              onClick={handleSubmit}
            >
              Добавить
            </button>
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
            <button onClick={handleRemove}>Удалить</button>
          </>
        )}
      </div>
      {details.editable ? (
        <form onSubmit={input ? handleSubmit : null}>
          <input
            required
            maxLength={
              input
                ? custom.set.filter((_, index) => index >= slotIndex).length +
                  input.filter(char => char === " ").length
                : 1
            }
            value={input ? input.join("") : ""}
            onChange={e => {
              hadleInput(e);
            }}
          ></input>
        </form>
      ) : (
        <div className="item-container-info">
          <div className="item-container-info-gallery">
            <Gallery image={details.image} />
          </div>
          <div className="item-container-info-details">
            <div className="item-container-info-details-size">
              <h1>высота : {details.size_height} мм</h1>
              <h1>длинна : {details.size_length} мм</h1>
              <h1>ширина : {details.size_width} мм</h1>
              <h1>вес : {details.weight} грамм</h1>
            </div>
            <div className="item-container-info-details-specs">
              <h1>вкус : {details.taste}</h1>
              <h1>шоколад : {details.chocolate}</h1>
            </div>
          </div>
        </div>
      )}
      <h1 className="item-container-title">{details.name}</h1>
      <p className="item-container-description">{details.description}</p>
      <div className="item-container-quantity">
        <p>{quantity} шт</p>
        <p>{details.price * quantity} руб</p>
      </div>
    </div>
  );
};

const Reshuffle = () => {
  const { custom, setCompose, dispatch, edit, setEdit } = useContext(
    ConstructorContext
  );
  const { user, active, setActive } = useContext(UserContext);
  const [set, setSet] = useState(custom.set);

  const SortableList = ({ set, setSet }) => {
    const items = set
      .filter(item => item)
      .map((item, i) => (
        <div
          data-id={item.letter || "$" + item.id}
          className="slot-wrapper"
          style={{
            width: `${(item.size_length * 100) / custom.proportion.x}%`,
            height: `70px`,
            marginBottom: "2px",
            backgroundImage: `url(${item &&
              item.image.length > 0 &&
              !item.editable &&
              ThumbnailUrl(item.image)})`
          }}
          key={i}
          draggable="false"
        >
          {item.editable && <h1>{item.letter}</h1>}
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
                val.charAt(0) === "$"
                  ? obj.id === val.substring(1)
                  : obj.letter === val
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
                user.role.id > 2
                  ? setEdit(!edit)
                  : console.log({ ...custom, set: set });
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
            <p>войти</p>/<p>зарегистрироваться</p>
          </div>
        )}
      </div>
      <SortableList set={set} setSet={setSet} />
    </>
  );
};

const Edit = () => {
  return <div>Админка</div>;
};

export default Constructor;
