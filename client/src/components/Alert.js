import React, {Component} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import FontAwesome from 'react-fontawesome';
import {ReactHintFactory} from 'react-hint'
import 'react-hint/css/index.css';
import './Alert.css';

const ReactHint = ReactHintFactory(React);

class Alert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.alert.text,
      copied: false,
      header: ''
    };

    this.toggleCustomHint = this.toggleCustomHint.bind(this);
  }

  toggleCustomHint({target}) {
    if (this.instance.state.target) {
      target = null;
    }

    setTimeout(() => {
      this.instance.setState({
        target: null
      });
    }, 2500);

    this.instance.setState({target});
  }

  generateAlertComponent(message) {
    switch (message.status) {
      case 'ERROR':
        return(<code className="alert alert-error">{message.text}</code>);
      case 'SUCCESS':
        return(
          <pre>
            <ReactHint ref={(ref) => this.instance = ref} />
            <CopyToClipboard text={this.state.value} onCopy={() => this.setState({copied: true})}>
              <FontAwesome className="clipboard" name="clipboard" tag="button" border={true} data-rh="Copied" data-rh-at="left"
                           onClick={this.toggleCustomHint} />
            </CopyToClipboard>
            <div className="alert-wrapper">
              <div className="alert">{this.state.value}</div>
            </div>
          </pre>
        );
      default:
        return '';
    }
  }
  render() {
    return (
      <div className="row">
        <div className="twelve columns response">
          {this.props.header}
          {this.generateAlertComponent(this.props.alert)}
        </div>
      </div>
    )
  }
}

export default Alert;
