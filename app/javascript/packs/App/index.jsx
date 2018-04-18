// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';

class App extends React.Component {
  state = {
    steps: ["Do not touch!", "Can't you read?", "This is going to end bad"],
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
      <div className="App">
        {
          currentStep < 3 && (
            <button onClick={this.handleClickButton}>{steps[currentStep]}</button>
          )
        }
      </div>
    );
  }
}

export default App;
