import React, { useState, useReducer, useContext } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { PROPORTION_QUERY } from '../Providers/Queries';
import Spinner from '../Auth/Elements/Spinner';
import { ITEM_QUERY } from '../Providers/Queries';
import { API_URL } from '../../config';

import boxsvg from '../../img/constructorBox.svg';
import sweetssvg from '../../img/constructorSweets.svg';
import arrowsvg from '../../img/constructorArrow.svg';
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

  const sizes = data.proportions
    .filter(size => size.countmin !== null)
    .map(size => size.countmin);

  return (
    <ConstructorContext.Provider
      value={{ custom, dispatch, slotIndex, setslotIndex }}
    >
      <div className="Constructor-wrapper">
        <div className="Constructor-progress">
          <img
            className={custom.set ? 'svgicon' : 'svgicon empty'}
            src={boxsvg}
            alt=""
          />
          <img
            className={custom.set ? 'svgarrow' : 'svgarrow empty'}
            src={arrowsvg}
            alt=""
          />
          <img
            className={custom.set ? 'svgicon' : 'svgicon empty'}
            src={sweetssvg}
            alt=""
          />
          <img className={'svgarrow empty'} src={arrowsvg} alt="" />
          <img className={'svgicon combine empty'} src={boxsvg} alt="" />
          <img className={'svgicon empty'} src={sweetssvg} alt="" />
        </div>
        {!custom.set && (
          <BoxSelector sizes={sizes} setSize={setSize} dispatch={dispatch} />
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
            let _id = new Date().getTime() + Math.floor(Math.random(size));
            setSize(size);
            dispatch({
              type: 'CREATE_BOX',
              payload: {
                id: _id,
                name: `Custom bundle ${_id}`,
                size: size,
                shape: '',
                set: Array.from(Array(size).keys()),
                image: ''
              }
            });
          }}
          key={i}
        >
          на {size} конфет
        </div>
      ))}
    </div>
  );
};

const Box = ({ size = 0, dispatch }) => {
  const { custom } = useContext(ConstructorContext);
  return (
    <div className="box-wrapper">
      <div className="back" onClick={() => dispatch({ type: 'CLEAR_BOX' })}>
        Назад
      </div>
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
      {typeof item === 'number' ? (
        item + 1
      ) : !item ? (
        '+'
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

// const Item = ({ item }) => {
//   return <div></div>;
// };

const ItemList = () => {
  const { slotIndex, setslotIndex, dispatch } = useContext(ConstructorContext);
  const { data, error, loading } = useQuery(ITEM_QUERY);
  if (loading || error) return <Spinner />;
  const items = data.items.map(obj => (
    <ul
      className="slot-wrapper"
      key={obj.id}
      onClick={() => {
        dispatch({ type: 'ADD', payload: obj, index: slotIndex });
        setslotIndex(-1);
      }}
    >
      {obj.name}
    </ul>
  ));
  return (
    <div className="box-wrapper">
      <div className="back" onClick={() => setslotIndex(-1)}>
        Назад
      </div>
      {items}
    </div>
  );
};

export default Constructor;
