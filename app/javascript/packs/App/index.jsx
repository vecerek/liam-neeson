// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import styles from './index.scss';

class App extends React.Component {
  state = {
    steps: ["Do not touch!", "Can't you read?", "This is going to end badly for you"],
    currentStep: 0,
    user: null
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

  facebookLogin = () => {
    FB.login(() => {}, {scope: 'public_profile,email'});
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

  render() {
    const { steps, currentStep, user } = this.state;

    return (
      <div className={styles["flex-container"]}>
        {
          !user && currentStep < 3 && (
            <a
              className={styles.btn}
              onClick={this.handleClickButton}
            >
              {steps[currentStep]}
            </a>
          )
        }
        {
          user && (
            <ul>
              <li>User ID: {user.id}</li>
              <li>accessToken: {user.accessToken}</li>
              <li>expiresIn: {user.expiresIn}</li>
            </ul>
          )
        }
      </div>
    );
  }
}

export default App;
