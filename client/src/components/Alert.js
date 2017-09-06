import React, {Component} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import FontAwesome from 'react-fontawesome';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import './Alert.css';

class Alert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.alert.text,
      copied: false,
      header: '',
      visible: false
    };

    this.timers = [];

    this.afterVisibleChange = this.afterVisibleChange.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
  }

  onVisibleChange(visible) {
    this.setState({
      visible
    });
  }

  afterVisibleChange() {
    this.timers.push(setTimeout(() => {
      this.setState({
        visible: false
      });
    }, 2500));
  }

  componentWillUnmount() {
    this.timers.forEach((t) => clearTimeout(t));
  }

  generateAlertComponent(message) {
    switch (message.status) {
      case 'ERROR':
        return(<code className="alert alert-error">{message.text}</code>);
      case 'SUCCESS':
        return(
          <pre>
              <CopyToClipboard text={this.state.value} onCopy={() => this.setState({copied: true})}>
                <Tooltip
                    visible={this.state.visible}
                    animation="zoom"
                    onVisibleChange={this.onVisibleChange}
                    afterVisibleChange={this.afterVisibleChange}
                    placement="left"
                    trigger="click"
                    overlay="Copied"
                    align={{
                      points: ['cr', 'cl']
                    }}
                >
                  <FontAwesome className="clipboard" name="clipboard" tag="button" border={true}
                    onClick={e => e.preventDefault()} />
                </Tooltip>
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
