import React, {Component} from 'react';
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs';
import VaultTabPanel from './VaultTabPanel';
import KmsTabPanel from './KMSTabPanel';
import './Tabs.css';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kms: false,
      vault: false,
      tabIndex: 0
    };
    this.tabs = [];

    this.selectTab = this.selectTab.bind(this);
  }

  componentWillReceiveProps({kms, vault}) {
    this.setState({
      kms,
      vault: !!vault,
    });
  }

  selectTab(tabIndex) {
    this.setState({
      tabIndex
    });
  }

  render() {
    return(
      <ReactTabs
        disabledTabClassName="disabled"
        selectedTabClassName="active"
        selectedIndex={this.state.tabIndex}
        onSelect={this.selectTab}
      >
        <TabList className="tab-nav">
          { (this.state.kms) ? (<Tab className="tab"><p className="button">KMS</p></Tab>) : '' }
          { (this.state.vault) ? (<Tab className="tab"><p className="button">Vault</p></Tab>) : '' }
        </TabList>
        { (this.state.kms) ? (<TabPanel id="kms"><KmsTabPanel keys={this.state.kms} /></TabPanel>) : '' }
        { (this.state.vault) ? (<TabPanel id="vault"><VaultTabPanel /></TabPanel>) : '' }
      </ReactTabs>
    );
  }
}

export default Tabs;
