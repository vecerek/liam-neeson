import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';

export default function Profile (props) {
  return <div className={styles.profile}>
    <h3>I know who you are</h3>
    <img
      src={props.pictureUrl}
      title="Our most recent target"
      alt="Our most recent target" />
    <div>{props.name}</div>
  </div>
}

Profile.propTypes = {
  name: PropTypes.string,
  pictureUrl: PropTypes.string
}
