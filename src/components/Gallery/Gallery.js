import React, { useState, useContext } from "react";
import { Context } from "../Providers/Provider";
import { API_URL } from "../../config";

import "./Gallery.css";

const Gallery = ({ image }) => {
  const { ThumbnailUrl } = useContext(Context);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const style = {
    opacity: "0",
    transition: "1s ease"
  };
  const imagelist = image.map(
    (obj, i) =>
      i !== selected && (
        <img
          style={loading ? style : {}}
          key={i}
          src={
            API_URL + obj.url.slice(1, 9) + "thumbnail/th-" + obj.url.slice(9)
          }
          alt=""
          onClick={() => {
            setSelected(i);
          }}
          onLoad={() => setLoading(false)}
        ></img>
      )
  );

  return (
    <div className="gallery-container">
      {image ? (
        image.length > 1 ? (
          <div className="multi-img">
            <img
              style={loading ? style : {}}
              src={API_URL + image[selected].url}
              alt=""
              onLoad={() => setLoading(false)}
            ></img>
            {imagelist}
          </div>
        ) : (
          <img
            style={loading ? style : {}}
            className="single-img"
            src={ThumbnailUrl(image)}
            alt=""
            draggable="false"
            onLoad={() => setLoading(false)}
          />
        )
      ) : (
        <img className="placholder" src={"TBD"} alt="" draggable="false" />
      )}
    </div>
  );
};

export default Gallery;
