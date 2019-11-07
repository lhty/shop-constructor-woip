import React, { useState, useReducer, useContext, useEffect } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { PROPORTION_QUERY } from '../Providers/Queries';
import Spinner from '../Assets/Spinner';
import { ITEM_QUERY } from '../Providers/Queries';
import { API_URL } from '../../config';
import { Context } from '../Providers/Provider';
import boxsvg from '../../img/constructorBox.svg';
import sweetssvg from '../../img/constructorSweets.svg';
import done from '../../img/constructorDone.svg';
import './Constructor.css';

const ConstructorContext = React.createContext();

const Reducer = (custom, action) => {
  switch (action.type) {
    case 'CREATE_BOX':
      return action.payload;
    case 'ADD':
      let iter = action.quantity;
      action.quantity > 1
        ? custom.set.map(
            (obj, i) =>
              !obj && iter && custom.set.splice(i, 1, action.payload) && iter--
          )
        : custom.set.splice(action.index, 1, action.payload);
      return custom;
    case 'CLEAR_BOX':
      return {};
    default:
      return custom;
  }
};

const Constructor = () => {
  const { construct } = useContext(Context);

  useEffect(() => {
    if (construct) {
      setSize(construct.proportion.countmin);
      dispatch({
        type: 'CREATE_BOX',
        payload: {
          name: `Custom bundle ${new Date().getTime() +
            Math.floor(Math.random(construct.proportion.countmin))}`,
          proportion: construct.proportion,
          set: construct.set
        }
      });
    }
  }, [construct]);

  const [size, setSize] = useState();
  const [slotIndex, setslotIndex] = useState(-1);
  const [compose, setCompose] = useState(false);
  const [custom, dispatch] = useReducer(Reducer, {});

  const { data, error, loading } = useQuery(PROPORTION_QUERY);
  if (loading || error) return <Spinner />;

  return (
    <ConstructorContext.Provider
      value={{ custom, dispatch, slotIndex, setslotIndex }}
    >
      <div className="Constructor-wrapper">
        <div className="Constructor-progress">
          <div
            className={
              custom.set ? 'Constructor-stage' : 'Constructor-stage empty'
            }
          >
            <img
              onClick={() => {
                dispatch({ type: 'CLEAR_BOX' });
                setslotIndex(-1);
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
                ? 'Constructor-stage'
                : 'Constructor-stage empty'
            }
          >
            <img
              onClick={() => {
                setslotIndex(-1);
                setCompose(false);
              }}
              src={sweetssvg}
              alt=""
            />
            {custom.set && (
              <p>
                {custom.set.filter(obj => obj).length} /{' '}
                {custom.proportion.countmin}
              </p>
            )}
          </div>
          <div
            className={
              compose ? 'Constructor-stage' : 'Constructor-stage empty'
            }
          >
            <img src={done} alt="" />
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
        {custom.set && (
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
              type: 'CREATE_BOX',
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
  const { custom } = useContext(ConstructorContext);
  return (
    <>
      <div className="box-wrapper">
        {compose ? (
          <Reshuffle custom={custom} />
        ) : (
          <>
            {[...Array(size).keys()].map(
              (slot, index) =>
                custom.set && (
                  <Slot key={index} item={custom.set[index]} index={index} />
                )
            )}
            <button
              onClick={() => {
                custom.proportion.countmin <=
                  custom.set.filter(obj => obj).length && setCompose(true);
              }}
            >
              Далее
            </button>
          </>
        )}
      </div>
    </>
  );
};

const Slot = ({ item, index }) => {
  const { setslotIndex } = useContext(ConstructorContext);
  return (
    <div className="slot-wrapper" onClick={() => setslotIndex(index)}>
      {!item ? (
        index + 1
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
  const [details, viewDetails] = useState(false);
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
  const [quantity, setQauntity] = useState(1);
  const { custom, slotIndex, setslotIndex, dispatch } = useContext(
    ConstructorContext
  );

  return (
    <div className="item-container">
      {item.image[0] && <img src={`${API_URL}${item.image[0].url}`} alt="" />}
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <div className="item-container-quantity">
        <p>{quantity} шт</p>
        <p>{item.price * quantity} руб</p>
      </div>
      <div className="item-container-buttons">
        <button
          onClick={() => {
            dispatch({
              type: 'ADD',
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
        <button
          onClick={() => {
            setQauntity(quantity === 1 ? 1 : quantity - 1);
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            setQauntity(
              custom.set && custom.set.filter(obj => !obj).length === quantity
                ? quantity
                : quantity + 1
            );
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

const Reshuffle = ({ custom }) => {
  const boxmaxwidth = custom.proportion.x;
  const rowwidth = [...custom.set.map(obj => obj.size_width)].reduce(
    (a, b) => a + b
  );
  function _cut(array, parts) {
    let result = [];
    for (let i = parts; i > 0; i--) {
      result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
  }
  const schema = _cut(
    custom.set.map(obj => obj.id),
    Math.ceil(rowwidth / boxmaxwidth)
  );
  const createRows = _cut(custom.set, Math.ceil(rowwidth / boxmaxwidth)).map(
    (row, rowindex) => (
      <div className="row" key={rowindex}>
        {row.map((item, itemindex) => (
          <div className="item" key={itemindex}>
            {item.image[0] && (
              <img
                className="slot-thumb"
                src={`${API_URL}${item.image[0].url}`}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    )
  );
  return (
    <div className="shuffle">
      {createRows}
      {console.log('box width :', boxmaxwidth)}
      {console.log('row width :', rowwidth)}
      {console.log('rows quantity :', Math.ceil(rowwidth / boxmaxwidth))}
      {console.log('schema :', schema)}
    </div>
  );
};

export default Constructor;
