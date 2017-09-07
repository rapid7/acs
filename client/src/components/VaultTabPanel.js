import React, {Component} from 'react';
import {connect} from 'react-redux';
import {requestVaultSecret, VAULT_INITIAL_STATE} from './../actions/vault';
import {resetStoreAtKey} from '../actions/app';
import Alert from './Alert';

class VaultTabPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secret: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;

    this.setState({
      secret: target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.resetStoreAtKey('vault', VAULT_INITIAL_STATE);
    this.props.requestVaultSecret({
      secret: this.state.secret
    });
  }

  componentWillUnmount() {
    this.props.resetStoreAtKey('vault', VAULT_INITIAL_STATE);
  }

  render() {
    return (
      <div className="form-container">
        <div className="row">
          <div className="six columns">
            <form id="vault_form" name="vault_form" onSubmit={this.handleSubmit}>
              <textarea
                placeholder="Enter secret here."
                className="u-full-width"
                id="vault_secret"
                name="secret"
                autoComplete="off"
                rows="20"
                cols="40"
                maxLength="1024"
                required
                value={this.state.secret}
                onChange={this.handleInputChange}
              />
              <input className="button-primary" id="vault_secret_submit" type="submit" value="Submit secret" />
            </form>
          </div>
        </div>
        <div className="alerts row">
          {
            this.props.vault.map((message, i) => {
              return(<Alert alert={message} key={i} />)
            })
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({vault}) => {
  return {
    vault: [vault.error, ...vault.failure, vault.success].filter((el) => Object.keys(el).length !== 0)
  }
};

export default connect(mapStateToProps, {requestVaultSecret, resetStoreAtKey})(VaultTabPanel);
