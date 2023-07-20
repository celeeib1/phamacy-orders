import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import { Container } from "reactstrap";
import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./pages/Dashboard";
import RxOrderList from "./pages/RxOrderList";
import RxPOList from "./pages/RxPOList";
import RxOrderForm from "./pages/RxOrderForm";
import OtcOrderForm from "./pages/OtcOrderForm";
import OtcOrderHistory from "./pages/OrderHistory"
import History from "./pages/History"
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Container fluid className="App">
          <Route exact={true} path="/" component={Home} />
          <Route exact={true} path="/order-list" component={RxOrderList} />
          <Route exact={true} path="/order-po" component={RxPOList} />
          <Route exact={true} path="/order-form" component={RxOrderForm} />
          <Route exact={true} path="/dashboard" component={Dashboard} />
          <Route exact={true} path="/otc-order-form" component={OtcOrderForm} />
          <Route exact={true} path="/otc-order-history" component={OtcOrderHistory} />
          <Route exact={true} path="/history" component={History} />
          <Route exact={true} path="/admin-home" component={AdminHome} />
        </Container>
      </HashRouter>
    );
  }
}

export default App;
