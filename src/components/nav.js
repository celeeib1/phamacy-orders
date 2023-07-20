import React, { Component } from "react";
//import { Link } from "react-router-dom";
import SharePoint from "../api_call/SharePoint";
import UrlEndPointGenerator from "../api_call/UrlEndPointGenerator";

export default class nav extends Component {
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
  <div className="row bg_ltblue">
  <div className="col-md-4">
 <img className="img-fluid" src="images/myRxPOGen-wtlogo.png"></img>
 </div>
 <div className="col-md-8">
   <p className="username_loggedin">{this.state.currentlyLoggedInUser.Title}</p>
 </div>
  </div>

);
}
}


    
