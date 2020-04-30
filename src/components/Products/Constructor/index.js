import React, {
  useReducer,
  useEffect,
  useContext,
  Suspense,
  lazy,
} from "react";
import { Context } from "../../../containers/DataProvider";
import { useSpring, useTransition, animated } from "react-spring";

import "./index.css";

const Constructor = lazy(() => import("./Constructor"));

export default () => {
  const [state, setState] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    {
      current_page: -1,
      product: null,
      details: null,
    }
  );
  const { construct } = useContext(Context);

  useEffect(() => {
    if (construct.product)
      setState({ current_page: 1, product: construct.prduct });
    if (construct.details)
      setState({ current_page: 3, details: construct.details });
  }, [construct]);

  const [styleProps, set] = useSpring(() => ({
    config: { mass: 1, tension: 280, friction: 40 },
    from: { width: `0%` },
  }));

  const isOpen = state.current_page < 0;

  const transitions = useTransition(isOpen, null, {
    from: { x: 100, opacity: 0 },
    enter: { x: 0, opacity: 1 },
    leave: { x: 100, opacity: 0 },
  });

  useEffect(() => {
    switch (state.current_page) {
      case -1:
        set({ width: `0%` });
        break;
      default:
        set({ width: `100%` });
    }
  }, [state.current_page, set]);

  return (
    <Suspense fallback={null}>
      {transitions.map(({ item, key, props }) =>
        item ? (
          <animated.div
            style={props}
            key={key}
            className="Constructor-toggle"
            onClick={() => setState({ current_page: 0 })}
          >
            <p>Собери свой набор</p>
          </animated.div>
        ) : (
          <animated.div className="Constructor" key={key} style={styleProps}>
            <Constructor {...{ state, setState }} />
          </animated.div>
        )
      )}
    </Suspense>
  );
};
