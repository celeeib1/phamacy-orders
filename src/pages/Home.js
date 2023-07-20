import React, { Component } from "react";
import { Link } from "react-router-dom";
import SharePoint from "../api_call/SharePoint";
import UrlEndPointGenerator from "../api_call/UrlEndPointGenerator";

export default class Home extends Component {
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
            <p className="username_loggedin mt-3">
              {this.state.currentlyLoggedInUser.Title}
            </p>
          </div>
        </div>
        <div className="row home-tiles mt-5">
          <div className="col-md-3 mb-4"></div>
          <div className="col-md-3 mb-4">
            <Link to="/order-form">
              <img className="img-fluid" src="images/rx-icons.png" alt=""></img>
              RX Order
            </Link>
          </div>
          <div className="col-md-3 mb-4">
            <Link to="/otc-order-form">
              <img className="img-fluid" src="images/otc-order.png" alt=""></img>
              OTC Order
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
