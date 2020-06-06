import React, { useState, useContext } from "react";
import { Context } from "../../store/DataProvider";
import { API_URL } from "../../config";

import Spinner from "../Assets/Spinner";

import { useSpring, animated } from "react-spring";

import "./Gallery.css";

const Gallery = ({ image, isPromo }) => {
  const { ThumbnailUrl } = useContext(Context);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const zoomIn = useSpring({
    from: { opacity: 0, scale: isPromo ? 0 : 1 },
    scale: loading ? 0 : 1,
    opacity: loading ? 0 : 1,
  });

  const fadeIn = useSpring({
    from: { opacity: 0 },
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
            key={i}
            style={fadeIn}
            src={ThumbnailUrl(obj, 800)}
            alt=""
            onClick={() => {
              selected === i ? setFullscreen(false) : setLoading(true);
              setSelected(i);
              if (isPromo) setFullscreen(true);
            }}
            onLoad={() => setLoading(false)}
            draggable="false"
          />
        )
    );

  if (!image?.length) return null;

  return (
    <>
      {image && fullscreen && (
        <animated.div
          style={fullscreenContainer}
          className={isPromo ? `fullscreenpromo` : `fullscreen`}
          onClick={() => {
            setFullscreen(false);
          }}
        >
          <animated.img
            style={zoomIn}
            src={API_URL.slice(0, -1) + image[selected]?.url}
            alt=""
            onLoad={() => setLoading(false)}
            draggable="false"
          />
        </animated.div>
      )}
      {loading && <Spinner />}
      <div className="gallery-container">
        <div
          className={
            image?.length > 1 ? (isPromo ? `promo` : `multi-img`) : `single-img`
          }
        >
          {!isPromo && (
            <animated.img
              style={fadeIn}
              src={image && ThumbnailUrl(image[selected])}
              alt=""
              onClick={() => {
                setLoading(true);
                setFullscreen(true);
              }}
              onLoad={() => setLoading(false)}
              draggable="false"
            />
          )}
          {image?.length > 1 && imagelist}
        </div>
      </div>
    </>
  );
};

export default Gallery;
