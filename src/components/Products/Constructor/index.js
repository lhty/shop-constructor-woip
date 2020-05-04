import React, {
  useReducer,
  useEffect,
  useContext,
  Suspense,
  lazy,
} from "react";
import { Context } from "../../../containers/DataProvider";
import { useTransition, animated } from "react-spring";

import "./index.css";

const Constructor = lazy(() => import("./Constructor"));

const Reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      let iter = action.quantity;
      action.quantity > 1
        ? state.product.set.map(
            (obj, i) =>
              !obj &&
              iter !== 0 &&
              state.product.set.splice(i, 1, action.payload) &&
              iter--
          )
        : state.product.set.splice(action.index, 1, action.payload);
      return state;
    case "REMOVE_ITEM":
      return {
        ...state,
        product: {
          ...state.product,
          set: state.product.set.map((prod, i) =>
            i === action.index ? (prod = false) : prod
          ),
        },
      };
    case "EXPAND":
      state.product.set.push(false);
      return state;
    default:
      return { ...state, ...action };
  }
};

export default () => {
  const [state, setState] = useReducer(Reducer, {
    current_page: -1,
    product: null,
    details: null,
  });
  const { construct } = useContext(Context);

  useEffect(() => {
    if (construct.product)
      setState({ current_page: 1, product: construct.product });
    if (construct.details)
      setState({ current_page: 3, details: construct.details });
  }, [construct]);

  const transitions = useTransition(state.current_page >= 0, null, {
    from: {
      opacity: 0,
      width: `0%`,
    },
    enter: {
      opacity: 1,
      width: state.current_page >= 0 ? `100%` : `0%`,
    },
    leave: {
      position: window.screen.width < 1024 ? "absolute" : "",
      opacity: 0,
      width: `0%`,
    },
  });

  return (
    <Suspense fallback={null}>
      {state.current_page < 0 && (
        <div
          className="Constructor-toggle"
          onClick={() => setState({ current_page: 0 })}
        >
          <p>Собери свой набор</p>
        </div>
      )}
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className="Constructor" key={key} style={props}>
              <Constructor {...{ state, setState }} />
            </animated.div>
          )
      )}
    </Suspense>
  );
};
