import React, { useState, useReducer, useContext } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { PROPORTION_QUERY } from '../Providers/Queries';
import Spinner from '../Assets/Spinner';
import { ITEM_QUERY } from '../Providers/Queries';
import { API_URL } from '../../config';

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
  const [size, setSize] = useState();
  const [slotIndex, setslotIndex] = useState(-1);

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
              }}
              src={boxsvg}
              alt=""
            />

            {custom.constructor === Object && (
              <div className="Constructor-stage-info">
                <p>{custom.type}</p> <p>{custom.shape}</p>
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
            <img onClick={() => setslotIndex(-1)} src={sweetssvg} alt="" />
            {custom.set && (
              <p>
                {custom.set.filter(obj => obj).length} / {custom.size}
              </p>
            )}
          </div>
          <div className={'Constructor-stage empty'}>
            <img src={done} alt="" />
          </div>
        </div>
        {!custom.set && (
          <BoxSelector
            sizes={data.proportions.filter(size => size.countmin !== null)}
            setSize={setSize}
            dispatch={dispatch}
          />
        )}
        {slotIndex >= 0 ? (
          <ItemList />
        ) : (
          custom.set && <Box size={size} dispatch={dispatch} />
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
                id: _id,
                name: `Custom bundle ${_id}`,
                size: size.countmin,
                maxsize: size.countmax,
                shape: size.shape,
                type: size.type,
                set: Array.from(Array(size.countmin).fill(false)),
                image: ''
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

const Box = ({ size = 0 }) => {
  const { custom } = useContext(ConstructorContext);
  return (
    <div className="box-wrapper">
      {[...Array(size).keys()].map(
        (slot, index) =>
          custom.set && (
            <Slot key={index} item={custom.set[index]} index={index} />
          )
      )}
    </div>
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

export default Constructor;
