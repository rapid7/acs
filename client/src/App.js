import React, {Component} from 'react';
import {connect} from 'react-redux';

import {fetchApp} from './actions/app';
import Header from './components/Header';
import Tabs from './components/Tabs';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: '0.0.0',
      kms: false,
      vault: false
    };
  }

  componentDidMount() {
    this.props.fetchApp();
  }

  render() {
    return (
      <div className="App">
        <Header title="ACS" version={this.props.version}/>
        <div className="container">
          <div className="row">
            <div className="twelve columns">
              <p id="tagline">Welcome to ACS, please supply your secret.</p>
            </div>
          </div>
          <div className="row">
            <div className="twelve columns">
              <Tabs kms={this.props.kms} vault={this.props.vault} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({app: {success}}) => {
  const app = success;
  if (app.backends) {
    return {
      version: app.version,
      kms: app.backends.kms,
      vault: app.backends.vault
    };
  }

  return app;
};

export default connect(mapStateToProps, {fetchApp})(App);
