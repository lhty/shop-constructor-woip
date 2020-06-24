import React from "react";
import { useTransition, animated } from "react-spring";

export default function SlideFade({
  condition,
  dist = 0,
  className,
  children,
}) {
  const transition = useTransition(condition, null, {
    from: { opacity: 0, x: -dist },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0 },
  });

  return transition.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props} className={className}>
          {children}
        </animated.div>
      )
  );
}
