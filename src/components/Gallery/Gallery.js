import React, { useState, useContext } from "react";
import { Context } from "../Providers/Provider";
import { API_URL } from "../../config";

import "./Gallery.css";

const Gallery = ({ image }) => {
  const { ThumbnailUrl } = useContext(Context);
  const [selected, setSelected] = useState(0);
  const imagelist = image.map(
    (obj, i) =>
      i !== selected && (
        <img
          key={i}
          src={
            API_URL + obj.url.slice(1, 9) + "thumbnail/th-" + obj.url.slice(9)
          }
          alt=""
          onClick={() => {
            setSelected(i);
          }}
        ></img>
      )
  );

  return (
    <div className="gallery-container">
      {image ? (
        image.length > 1 ? (
          <div className="multi-img">
            <img
              src={
                API_URL +
                image[selected].url.slice(1, 9) +
                "thumbnail/th-" +
                image[selected].url.slice(9)
              }
              alt=""
            ></img>
            {imagelist}
          </div>
        ) : (
          <img
            className="single-img"
            src={ThumbnailUrl(image)}
            alt=""
            draggable="false"
          />
        )
      ) : (
        <img className="placholder" src={"TBD"} alt="" draggable="false" />
      )}
    </div>
  );
};

export default Gallery;
