import React, { Component } from "react";
import { Col, Form, Input, Label, Row } from "reactstrap";
import Autocomplete from "react-autocomplete";
import DateAssistant from "../utility/DateAssistant";

export default class OrderProduct extends Component {
	//#region React Hooks
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			product: -1,
			supplierCode: "",
			ndc: "",
			price: "",
			quantity: 1,
			total: "0",
			value: "",
			isRx: true,
			rxNumber: "",
			poDate: new Date(),
		};
	}
	componentDidMount() {
		if (this.props.products) {
			this.setState({ products: this.props.products, isRx: this.props.isRx });
		}
	}
	componentDidUpdate(prevProps) {
		if (prevProps.products.length !== this.props.products.length) {
			this.setState({ products: this.props.products });
		}

		if (prevProps.isRx !== this.props.isRx) {
			this.setState({ isRx: this.props.isRx });
		}
	}
	render() {
		if (this.state.isRx) {
			return (
				<div>
					<Form>
						<Row>
							<Col md="">
								<Label for="product">Product</Label>
								<div>
									<Autocomplete
										className="form-control"
										autoHighlight={true}
										getItemValue={(item) => item["DrugName"]}
										items={this.state.products}
										renderItem={(item, isHighlighted) => (
											<div
												key={item["DrugName"]}
												style={{
													background: isHighlighted ? "lightgray" : "white",
												}}
											>
												{item.DrugName}
											</div>
										)}
										value={this.state.value}
										onChange={(event, value) => this.setState({ value })}
										onSelect={(value) => {
											let selectedProduct = this.getProductFromDrugName(value);
											this.setState(
												{
													product: selectedProduct["ID"],
													supplierCode: selectedProduct.SupplierCode
														? selectedProduct.SupplierCode
														: "",
													ndc: selectedProduct.UniversalNDC
														? selectedProduct.UniversalNDC
														: "",
													price: selectedProduct.UnitPrice
														? selectedProduct.UnitPrice
														: "",
													quantity: 1,
													total: this.calculateNewTotal(
														1,
														selectedProduct.UnitPrice
															? selectedProduct.UnitPrice
															: "0"
													).toFixed(2),
													value: value,
												},
												() => {
													if (this.props.onProductChange) {
														this.props.onProductChange(
															this.state.isRx
																? this.buildSharePointObject()
																: this.buildSharePointObjectOtc()
														);
													}
												}
											);
										}}
										menuStyle={{
											borderRadius: "3px",
											boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
											background: "rgba(255, 255, 255, 0.9)",
											padding: "2px 0",
											fontSize: "90%",
											position: "fixed",
											overflow: "auto",
											maxHeight: "50%",
											zIndex: "10",
										}}
										shouldItemRender={(item, value) =>
											item.DrugName.toLowerCase().indexOf(value.toLowerCase()) >
											-1
										}
										sortItems={this.sortStates}
									/>
								</div>
							</Col>
							<Col md="">
								<Label for="supplier">Supplier code</Label>
								<Input
									type="text"
									plaintext
									bsSize="sm"
									name="supplier"
									id="supplier"
									defaultValue={this.state.supplierCode}
								></Input>
							</Col>
							<Col md="">
								<Label for="ndc">Universal NDC</Label>
								<Input
									type="text"
									plaintext
									bsSize="sm"
									name="ndc"
									id="ndc"
									defaultValue={this.state.ndc}
								></Input>
							</Col>
							<Col md="">
								<Label for="price">Unit Price</Label>
								<Input
									type="text"
									plaintext
									bsSize="sm"
									name="price"
									id="price"
									defaultValue={this.state.price}
								></Input>
							</Col>
							<Col md="">
								<Label for="quantity">Quantity</Label>
								<Input
									type="number"
									bsSize="sm"
									name="quantity"
									id="quantity"
									value={this.state.quantity}
									onChange={(event) => {
										let qty = parseInt(event.target.value, 10);
										this.setState(
											{
												quantity: qty,
												total: this.calculateNewTotal(
													qty,
													this.state.price
												).toFixed(2),
											},
											() => {
												if (this.props.onProductChange) {
													this.props.onProductChange(
														this.state.isRx
															? this.buildSharePointObject()
															: this.buildSharePointObjectOtc()
													);
												}
											}
										);
									}}
								></Input>
							</Col>
							<Col md="">
								<Label for="rxNumber">RX Number</Label>
								<Input
									type="text"
									bsSize="sm"
									name="rxNumber"
									id="rxNumber"
									value={this.state.rxNumber}
									onChange={(event) => {
										let newRxNumber = event.target.value;
										this.setState({ rxNumber: newRxNumber }, () => {
											if (this.props.onProductChange) {
												this.props.onProductChange(
													this.state.isRx
														? this.buildSharePointObject()
														: this.buildSharePointObjectOtc()
												);
											}
										});
									}}
								></Input>
							</Col>
							<Col md="">
								<Label for="poDate">PO Date</Label>
								<Input
									type="date"
									bsSize="sm"
									name="poDate"
									id="poDate"
									placeholder="PO Date"
									value={DateAssistant.GetSharePointDateFormat(
										this.state.poDate
									)}
									onChange={(event) => {
										let newPoDate = new Date(event.target.value);
										this.setState({ poDate: newPoDate }, () => {
											if (this.props.onProductChange) {
												this.props.onProductChange(
													this.state.isRx
														? this.buildSharePointObject()
														: this.buildSharePointObjectOtc()
												);
											}
										});
									}}
								/>
							</Col>
							<Col md="" className="text-right">
								<Label for="total">Total</Label>
								<Input
									className="text-right"
									type="text"
									plaintext
									readOnly
									bsSize="sm"
									name="total"
									id="total"
									value={`$${this.state.total}`}
								></Input>
							</Col>
						</Row>
					</Form>
					<hr />
				</div>
			);
		} else {
			return (
				<div>
					<Form>
						<Row>
							<Col md="">
								<Label for="product">Product</Label>
								<div>
									<Autocomplete
										className="form-control"
										autoHighlight={true}
										getItemValue={(item) => item["DrugName"]}
										items={this.state.products}
										renderItem={(item, isHighlighted) => (
											<div
												key={item["DrugName"]}
												style={{
													background: isHighlighted ? "lightgray" : "white",
												}}
											>
												{item.DrugName}
											</div>
										)}
										value={this.state.value}
										onChange={(event, value) => this.setState({ value })}
										onSelect={(value) => {
											let selectedProduct = this.getProductFromDrugName(value);
											this.setState(
												{
													product: selectedProduct["ID"],
													supplierCode: selectedProduct.SupplierCode
														? selectedProduct.SupplierCode
														: "",
													ndc: selectedProduct.UniversalNDC
														? selectedProduct.UniversalNDC
														: "",
													price: selectedProduct.UnitPrice
														? selectedProduct.UnitPrice
														: "",
													quantity: 1,
													total: this.calculateNewTotal(
														1,
														selectedProduct.UnitPrice
															? selectedProduct.UnitPrice
															: "0"
													).toFixed(2),
													value: value,
												},
												() => {
													if (this.props.onProductChange) {
														this.props.onProductChange(
															this.state.isRx
																? this.buildSharePointObject()
																: this.buildSharePointObjectOtc()
														);
													}
												}
											);
										}}
										menuStyle={{
											borderRadius: "3px",
											boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
											background: "rgba(255, 255, 255, 0.9)",
											padding: "2px 0",
											fontSize: "90%",
											position: "fixed",
											overflow: "auto",
											maxHeight: "50%",
											zIndex: "10",
										}}
										shouldItemRender={(item, value) =>
											item.DrugName.toLowerCase().indexOf(value.toLowerCase()) >
											-1
										}
										sortItems={this.sortStates}
									/>
								</div>
							</Col>
							<Col md="">
								<Label for="supplier">Supplier code</Label>
								<Input
									type="text"
									plaintext
									bsSize="sm"
									name="supplier"
									id="supplier"
									defaultValue={this.state.supplierCode}
								></Input>
							</Col>
							<Col md="">
								<Label for="ndc">Universal NDC</Label>
								<Input
									type="text"
									plaintext
									bsSize="sm"
									name="ndc"
									id="ndc"
									defaultValue={this.state.ndc}
								></Input>
							</Col>
							<Col md="">
								<Label for="price">Unit Price</Label>
								<Input
									type="text"
									plaintext
									bsSize="sm"
									name="price"
									id="price"
									defaultValue={this.state.price}
								></Input>
							</Col>
							<Col md="">
								<Label for="quantity">Quantity</Label>
								<Input
									type="number"
									bsSize="sm"
									name="quantity"
									id="quantity"
									value={this.state.quantity}
									onChange={(event) => {
										let qty = parseInt(event.target.value, 10);
										this.setState(
											{
												quantity: qty,
												total: this.calculateNewTotal(
													qty,
													this.state.price
												).toFixed(2),
											},
											() => {
												if (this.props.onProductChange) {
													this.props.onProductChange(
														this.state.isRx
															? this.buildSharePointObject()
															: this.buildSharePointObjectOtc()
													);
												}
											}
										);
									}}
								></Input>
							</Col>
							<Col md="">
								<Label for="poDate">PO Date</Label>
								<Input
									type="date"
									bsSize="sm"
									name="poDate"
									id="poDate"
									placeholder="PO Date"
									value={DateAssistant.GetSharePointDateFormat(
										this.state.poDate
									)}
									onChange={(event) => {
										let newPoDate = new Date(event.target.value);
										this.setState({ poDate: newPoDate }, () => {
											if (this.props.onProductChange) {
												this.props.onProductChange(
													this.state.isRx
														? this.buildSharePointObject()
														: this.buildSharePointObjectOtc()
												);
											}
										});
									}}
								/>
							</Col>
							<Col md="" className="text-right">
								<Label for="total">Total</Label>
								<Input
									className="text-right"
									type="text"
									plaintext
									readOnly
									bsSize="sm"
									name="total"
									id="total"
									value={`$${this.state.total}`}
								></Input>
							</Col>
						</Row>
					</Form>
					<hr />
				</div>
			);
		}
	}
	//#endregion

	//#region Private Methods
	getProductFromId = (id) => {
		let product = {};

		this.state.products.forEach((p) => {
			if (p["ID"] === parseInt(id, 10)) {
				product = p;
			}
		});

		return product;
	};
	getProductFromDrugName = (name) => {
		let product = {};

		this.state.products.forEach((p) => {
			if (p["DrugName"].toLowerCase() === name.toLowerCase()) {
				product = p;
			}
		});

		return product;
	};
	calculateNewTotal = (qty, price) => {
		let priceF = parseFloat(price);
		if (isNaN(priceF)) {
			return 0;
		} else {
			return priceF * qty;
		}
	};
	buildSharePointObject = () => {
		let price = parseFloat(this.state.price);
		let total = parseFloat(this.state.total);
		let rtnVal = {
			__metadata: {
				type: "SP.Data.RxPOListItem",
			},
			Title: "",
			ProductInfoId: parseInt(this.state.product, 10),
			Quantity: this.state.quantity,
			PriceAtOrder: isNaN(price) ? 0 : price,
			Total: isNaN(total) ? 0 : total,
			RxNumber: this.state.rxNumber,
			PoDate: DateAssistant.GetJsonDate(this.state.poDate),
		};

		return rtnVal;
	};
	buildSharePointObjectOtc = () => {
		let price = parseFloat(this.state.price);
		let total = parseFloat(this.state.total);
		let rtnVal = {
			__metadata: {
				type: "SP.Data.OtcPOListItem",
			},
			Title: "",
			OtcProductId: parseInt(this.state.product, 10),
			Quantity: this.state.quantity,
			PriceAtOrder: isNaN(price) ? 0 : price,
			Total: isNaN(total) ? 0 : total,
			PoDate: DateAssistant.GetJsonDate(this.state.poDate),
		};

		return rtnVal;
	};
	sortStates = (a, b, value) => {
		const aLower = a.Title.toLowerCase();
		const bLower = b.Title.toLowerCase();
		const valueLower = value.toLowerCase();
		const queryPosA = aLower.indexOf(valueLower);
		const queryPosB = bLower.indexOf(valueLower);
		if (queryPosA !== queryPosB) {
			return queryPosA - queryPosB;
		}
		return aLower < bLower ? -1 : 1;
	};
	//#endregion
}
