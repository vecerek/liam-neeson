import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from './index.scss';

export default class Location extends React.Component {
  componentDidUpdate() {
    this.loadMap();
  }

  loadMap() {
    const { google, location } = this.props;

    if (google) {
      const maps = google.maps;
      const node = ReactDOM.findDOMNode(this.refs.map);

      const mapConfig = Object.assign({}, {
        center: {lat: location.lat, lng: location.long},
        zoom: 11,
        mapTypeId: 'roadmap'
      });

      this.map = new maps.Map(node, mapConfig);
      const marker = new google.maps.Marker({
        position: {lat: location.lat, lng: location.long},
        map: this.map,
        title: location.name
      });
    }
  }

  render() {
    const style = {
      width: '100%',
      height: '250px'
    }

    return (
      <div className={styles.loc}>
        <h3>We know where you are</h3>
        <div ref="map" style={style}>
          loading map...
        </div>
      </div>
    )
  }
}

Location.propTypes = {
  location: PropTypes.string.isRequired
}
