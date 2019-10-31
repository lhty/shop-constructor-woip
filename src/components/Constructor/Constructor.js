import React, { useState, useReducer, useContext } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { PROPORTION_QUERY } from '../Providers/Queries';
import Spinner from '../Auth/Elements/Spinner';
import { ITEM_QUERY } from '../Providers/Queries';
import { API_URL } from '../../config';

import boxsvg from '../../img/constructorBox.svg';
import sweetssvg from '../../img/constructorSweets.svg';
import done from '../../img/constructorDone.svg';
import './Constructor.css';

const ConstructorContext = React.createContext();

const Reducer = (custom, action) => {
  const InsertObj = (index, obj) => {
    custom.set.splice(index, 1, obj);
  };
  switch (action.type) {
    case 'CREATE_BOX':
      return action.payload;
    case 'ADD':
      InsertObj(action.index, action.payload);
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
              <p>
                {custom.type} {custom.shape}
              </p>
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
  const { slotIndex, setslotIndex, dispatch } = useContext(ConstructorContext);
  return (
    <div className="item-container">
      <img src={`${API_URL}${item.image[0].url}`} alt="" />
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <label>{item.price} руб</label>
      <button
        onClick={() => {
          dispatch({ type: 'ADD', payload: item, index: slotIndex });
          setslotIndex(-1);
          viewDetails(false);
        }}
      >
        Добавить
      </button>
    </div>
  );
};

export default Constructor;
