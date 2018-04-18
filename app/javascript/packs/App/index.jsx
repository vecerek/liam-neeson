// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import styles from './index.scss';

class App extends React.Component {
  state = {
    steps: ["Do not touch!", "Can't you read?", "This is going to end badly for you"],
    currentStep: 0
  }

  handleClickButton = () => {
    this.setState((prevState, _) => {
      return { currentStep: prevState.currentStep + 1 }
    });
  }

  render() {
    const { steps, currentStep } = this.state;

    return (
      <div>
        {
          currentStep < 3 && (
            <div className={styles["flex-container"]}>
              <a
                className={styles.btn}
                onClick={this.handleClickButton}
              >
                {steps[currentStep]}
              </a>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
