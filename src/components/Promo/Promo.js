import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { PROMO_QUERY } from '../Providers/Queries';
import { API_URL } from '../../config';
import { useInterval } from '../Providers/Hooks/useInterval';

import Slider from './Slider';

import border from '../../img/promoborder.svg';
import './Promo.css';

const Promo = () => {
  const { data, error, loading } = useQuery(PROMO_QUERY);

  useInterval(() => {
    slider.next();
  }, 35000);

  if (loading || error) return <></>;

  let slider;
  const options = {
    duration: 500,
    draggable: true,
    loop: true
  };

  const images = Object.values(
    data.promos.map(image => `${API_URL}${image.promo_banners[0].url}`)
  );

  return (
    <>
      <section className="Promo-container">
        <div className="Promo-buttons">
          <button
            className="Promo-button prev"
            type="button"
            onClick={() => slider.prev()}
          ></button>
          <button
            className="Promo-button"
            type="button"
            onClick={() => slider.next()}
          ></button>
        </div>
        <div className="Promo-banner">
          <Slider ref={current => (slider = current)} {...options}>
            {images.map((banner, index) => (
              <img key={index} src={banner} alt=""></img>
            ))}
          </Slider>
        </div>
      </section>
      <img className="Promo-bottom" src={border} alt="" />
    </>
  );
};

export default Promo;
