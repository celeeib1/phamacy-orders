import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { Alert, Button } from "reactstrap";
import SharePoint from "../api_call/SharePoint";
import UrlEndPointGenerator from "../api_call/UrlEndPointGenerator";
import PurchaseOrderNumberGenerator from "../utility/PurchaseOrderNumberGenerator";
import OrderProduct from "../components/OrderProduct";

export default class RxOrderForm extends Component {
	//#region React Hooks
	constructor(props) {
		super(props);
		this.state = {
			generatedPoNumber: "",
			products: [],
			items: [0],
			spObjects: [{}],
			redirectBack: false,
			messages: [],
		};
	}

	componentDidMount() {
		SharePoint.GetPagedData(UrlEndPointGenerator.GetRxOrderListItems()).then(
			(response) => {
				this.setState({
					generatedPoNumber: PurchaseOrderNumberGenerator.GetNewOrderNumber(),
					products: response,
				});
			}
		);
	}

	render() {
		if (this.state.redirectBack === true) {
			return (
				<Redirect
					to={{
						pathname: "/order-po",
						search: `?title=${this.state.generatedPoNumber}`,
					}}
				/>
			);
		}

		return (
			<div className="container-wide vh-100">
				<div className="row bg_ltblue py-2 px-4">
					<div className="col-md-4">
						<Link to="/">
							<img
								className="img-fluid"
								src="images/myRxPOGen-wtlogo.png"
								alt="logo"
							></img>
						</Link>
					</div>
					<div className="col-md-8">
						{" "}
						<Link to="/" className="nav-link">
							Home
						</Link>
					</div>
				</div>
				<div className="container pb-5">
					<h1 className="my-4">RX Order Form</h1>
					<div className="mt-4">
						{this.state.items.map((d, i) => {
							return (
								<OrderProduct
									key={`item-${i}`}
									products={this.state.products}
									onProductChange={(product) => {
										let spObjects = this.state.spObjects;
										product["Title"] = this.state.generatedPoNumber;
										spObjects[i] = product;
										this.setState({ spObjects: spObjects });
									}}
									isRx={true}
								></OrderProduct>
							);
						})}
					</div>
					<div className="product-add mt-5">
						<Button
							className="px-0"
							color="link"
							onClick={() => {
								let items = this.state.items;
								let spObjects = this.state.spObjects;
								let totalAmountOfItems = items.length;

								items.push(totalAmountOfItems);
								spObjects.push({});

								this.setState({ items: items, spObjects: spObjects });
							}}
						>
							Add more products +
						</Button>
					</div>
					<div className="save text-end mt-2 px-0">
						<Button
							outline
							color="primary"
							onClick={async () => {
								let spObjects = this.state.spObjects;
								let allGood = true;
								let errorMessage = [];

								// Go through the items, we now need to verify something before we push
								for (let i = 0; i < spObjects.length; i++) {
									let obj = spObjects[i];

									if (obj["ProductInfoId"] >= 1 && obj["Quantity"] >= 0) {
										if (obj["PriceAtOrder"] > 100 && obj["RxNumber"] === "") {
											allGood = false;
											errorMessage.push(
												`Item #${
													i + 1
												} Product Is Over $100 But No RX Order Found`
											);
										}
									} else {
										allGood = false;
									}
								}

								// If we pass verification, redirect
								if (allGood) {
									for (let i = 0; i < spObjects.length; i++) {
										let obj = spObjects[i];

										// Make sure this item is worth pushing
										if (obj["ProductInfoId"] >= 1 && obj["Quantity"] >= 0) {
											await SharePoint.PostToSharePoint(
												UrlEndPointGenerator.SaveRxPOListItem(),
												obj,
												false
											);
										}
									}

									this.setState({ redirectBack: true });
								} else {
									this.setState({ messages: errorMessage });
								}
							}}
						>
							Save Order
						</Button>
					</div>
					<div className="mt-2">
						{this.state.messages.map((d, i) => {
							return (
								<Alert color="danger" key={`alert-msg-${i}`}>
									{d}
								</Alert>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
	//#endregion
}
