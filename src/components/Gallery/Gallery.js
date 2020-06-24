import React, { useState, useContext } from "react";
import { Context } from "../../store/DataProvider";
import { API_URL } from "../../config";

import Spinner from "../Assets/Spinner";

import { useSpring, animated } from "react-spring";

import "./Gallery.css";

const Gallery = ({ image }) => {
  const { ThumbnailUrl } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(null);

  const fadeIn = useSpring({
    from: { opacity: 0 },
    opacity: loading ? 0 : 1,
  });

  if (!image?.length) return null;

  return (
    <div className="gallery-container">
      {loading && <Spinner />}
      <FullScreen
        {...{ fullscreen, image, setFullscreen, loading, setLoading }}
      />
      {image?.map((obj, i) => (
        <animated.img
          key={i}
          style={fadeIn}
          src={ThumbnailUrl(obj, 800)}
          alt=""
          onClick={() => {
            setFullscreen(i);
            setLoading(true);
          }}
          onLoad={() => setLoading(false)}
          draggable="false"
        />
      ))}
    </div>
  );
};

const FullScreen = ({
  fullscreen,
  image,
  setFullscreen,
  loading,
  setLoading,
}) => {
  const zoomIn = useSpring({
    from: { opacity: 0, scale: 1 },
    scale: loading ? 0 : 1,
    opacity: loading ? 0 : 1,
  });

  const fullscreenContainer = useSpring({
    from: { opacity: 0, x: 0, backgroundColor: `#1f1f1f87`, scale: 0 },
    scale: 1,
    opacity: loading ? 0 : 1,
    x: 0,
  });

  if (!image[fullscreen]) return null;
  return (
    <animated.div
      style={fullscreenContainer}
      className="fullscreen"
      onClick={() => {
        setFullscreen(null);
      }}
    >
      <animated.img
        style={zoomIn}
        src={API_URL.slice(0, -1) + image[fullscreen]?.url}
        alt=""
        onLoad={() => setLoading(false)}
        draggable="false"
      />
    </animated.div>
  );
};

export default Gallery;
