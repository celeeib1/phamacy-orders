import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import SharePoint from "../api_call/SharePoint";
import UrlEndPointGenerator from "../api_call/UrlEndPointGenerator";
import PurchaseOrderNumberGenerator from "../utility/PurchaseOrderNumberGenerator";
import OrderProduct from "../components/OrderProduct";

export default class OtcOrderForm extends Component {
	//#region React Hooks
	constructor(props) {
		super(props);
		this.state = {
			generatedPoNumber: "",
			products: [],
			items: [0],
			spObjects: [{}],
			redirectBack: false,
		};
	}

	componentDidMount() {
		SharePoint.GetPagedData(UrlEndPointGenerator.GetOtcProducts()).then(
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
						pathname: "/otc-order-history",
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
						<Link to="/" className="nav-link">
							Home
						</Link>
					</div>
				</div>
				<div className="container pb-5">
					<h1 className="my-4">OTC Order Form</h1>
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
									isRx={false}
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

								for (let i = 0; i < spObjects.length; i++) {
									let obj = spObjects[i];

									// Make sure this item is worth pushing
									if (obj["OtcProductId"] >= 1 && obj["Quantity"] >= 0) {
										await SharePoint.PostToSharePoint(
											UrlEndPointGenerator.SaveOtcOrdersListItem(),
											obj,
											false
										);
									}
								}

								this.setState({ redirectBack: true });
							}}
						>
							Save Order
						</Button>
					</div>
				</div>
			</div>
		);
	}
	//#endregion
}
