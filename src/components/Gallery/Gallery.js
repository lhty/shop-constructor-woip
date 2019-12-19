import React, { useState, useContext } from "react";
import { Context } from "../Providers/Provider";
import { API_URL } from "../../config";

import { useSpring, useTransition, animated } from "react-spring";

import "./Gallery.css";

const Gallery = ({ image }) => {
  const { ThumbnailUrl } = useContext(Context);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const style = useSpring({
    opacity: loading ? 0 : 1
  });
  const transitions = useTransition(fullscreen, null, {
    from: { opacity: 0, x: -100, backgroundColor: `#ffffff00` },
    enter: { opacity: 1, x: 0, backgroundColor: `#ffffffd1` },
    leave: { opacity: 0, x: 100, backgroundColor: `#ffffff00` }
  });
  const imagelist = image.map(
    (obj, i) =>
      i !== selected && (
        <animated.img
          style={style}
          key={i}
          src={
            API_URL + obj.url.slice(1, 9) + "thumbnail/sm-" + obj.url.slice(9)
          }
          alt=""
          onClick={() => {
            setSelected(i);
          }}
          onLoad={() => setLoading(false)}
          draggable="false"
        />
      )
  );

  return (
    <>
      {transitions.map(
        ({ _, key, props }) =>
          fullscreen && (
            <animated.div
              key={key}
              style={{ ...props }}
              className="fullscreen"
              onClick={() => {
                setFullscreen(false);
              }}
            >
              <animated.img
                style={style}
                src={API_URL + image[selected].url}
                alt=""
                onLoad={() => setLoading(false)}
                draggable="false"
              />
            </animated.div>
          )
      )}
      <div className="gallery-container">
        {image ? (
          <div className={image.length > 1 ? `multi-img` : `single-img`}>
            <animated.img
              style={style}
              src={image[selected] && ThumbnailUrl(image[selected])}
              alt=""
              onClick={() => {
                setFullscreen(true);
              }}
              onLoad={() => setLoading(false)}
              draggable="false"
            />
            {image.length > 1 && imagelist}
          </div>
        ) : (
          <img className="placholder" src={"TBD"} alt="" draggable="false" />
        )}
      </div>
    </>
  );
};

export default Gallery;
