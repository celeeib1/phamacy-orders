import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Container } from "reactstrap";
import ReactExport from "react-export-excel";
import Chart from "react-google-charts";
import SharePoint from "../api_call/SharePoint";
import UrlEndPointGenerator from "../api_call/UrlEndPointGenerator";
import DateAssistant from "../utility/DateAssistant";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class Dshbord extends Component {
	constructor(props) {
		super(props);
		this.state = {
			CurrentDate: new Date(),
			Weekly: DateAssistant.GetDateRange(new Date()),
			RxPoData: [],
			OtcPoData: [],
		};
	}

	componentDidMount() {
		SharePoint.GetPagedData(UrlEndPointGenerator.GetRxPOListItems()).then(
			(response) => {
				this.setState({ RxPoData: response });
			}
		);
		SharePoint.GetPagedData(UrlEndPointGenerator.GetOtcOrdersListItems()).then(
			(response) => {
				this.setState({ OtcPoData: response });
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
								alt="Three Js Logo"
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
					<h1 className="my-4">Dashboard</h1>
					<div></div>
					<div className="excel-button">
						<ExcelFile
							element={
								<Button
									color="primary"
									disabled={this.state.RxPoData.length === 0}
								>
									Download Excel File
								</Button>
							}
							filename={"Order Data"}
						>
							<ExcelSheet data={this.state.RxPoData} name="RX Order Data">
								<ExcelColumn label="Order Number" value="Title" />
								<ExcelColumn
									label="Product Name"
									value={(col) => col.ProductInfo.DrugName}
								/>
								<ExcelColumn label="Price At Order" value="PriceAtOrder" />
								<ExcelColumn label="Quantity" value="Quantity" />
								<ExcelColumn
									label="Order Date"
									value={(col) =>
										DateAssistant.GetStandardMonthDateYearString(col.Created)
									}
								/>
								<ExcelColumn label="Total" value="Total" />
							</ExcelSheet>
							<ExcelSheet data={this.state.OtcPoData} name="OTC Order Data">
								<ExcelColumn label="Order Number" value="Title" />
								<ExcelColumn
									label="Product Name"
									value={(col) => col.OtcProduct.DrugName}
								/>
								<ExcelColumn label="Price At Order" value="PriceAtOrder" />
								<ExcelColumn label="Quantity" value="Quantity" />
								<ExcelColumn
									label="Order Date"
									value={(col) =>
										DateAssistant.GetStandardMonthDateYearString(col.Created)
									}
								/>
								<ExcelColumn label="Total" value="Total" />
							</ExcelSheet>
						</ExcelFile>
					</div>
				</div>
				<Container className="pb-3">
					<Chart
						width={"600px"}
						height={"400px"}
						chartType="PieChart"
						loader={<div>Loading Chart</div>}
						data={this.formatDataForPieChartYTD(this.state.RxPoData)}
						options={{
							title: `RX Orders YTD ${DateAssistant.ReturnYear(
								this.state.CurrentDate
							)}`,
						}}
						rootProps={{ "data-testid": "1" }}
					/>
				</Container>
				<Container className="pb-3">
					<Chart
						width={"600px"}
						height={"400px"}
						chartType="PieChart"
						loader={<div>Loading Chart</div>}
						data={this.formatDataForPieChartCurrentWeek(this.state.RxPoData)}
						options={{
							title: `RX Orders For Week Of Saturday ${DateAssistant.GetStandardMonthDateYearString(
								this.state.Weekly.SATURDAY
							)} To Friday ${DateAssistant.GetStandardMonthDateYearString(
								this.state.Weekly.FRIDAY
							)}`,
						}}
						rootProps={{ "data-testid": "1" }}
					/>
				</Container>
				<Container className="pb-3">
					<Chart
						width={"600px"}
						height={"400px"}
						chartType="PieChart"
						loader={<div>Loading Chart</div>}
						data={this.formatDataForPieChartToday(this.state.RxPoData)}
						options={{
							title: `RX Orders For Today`,
						}}
						rootProps={{ "data-testid": "1" }}
					/>
				</Container>
			</div>
		);
	}

	//#region Private Methods
	formatDataForPieChartYTD = (poData) => {
		let rtnVal = [["Drug", "Total"]];
		let dict = {};
		let currentYear = DateAssistant.ReturnYear(this.state.CurrentDate);

		poData.forEach((po) => {
			// If undefined, create a new instance
			let createdYear = new Date(po["Created"]).getFullYear();
			let drugName = po.ProductInfo.DrugName;

			if (currentYear === createdYear) {
				if (dict[drugName] === undefined) {
					dict[drugName] = 0;
				}
				dict[drugName] += po.Total;
			}
		});

		// Build return object
		Object.keys(dict).forEach((drugName) => {
			rtnVal.push([drugName, dict[drugName]]);
		});

		return rtnVal;
	};
	formatDataForPieChartCurrentWeek = (poData) => {
		let rtnVal = [["Drug", "Total"]];
		let dict = {};

		poData.forEach((po) => {
			// If undefined, create a new instance
			let created = new Date(po["Created"]);
			let drugName = po.ProductInfo.DrugName;

			if (
				DateAssistant.IsThisDateWithinTheWeeklyRange(
					created,
					this.state.CurrentDate
				)
			) {
				if (dict[drugName] === undefined) {
					dict[drugName] = 0;
				}
				dict[drugName] += po.Total;
			}
		});

		// Build return object
		Object.keys(dict).forEach((drugName) => {
			rtnVal.push([drugName, dict[drugName]]);
		});

		return rtnVal;
	};
	formatDataForPieChartToday = (poData) => {
		let rtnVal = [["Drug", "Total"]];
		let dict = {};

		poData.forEach((po) => {
			// If undefined, create a new instance
			let created = new Date(po["Created"]);
			let drugName = po.ProductInfo.DrugName;

			if (DateAssistant.DoTheDatesMatch(created, this.state.CurrentDate)) {
				if (dict[drugName] === undefined) {
					dict[drugName] = 0;
				}
				dict[drugName] += po.Total;
			}
		});

		// Build return object
		Object.keys(dict).forEach((drugName) => {
			rtnVal.push([drugName, dict[drugName]]);
		});

		return rtnVal;
	};
	//#endregion
}
