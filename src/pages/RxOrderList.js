import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Table } from "reactstrap";
import SharePoint from "../api_call/SharePoint";
import UrlEndPointGenerator from "../api_call/UrlEndPointGenerator";

export default class RxOrderList extends Component {
  constructor(props) {
    super(props);
    this.state = { items: [] };
  }

  componentDidMount() {
    SharePoint.GetPagedData(UrlEndPointGenerator.GetRxOrderListItems()).then(
      (response) => {
        this.setState({ items: response });
      }
    );
  }

  render() {
    return (
      <div className="container-wide vh-100">
        <div className="row bg_ltblue py-2 px-4">
          <div className="col-md-4">
            <Link to="/">
              <img
                className="img-fluid"
                src="images/myRxPOGen-wtlogo.png"
                alt=""
              ></img>
            </Link>
          </div>
          <div className="col-md-8"> <Link to="/" className="nav-link">Home</Link></div>
        </div>

        <div className="container pb-5">
          <h1 className="my-4">RX Order Product List</h1>
          <div></div>

          <Table size="sm" responsive bordered striped>
            <thead>
              <tr>
                <th>Drug Name</th>
                <th>Supplier Code</th>
                <th>Universal NDC</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {this.state.items.map((d, i) => {
                return (
                  <tr key={`rx-order-item-${i}`}>
                    <td>{d["DrugName"]}</td>
                    <td>{d["SupplierCode"]}</td>
                    <td>{d["UniversalNDC"]}</td>
                    <td>{d["UnitPrice"]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}
