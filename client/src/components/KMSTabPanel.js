import React, {Component} from 'react';
import {connect} from 'react-redux';
import {requestKmsSecret, KMS_INITIAL_STATE} from './../actions/kms';
import {resetStoreAtKey} from '../actions/app';
import Alert from './Alert';

class KMSTabPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keys: this.props.keys,
      selectedKeys: [],
      secret: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const type = target.type;
    const stateChange = {};

    if (type === 'select-multiple') {
      stateChange[name] = Array.from(target.options).map((option) => {
        if (option.selected) {
          return option.value;
        }
        return false;
      }).filter((o) => !!o);
    } else {
      stateChange[name] = target.value;
    }

    this.setState(stateChange);
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.resetStoreAtKey('kms', KMS_INITIAL_STATE);
    const payload = {
      secret: this.state.secret,
      keys: this.state.selectedKeys
    };
    this.props.requestSecret(payload);
  }

  componentWillUnmount() {
    this.props.resetStoreAtKey('kms', KMS_INITIAL_STATE);
  }

  render() {
    const selectedValues = [];
    const keys = [];

    this.state.keys.forEach((r) => {
      const value = JSON.stringify(r);
      if (this.state.selectedKeys.indexOf(value) !== -1) {
        selectedValues.push(value);
      }

      keys.push(
        <option key={r.key} value={value}>
          {`${r.account} - ${r.region}`}
        </option>
      );
    });

    return (
      <div className="form-container">
        <div className="row">
          <div className="six columns">
            <form id="kms_form" name="kms_form" onSubmit={this.handleSubmit}>
              <p>Select the region in which to encrypt your secret:</p>
              <select
                multiple
                className="u-full-width"
                id="kms_key"
                name="selectedKeys"
                size={this.state.keys.length}
                value={selectedValues}
                onChange={this.handleInputChange}
              >
                {keys}
              </select>
              <textarea
                className="u-full-width"
                id="kms_secret"
                name="secret"
                autoComplete="off"
                rows="20" cols="40" maxLength="1024"
                value={this.state.secret}
                onChange={this.handleInputChange}
                required/>
              <input className="button-primary" id="kms_secret_submit" type="submit" value="Submit secret" />
            </form>
          </div>
        </div>
        {
          this.props.kms.map((message, i) => {
            const header = (message.account && message.region) ? <h5>{message.account} - {message.region}</h5> : '';
            return(<Alert alert={message} key={i} header={header} />)
          })
        }
      </div>
    );
  }
}

const mapStateToProps = ({kms}) => {
  return {
    kms: [ ...kms.failure, ...kms.success, ...kms.error]
  }
};

export default connect(mapStateToProps, {requestSecret: requestKmsSecret, resetStoreAtKey})(KMSTabPanel);
