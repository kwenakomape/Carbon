import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="slick-arrow slick-next w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl cursor-pointer"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="slick-arrow slick-prev w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl cursor-pointer"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  );
};

export { NextArrow, PrevArrow };