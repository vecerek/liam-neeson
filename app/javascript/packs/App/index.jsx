// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import * as User from '../User';
import LiamNeeson from '../LiamNeeson';
import GoodLuck from '../GoodLuck';
import config from './config';
import styles from './index.scss';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: ["Do not touch!", "Can't you read?", "This is going to end badly for you"],
      currentStep: 0,
      requiredPermissions: config.requiredPermissions,
      user: null,
      facebookPostUrl: null
    };

    this.checkPermissions = this.checkPermissions.bind(this);
    this.reRequestPermissions = this.reRequestPermissions.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.fetchUserPhotos = this.fetchUserPhotos.bind(this);
    this.fetchUserLocation = this.fetchUserLocation.bind(this);
    this.handleShareOnFacebook = this.handleShareOnFacebook.bind(this);
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
          this.fetchUserData();
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

  checkPermissions() {
    FB.api(
      "/me/permissions",
      function (response) {
        if (response && !response.error) {
          const requiredPermissions = response.data
            .filter(perm => perm.status === "declined")
            .map(perm => perm.permission);

          this.setState({ requiredPermissions: requiredPermissions });
        }
      }.bind(this)
    );
  }

  fetchUserInfo() {
    FB.api('/me', {fields: ["first_name", "last_name", "email", "location", "picture.width(500).height(500)"]}, function(response) {
      const user = Object.assign({}, this.state.user);
      const { first_name, last_name, location, picture } = response;

      if (location) {
        this.fetchUserLocation(location.name);
      }

      this.setState({ user: Object.assign({}, user, {
        firstName: first_name,
        lastName: last_name,
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
        const user = Object.assign({}, this.state.user);
        const location = data.results[0].geometry.location;

        this.setState({
          user: Object.assign({}, user, {
          location: {
            name: "Liam Neeson meeting place",
            lat: location.lat,
            long: location.lng
          }
        })});
      });
  }

  fetchUserData() {
    this.checkPermissions();
    this.fetchUserInfo();
    this.fetchUserPhotos();
  }

  reRequestPermissions() {
    FB.login(({ status }) => {
        if (status === "connected") {
          this.fetchUserData();
        }
      },
      {
        scope: this.state.requiredPermissions.join(','),
        auth_type: 'rerequest'
      }
    );
  }

  facebookLogin = () => {
    FB.login(() => {}, {scope: config.requiredPermissions.join(',')});
  };

  handleClickButton = () => {
    const { currentStep } = this.state;

    if (currentStep === 2) {
      this.facebookLogin();
    } else if(currentStep > 2) {
      this.reRequestPermissions();
    }

    this.setState((prevState, _) => {
      return { currentStep: prevState.currentStep + 1 }
    });
  }

  handleShareOnFacebook() {
    const fbPost = {
      message: "I'm in huge troubles. It seems like I have pissed off Liam Neeson. He's coming for me. \nIf there's anyone who could provide me a temporary shelter, PM me. \n\nPLEASE...",
      link: "https://liam-neeson.herokuapp.com/"
    }

    FB.api('/me/feed', 'post', fbPost, function(response) {
      if (!response || response.error) {
        console.log('Error occured', response);
      } else {
        const postIds = response.id.split("_");
        const url = `https://facebook.com/${postIds[0]}/posts/${postIds[1]}`;

        this.setState({ facebookPostUrl:  url });
      }
    }.bind(this));
  }

  render() {
    const { steps, currentStep, requiredPermissions, user, facebookPostUrl } = this.state;
    const permissionsMissing = requiredPermissions.length > 0;
    const introButtonTitle = currentStep < 3
      ? steps[currentStep]
      : "All-in or go home";

    return (
      <React.Fragment>
        {permissionsMissing && (
          <div className={styles.centerWrapper}>
            <div className={styles["flex-container"]}>
              <a
                className={styles.btn}
                onClick={this.handleClickButton}
              >
                {introButtonTitle}
              </a>
            </div>
          </div>
        )}
        {user && !permissionsMissing && (
          <React.Fragment>
            {facebookPostUrl ?
              <React.Fragment>
                <GoodLuck />
                <div>
                  <a
                    className={styles.btn}
                    href={facebookPostUrl}
                    target="_blank"
                  >
                    Run for your life
                  </a>
                </div>
              </React.Fragment> :
              <React.Fragment>
                <LiamNeeson />
                <div>
                  <a
                    className={styles.btn}
                    onClick={this.handleShareOnFacebook}
                  >
                    Who do you think you are?
                  </a>
                </div>
              </React.Fragment>
            }
            <div className={styles.results}>
              {user.firstName && (
                <User.Profile
                  name={[user.firstName, user.lastName].join(" ")}
                  pictureUrl={user.pictureUrl}
                />
              )}
              {user.photos && user.photos.length > 0 && (
                <User.Photos photos={user.photos} />
              )}
              {user.location && (
                <User.Location
                  google={this.props.google}
                  location={user.location}
                />
              )}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: config.googleApiKey,
})(App)
