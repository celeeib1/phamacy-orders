import React, { Component } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { Table } from "reactstrap";
import SharePoint from "../api_call/SharePoint";
import UrlEndPointGenerator from "../api_call/UrlEndPointGenerator";
import DateAssistant from "../utility/DateAssistant";

export default class RxPOList extends Component {
	//#region React Hooks
	constructor(props) {
		super(props);
		this.state = { items: [] };
	}
	componentDidMount() {
		let qs = queryString.parse(this.props.location.search);
		let url = UrlEndPointGenerator.GetRxPOListItems();

		if (qs["title"]) {
			url = UrlEndPointGenerator.GetRxPOListItemsFromOrder(qs["title"]);
		}

		SharePoint.GetPagedData(url).then((response) => {
			this.setState({ items: response });
		});
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
					<div className="col-md-8">
						<Link to="/" className="nav-link">
							Home
						</Link>
					</div>
				</div>
				<div className="container pb-5">
					<h1 className="my-4">Purchase Order</h1>
					<Table size="sm" responsive striped className="mt-2">
						<thead>
							<tr>
								<th>Supplier Code</th>
								<th>Universal NDC</th>
								<th>Drug Name</th>
								<th>Unit Price</th>
								<th>Quantity</th>
                <th>RX Number</th>
                <th>PO Date</th>
								<th className="text-right">Total</th>
							</tr>
						</thead>
						<tbody>
							{this.state.items.map((d, i) => {
								return (
									<tr key={`rx-order-item-${i}`}>
										<td>{d["ProductInfo"]["SupplierCode"]}</td>
										<td>{d["ProductInfo"]["UniversalNDC"]}</td>
										<td>{d["ProductInfo"]["DrugName"]}</td>
										<td>{`$${d["PriceAtOrder"]}`}</td>
										<td>{d["Quantity"]}</td>
                    <td>{d["RxNumber"]}</td>
                    <td>{DateAssistant.GetStandardMonthDateYearString(d["PoDate"])}</td>
										<td className="text-right">{`$${d["Total"]}`}</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
					<div className="text-end mt-2 px-0 text-right">
						<strong>Total ${this.calculateTotal(this.state.items)}</strong>
					</div>
					<button
						type="button"
						className="btn-primary btn-outline-primary"
						onClick={() => window.print()}
					>
						Print/PDF
					</button>
				</div>
			</div>
		);
	}
	//#endregion

	//#region Private Methods
	calculateTotal = (items) => {
		let tally = 0;

		items.forEach((i) => {
			let parse = parseFloat(i["Total"]);
			if (!isNaN(parse)) tally += parse;
		});

		return tally.toFixed(2);
	};
	//#endregion
}
