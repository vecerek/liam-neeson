import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

export default function Photos(props) {
  const { photos } = props;

  return <div className={styles.photos}>
    <h3>I know what you do</h3>
    <div className={styles.grid}>
      {photos.map(url => <img key={url} src={url} />)}
    </div>
  </div>
}

Photos.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.string).isRequired
}
