import React from 'react';
import './Header.css';

const Header = ({title, version}) => (
  <div id="header" className="u-full-width">
    <h1 id="title" className="u-pull-left">{title}</h1>
    <ul className="u-pull-right">
      <li><a href="/" className="selected">Encryption - {version}</a></li>
      <li/>
    </ul>
  </div>
);

export default Header;
