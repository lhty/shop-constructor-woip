import React, { useContext, Suspense, lazy } from "react";
import { Context } from "../../../store/DataProvider";
import { useTransition, animated } from "react-spring";

import "./index.css";

const Constructor = lazy(() => import("./Constructor"));

export default () => {
  const { state, setState } = useContext(Context);

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
