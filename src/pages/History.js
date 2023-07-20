import React, { Component } from "react";
import { Link } from "react-router-dom";
import SharePoint from "../api_call/SharePoint";
import UrlEndPointGenerator from "../api_call/UrlEndPointGenerator";

export default class History extends Component {
  constructor(props) {
    super(props);
    this.state = { currentlyLoggedInUser: { Title: "" } };
  }

  componentDidMount() {
    SharePoint.GetSingleObject(
      UrlEndPointGenerator.CurrentlyLoggedInUser()
    ).then((response) => {
      this.setState({
        currentlyLoggedInUser: { Title: response["data"]["Title"] },
      });
    });
  }

  render() {
    return (
      <div className="container-wide pb-4">
        <div className="row bg_ltblue py-2 px-4">
          <div className="col-md-4">
            <Link to="/">
              <img className="img-fluid" src="images/myRxPOGen-wtlogo.png" alt="Three Js Pharmacy Logo"></img>
            </Link>
          </div>
          <div className="col-md-8">
          <Link to="/admin-home" className="nav-link">Home</Link>
          </div>
        </div>
        <div className="row home-tiles mt-5">
          <div className="col-md-3 mb-4"></div>
          <div className="col-md-3 mb-4">
            <Link to="/order-po">
            <img className="img-fluid" src="images/rx-icons.png" alt=""></img>
              RX Order History
            </Link>
            <a className="blue-button mt-2" target="_blank" href="https://threejspharmacyinc.sharepoint.com/Lists/RxPO/AllItems.aspx" rel="noopener noreferrer">
             Manage RX PO Entries
            </a>
            <a className="blue-button mt-2" target="_blank" href="https://threejspharmacyinc.sharepoint.com/Lists/RxPO/AllItems.aspx" rel="noopener noreferrer">
             Manage RX Products
            </a>

          </div>
          <div className="col-md-3 mb-4">
            <Link to="/otc-order-history">
            <img className="img-fluid" src="images/otc-order.png" alt=""></img>
              OTC Order History
            </Link>
            <a className="blue-button mt-2" target="_blank" href="https://threejspharmacyinc.sharepoint.com/Lists/OtcProducts/AllItems.aspx" rel="noopener noreferrer">
             Manage OTC PO Entries
            </a>
            <a className="blue-button mt-2" target="_blank" href="https://threejspharmacyinc.sharepoint.com/Lists/OtcPO/AllItems.aspx" rel="noopener noreferrer">
             Manage OTC Products
            </a>

          </div>
         
        </div>
      </div>
    );
  }
}
