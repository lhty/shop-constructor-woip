import React from 'react';

const Promo = () => {
  return (
    <>
      <section className="promo-container">
        <div className="promo">
          <button className="promo-prev" type="button"></button>
          <button className="promo-next" type="button"></button>
        </div>
      </section>
      {Promobotlabel}
    </>
  );
};

const Promobotlabel = (
  <svg
    className="promo-svg-label"
    width="71"
    height="31"
    viewBox="0 0 71 31"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M4.5 0L36.3462 23L67.5 0H4.5Z" fill="#ffc2a859" />
    </g>
  </svg>
);

export default Promo;
