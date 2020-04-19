import React, { useState, useContext } from "react";
import { Context } from "../Providers/DataProvider";
import { API_URL } from "../../config";

import { useSpring, animated } from "react-spring";

import "./Gallery.css";

const Gallery = ({ image, isPromo }) => {
  const { ThumbnailUrl } = useContext(Context);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const style = useSpring({
    from: { opacity: 0, scale: 0 },
    to: { scale: 1, opacity: 1 },
  });

  const zoomIn = useSpring({
    from: { opacity: 0, scale: isPromo ? 0 : 1 },
    scale: loading ? 0 : 1,
    opacity: loading ? 0 : 1,
  });

  const fullscreenContainer = useSpring({
    from: { opacity: 0, x: 0, backgroundColor: `#ffffff00`, scale: 0 },
    scale: 1,
    opacity: loading ? 0 : 1,
    x: 0,
    backgroundColor: isPromo ? `#ffffff00` : `#ffffffd1`,
  });

  const imagelist =
    image &&
    image.map(
      (obj, i) =>
        i !== (isPromo ? null : selected) && (
          <animated.img
            style={style}
            key={i}
            src={
              API_URL + obj.url.slice(1, 9) + "thumbnail/sm-" + obj.url.slice(9)
            }
            alt=""
            onClick={() => {
              selected === i ? setFullscreen(false) : setLoading(true);
              setSelected(i);
              if (isPromo) setFullscreen(true);
            }}
            draggable="false"
          />
        )
    );

  return (
    <>
      {image && image[selected] && fullscreen && (
        <animated.div
          style={fullscreenContainer}
          className={isPromo ? `fullscreenpromo` : `fullscreen`}
          onClick={() => {
            setFullscreen(false);
          }}
        >
          <animated.img
            style={zoomIn}
            src={API_URL + image[selected].url}
            alt=""
            onLoad={() => setLoading(false)}
            draggable="false"
          />
        </animated.div>
      )}
      <div className="gallery-container">
        {image ? (
          <div
            className={
              image.length > 1
                ? isPromo
                  ? `promo`
                  : `multi-img`
                : `single-img`
            }
          >
            {!isPromo && (
              <animated.img
                style={style}
                src={image[selected] && ThumbnailUrl(image[selected])}
                alt=""
                onClick={() => {
                  setLoading(true);
                  setFullscreen(true);
                }}
                draggable="false"
              />
            )}
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
