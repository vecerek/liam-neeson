// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import * as User from '../User';
import LiamNeeson from '../LiamNeeson';
import config from './config';
import styles from './index.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: ["Do not touch!", "Can't you read?", "This is going to end badly for you"],
      currentStep: 0,
      user: null
    };

    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.fetchUserPhotos = this.fetchUserPhotos.bind(this);
    this.fetchUserLocation = this.fetchUserLocation.bind(this);
  }

  componentDidMount() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '193797768067544',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.12'
      });

      window.FB.Event.subscribe('auth.statusChange', ({ authResponse }) => {
        const user = authResponse ? {
          id: authResponse.userID,
          accessToken: authResponse.accessToken,
          expiresIn: authResponse.expiresIn
        } : null;

        this.setState({ user: user });

        if (user) {
          this.fetchUserInfo();
          this.fetchUserPhotos();
        }
      });

    }.bind(this);

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  componentWillMount() {
    console.log("Component will mount", this.state);
  }

  fetchUserInfo() {
    FB.api('/me', {fields: ["first_name", "last_name", "email", "location", "picture.width(500).height(500)"]}, function(response) {
      const user = Object.assign({}, this.state.user);
      const { first_name, last_name, email, location, picture } = response;
      this.fetchUserLocation(location.name);

      this.setState({ user: Object.assign({}, user, {
        firstName: first_name,
        lastName: last_name,
        email,
        pictureUrl: picture.data.url
      })})
    }.bind(this));
  }

  fetchUserPhotos() {
    FB.api('/me/photos', {type: "tagged", fields: "images"}, function(response) {
      const user = Object.assign({}, this.state.user);
      const photos = response.data
        .slice(0, 4)
        .map(el => el.images.find(image => image.height === 480).source);

      this.setState({ user: Object.assign({}, user, { photos })});
    }.bind(this));
  }

  fetchUserLocation(loc) {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${loc.replace(" ", "+")}&key=${config.googleApiKey}`)
      .then(results => results.json())
      .then(data => {
        console.log(data);
        const user = Object.assign({}, this.state.user);
        const location = data.results[0].geometry.location;

        this.setState({ user: Object.assign({}, user, {
          location: {
            name: "Liam Neeson meeting place",
            lat: location.lat,
            long: location.lng
          }
        }) })
      });
  }

  facebookLogin = () => {
    FB.login(() => {}, {scope: 'public_profile,email,user_location,user_photos,publish_actions'});
  };

  handleClickButton = () => {
    if (this.state.currentStep === 2) {
      this.facebookLogin();
    } else {

    }

    this.setState((prevState, _) => {
      return { currentStep: prevState.currentStep + 1 }
    });
  }

  handleShareOnFacebook = () => {
    console.log("Shared on Facebook");
  }

  render() {
    const { steps, currentStep, user } = this.state;

    return (
      <React.Fragment>
        {!user && currentStep < 3 && (
          <div className={styles.centerWrapper}>
            <div className={styles["flex-container"]}>
              <a
                className={styles.btn}
                onClick={this.handleClickButton}
              >
                {steps[currentStep]}
              </a>
            </div>
          </div>
        )}
        {user && (
          <React.Fragment>
            <LiamNeeson />
            <div className={styles.results}>
              {user.firstName && (
                <User.Profile
                  name={[user.firstName, user.lastName].join(" ")}
                  pictureUrl={user.pictureUrl}
                />
              )}
              {user.photos && (
                <User.Photos photos={user.photos} />
              )}
              {user.location && (
                <User.Location
                  google={this.props.google}
                  location={user.location}
                />
              )}
            </div>
            <a
              className={styles.btn}
              onClick={this.handleShareOnFacebook}
            >
              Run for your life
            </a>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: config.googleApiKey,
})(App)
