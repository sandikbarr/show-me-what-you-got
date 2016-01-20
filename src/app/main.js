/* eslint no-undef: 0 */
import React from 'react';
import ReactDOM from 'react-dom';

var $ = require('jquery');
window.jQuery = $;
jQuery = $;

require('bootstrap-webpack');
require('bootstrap-webpack!./bootstrap.config.js');

require('font-awesome-webpack');

import './react-bootstrap-table.css';
import './app.less';

import TableComponent from './app';

let records = JSON.parse(require('./tableData.json'));
let selectedRecord = {};

ReactDOM.render(
  <TableComponent records={records} selectedRecord={selectedRecord}/>,
  document.getElementById('react-bootstrap-table-example')
);
