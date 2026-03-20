import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Bar({ val, color, max }) {
  const [width, setWidth] = useState('0%');

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(`${(val / max) * 100}%`);
    }, 80);
    return () => clearTimeout(timer);
  }, [val, max]);

  return (
    <div className="bar">
      <div className="bar-f" style={{ width, background: color, transition: 'width 0.4s ease' }} />
    </div>
  );
}

Bar.propTypes = {
  val: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  max: PropTypes.number,
};

Bar.defaultProps = {
  max: 10,
};

export default Bar;
