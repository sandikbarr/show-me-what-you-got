import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import {Input} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

let TableComponent = React.createClass ({
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
      <div className="dropdown">
        <div className="action-wrapper">
          <a id={'dropdown__action-' + row.recordId} href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            <i className="fa fa-ellipsis-h action-trigger"/>
          </a>
          <ul className="dropdown-menu dropdown-menu-right" aria-labelledby={'dropdown__action-' + row.recordId}>
            <li><a href={'/records/' + row.recordId}>Details</a></li>
            <li><a href="#">Edit</a></li>
            <li><a href="#">Add Sub Record</a></li>
            <li><a href="#">{row.active ? 'Deactivate' : 'Activate'}</a></li>
          </ul>
        </div>
      </div>
    );
  },


  render() {
    _.each(this.props.tenants, function(tenant) {
      tenant.clientId = tenant.properties.clientId;
      tenant.clientName = tenant.properties.clientName;
      tenant.actions = '';
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
              <div className="dropdown pull-right mb++">
                <a id="dropdown__record-filter" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Options <span className="caret"></span></a>
                <ul className="dropdown-menu" aria-labelledby="dropdown__tenant-filter">
                  <li><a href="#" onClick={(event) => this.filterActiveRecords(event, 'true')}>Show Active Records <i className="fa fa-check pv- filter true"/></a></li>
                  <li><a href="#" onClick={(event) => this.filterActiveRecords(event, 'false')}>Show Inactive Records <i className="fa fa-check pv- filter false"/></a></li>
                  <li><a href="#" onClick={(event) => this.filterActiveRecords(event, 'all')}>Show All Records <i className="fa fa-check pv- filter all"/></a></li>
                </ul>
              </div>
              <span className="ph- pull-right mb++">|</span>
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
            onPageChange: this.onPageChange, sizePerPageList: [10, 25, 50, 100 /* All? */],
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

let records = [
  {
    "domain": "unknown",
    "recordId": 1,
    "active": true,
    "adminUserName": "adminusername",
    "firstName": "Rick",
    "lastName": "Sanchez",
    "contactEmail": "rick@schwifty.com",
    "tenantRelations": [
      {
        "recordId": 2,
        "associatedTenantId": 3,
        "relation": {
          "id": 1,
          "name": "PARENT",
          "description": "Parent association"
        }
      }
    ],
    "properties": {
      "phone": "1234567890",
      "country": "USA",
      "city": "New York",
      "clientName": "Schwifty",
      "clientId": 1
    }
  },
  {
    "domain": "nwest.com",
    "recordId": 2,
    "active": false,
    "adminUserName": "adminusername",
    "firstName": "Morty",
    "lastName": "Smith",
    "contactEmail": "mortysmith@harryherpson.edu",
    "tenantRelations": [
      {
        "recordId": 3,
        "associatedTenantId": 5,
        "relation": {
          "id": 5,
          "name": "PARENT",
          "description": "Parent association"
        }
      }
    ],
    "properties": {
      "phone": "1234567891",
      "country": "USA",
      "city": "Manhattan",
      "clientName": "Smith",
      "clientId": 2
    }
  },
  {
    "domain": "summer.com",
    "recordId": 3,
    "active": true,
    "adminUserName": "adminusername",
    "firstName": "Summer",
    "lastName": "Smith",
    "contactEmail": "summersmith@harryherpson.com",
    "tenantRelations": [
      {
        "recordId": 5,
        "associatedTenantId": 6,
        "relation": {
          "id": 5,
          "name": "PARENT",
          "description": "Parent association"
        }
      }
    ],
    "properties": {
      "phone": "1234567892",
      "country": "USA",
      "city": "Newark",
      "clientName": "Snuffles",
      "clientId": 3
    }
  },
  {
    "domain": "jerry.com",
    "recordId": 4,
    "active": true,
    "adminUserName": "adminusername",
    "firstName": "Jerry",
    "lastName": "Smith",
    "contactEmail": "jerrysmith@smith.com",
    "tenantRelations": [
      {
        "recordId": 6,
        "associatedTenantId": 7,
        "relation": {
          "id": 6,
          "name": "PARENT",
          "description": "Parent association"
        }
      }
    ],
    "properties": {
      "phone": "1234567893",
      "country": "USA",
      "city": "Tribeca",
      "clientName": "NEAST",
      "clientId": 4
    }
  },
  {
    "domain": "beth.com",
    "recordId": 5,
    "active": true,
    "adminUserName": "adminusername",
    "firstName": "Beth",
    "lastName": "Smith",
    "contactEmail": "bethsmith@beth.com",
    "tenantRelations": [
      {
        "recordId": 7,
        "associatedTenantId": 8,
        "relation": {
          "id": 7,
          "name": "PARENT",
          "description": "Parent association"
        }
      }
    ],
    "properties": {
      "phone": "1234567894",
      "country": "USA",
      "city": "Brooklyn",
      "clientName": "BETH",
      "clientId": 5
    }
  }
];

let selectedRecord = {};

React.render(
  <TableComponent records={records} selectedRecord={selectedRecord}/>,
  document.getElementById('react-bootstrap-table-example')
);

