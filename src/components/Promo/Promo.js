import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import { PROMO_QUERY } from '../Providers/Queries';
import Spinner from '../Assets/Spinner';
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

  if (loading || error) return <Spinner />;

  let slider;
  const options = {
    duration: 500,
    draggable: true,
    threshold: 50,
    loop: true
  };

  // const descriptionstyle = {
  //   color: 'red'
  // };
  // const titlestyle = {
  //   color: 'red'
  // };

  const banners = data.promos.map((banner, index) => (
    <div className="Banner-wrapper" key={index}>
      <div className="Banner-text">
        <h1>{banner.title}</h1>
        <p>
          {banner.description.length > 200
            ? banner.description.substring(0, 200) + ' ...'
            : banner.description}
        </p>
      </div>
      {banner.promo_banners[0] && (
        <img
          className="Banner-img"
          key={index}
          src={`${API_URL}${banner.promo_banners[0].url}`}
          alt=""
        ></img>
      )}
      <label className="Promo-button expand"></label>
    </div>
  ));

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
            {banners}
          </Slider>
        </div>
      </section>
      <img className="Promo-bottom" src={border} alt="" />
    </>
  );
};

export default Promo;
