import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import {Input} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {Button, OverlayTrigger, Popover} from 'react-bootstrap';

let RecordShape = {
  domain: React.PropTypes.string,
  recordId: React.PropTypes.number,
  active: React.PropTypes.bool,
  adminUserName: React.PropTypes.string,
  firstName: React.PropTypes.string,
  lastName: React.PropTypes.string,
  contactEmail: React.PropTypes.string,
  tenantRelations: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      recordId: React.PropTypes.number,
      associatedTenantId: React.PropTypes.number,
      relation: React.PropTypes.shape({
        id: React.PropTypes.number,
        name: React.PropTypes.string,
        description: React.PropTypes.string
      })
    })
  ),
  properties: React.PropTypes.shape({
    phone: React.PropTypes.string,
    country: React.PropTypes.string,
    city: React.PropTypes.string,
    clientName: React.PropTypes.string,
    clientId: React.PropTypes.number
  })
};

let TableComponent = React.createClass({
  propTypes: {
    records: React.PropTypes.arrayOf(
      React.PropTypes.shape(RecordShape)
    ),
    selectedRecord: React.PropTypes.shape(RecordShape)
  },

  getDefaultProps() {
    return {records: [], selectedRecord: {}};
  },

  componentDidMount() {
    this.filterActiveRecords(null, 'true');
  },

  onPageChange(page, sizePerPage) {
    //TableDataActions.tableDataPageChange({currentPage: page, sizePerPage: sizePerPage});
  },

  setFilteredResults(filterConds, result) {
    //TableDataActions.tableDataFilteredResults(result);
  },

  onRowSelect(row) {
    //TableDataActions.selectRecord(row);
  },

  filterActiveRecords(event, filter) {
    if (event) {
      event.preventDefault();
    }
    $('.filter').hide();
    $('.filter.' + filter).show();
    this.refs.table.handleFilterData({active: filter === 'all' ? '' : filter});
  },

  exportCSV(event) {
    if (event) {
      event.preventDefault();
    }
    this.refs.table.handleExportCSV();
  },

  search() {
    this.refs.table.handleSearch(this.refs.search.refs.input.value);
  },

  clearSearch() {
    this.refs.search.refs.input.value = '';
    this.search();
  },

  formatClientNameLink(cell, row) {
    return <a href={'/records/' + row.recordId}>{row.clientName}</a>;
  },

  formatActive(cell, row) {
    if (row.active) {
      return <span>Active</span>;
    } else {
      return <span className="deactivated"><i className="fa fa-ban"/> Deactivated</span>;
    }
  },

  formatCell(cell, row) {
    if (row.active) {
      return cell;
    } else {
      return <span className="deactivated">{cell}</span>;
    }
  },

  formatActions(cell, row) {
    return (
      <OverlayTrigger trigger="click" placement="left" rootClose={true}
                      overlay={<Popover id={'popover__action-' + row.recordId}>
                        <div className="list-group">
                          <a className="list-group-item" href={'/records/' + row.recordId}>Details</a>
                          <a className="list-group-item" href="#">Edit</a>
                          <a className="list-group-item" href="#">Add Sub Record</a>
                          <a className="list-group-item" href="#" onClick={(event) => this.toggleActive(event, row.active, row.recordId)}>{row.active ? 'Deactivate' : 'Activate'}</a>
                        </div>
                      </Popover>}>
        <Button bsStyle="link" bsSize="xsmall"><i className="fa fa-ellipsis-h action-trigger"/></Button>
      </OverlayTrigger>
    );
  },

  render() {
    _.each(this.props.records, function(record) {
      record.clientId = record.properties.clientId;
      record.clientName = record.properties.clientName;
      record.actions = '';
    });

    var selected = this.props.selectedRecord.recordId || null;
    var selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      bgColor: 'rgba(248, 199, 15, 0.25)',
      onSelect: this.onRowSelect,
      selected: [selected],
      hideSelectColumn: true
    };

    return (
      <div>
        <div className="container-fluid p0">
          <div className="row toolbar m0">
            <div className="col-xs-6 ph0">
              <h1>Cromuluns</h1>
            </div>
            <div className="col-xs-3 pull-bottom">
              <div className="dropdown pull-right mb++" style={{marginBottom: '20px'}}>
                <a id="dropdown__record-filter" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Options <span className="caret"></span></a>
                <ul className="dropdown-menu" aria-labelledby="dropdown__tenant-filter">
                  <li><a href="#" onClick={(event) => this.filterActiveRecords(event, 'true')}>Show Active Records <i className="fa fa-check pv- filter true"/></a></li>
                  <li><a href="#" onClick={(event) => this.filterActiveRecords(event, 'false')}>Show Inactive Records <i className="fa fa-check pv- filter false"/></a></li>
                  <li><a href="#" onClick={(event) => this.filterActiveRecords(event, 'all')}>Show All Records <i className="fa fa-check pv- filter all"/></a></li>
                </ul>
              </div>
              <span className="ph- pull-right mb++" style={{paddingLeft: '10px', paddingRight: '10px'}}>|</span>
              <a href="#" className="pull-right mb++" onClick={this.exportCSV}>Export <i className="glyphicon glyphicon-export"/></a>
            </div>
            <div className="col-xs-3 ph0 pull-bottom">
              <Input type="text" name="search" ref="search" className="pull-right" onChange={this.search} placeholder="Search"
                     addonAfter={
                  (<i className="fa fa-times-circle-o" onClick={this.clearSearch}/>)
                } />
            </div>
          </div>
        </div>

        <BootstrapTable
          ref="table"
          data={this.props.records}
          pagination={true}
          options={{sortName: 'clientName', sortOrder: 'asc',
            onPageChange: this.onPageChange, sizePerPageList: [2, 5, 10, 25, 50, 100/* All? */],
            afterColumnFilter: this.setFilteredResults, afterSearch: this.setFilteredResults}}
          selectRow={selectRowProp}
          csvFileName="records.csv">
          <TableHeaderColumn dataField="recordId" isKey={true} hidden={true}>Id</TableHeaderColumn>
          <TableHeaderColumn dataField="clientName" dataSort={true} dataFormat={this.formatClientNameLink}>Client Name</TableHeaderColumn>
          <TableHeaderColumn dataField="active" dataSort={true} dataFormat={this.formatActive}>Status</TableHeaderColumn>
          <TableHeaderColumn dataField="clientId" dataSort={true} dataFormat={this.formatCell}>Client Id</TableHeaderColumn>
          <TableHeaderColumn dataField="domain" dataSort={true} dataFormat={this.formatCell}>Domain</TableHeaderColumn>
          <TableHeaderColumn dataField="firstName" dataSort={true} dataFormat={this.formatCell}>First Name</TableHeaderColumn>
          <TableHeaderColumn dataField="lastName" dataSort={true} dataFormat={this.formatCell}>Last Name</TableHeaderColumn>
          <TableHeaderColumn dataField="contactEmail" dataSort={true} dataFormat={this.formatCell}>Email</TableHeaderColumn>
          <TableHeaderColumn dataField="actions" dataFormat={this.formatActions}/>
        </BootstrapTable>

      </div>
    );
  }
});

export {TableComponent as default};


