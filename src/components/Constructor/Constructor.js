import React, { useState, useReducer, useContext } from 'react';
import { useQuery } from 'react-apollo-hooks';
import { PROPORTION_QUERY } from '../Providers/Queries';
import { ITEM_QUERY } from '../Providers/Queries';
import { API_URL } from '../../config';

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
    default:
      return custom;
  }
};

const Constructor = () => {
  const [size, setSize] = useState();
  const [slotIndex, setslotIndex] = useState(-1);

  const [custom, dispatch] = useReducer(Reducer, {});

  const { data, error, loading } = useQuery(PROPORTION_QUERY);
  if (loading || error) return <></>;

  const sizes = data.proportions
    .filter(size => size.countmin !== null)
    .map(size => size.countmin);

  return (
    <ConstructorContext.Provider
      value={{ custom, dispatch, slotIndex, setslotIndex }}
    >
      <div className="Constructor-wrapper">
        <select
          onChange={e => {
            e.preventDefault();
            let _size = parseInt(e.target.value);
            let _id = new Date().getTime() + Math.floor(Math.random(_size));
            setSize(_size);
            dispatch({
              type: 'CREATE_BOX',
              payload: {
                id: _id,
                name: `Custom bundle ${_id}`,
                size: _size,
                shape: '',
                set: Array.from(Array(_size).keys()),
                image: ''
              }
            });
          }}
          defaultValue={'DEFAULT'}
          required
        >
          <option value="DEFAULT" disabled hidden>
            Выберите размер
          </option>
          {sizes.map((size, i) => (
            <option value={size} key={i}>
              на {size} конфет
            </option>
          ))}
        </select>
        <Box size={size} />
        {slotIndex >= 0 && <ItemList />}
      </div>
    </ConstructorContext.Provider>
  );
};

const Box = ({ size = 0 }) => {
  const { custom } = useContext(ConstructorContext);
  return (
    <div className="box-wrapper">
      {[...Array(size).keys()].map((slot, index) => (
        <Slot key={index} item={custom.set[index]} index={index} />
      ))}
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

const Item = ({ item }) => {
  return <div></div>;
};

const ItemList = () => {
  const { slotIndex, setslotIndex, dispatch } = useContext(ConstructorContext);
  const { data, error, loading } = useQuery(ITEM_QUERY);
  if (loading || error) return <></>;
  const items = data.items.map(obj => (
    <ul
      key={obj.id}
      onClick={() => {
        dispatch({ type: 'ADD', payload: obj, index: slotIndex });
        setslotIndex(-1);
      }}
    >
      {obj.name}
    </ul>
  ));
  return <div className="Itemlist-wrapper">{items}</div>;
};

export default Constructor;
