export default class DateAssistant {
	static GetJsonDate = (passedDate) => {
		let d = new Date(passedDate);
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}T16:00:00Z`;
	};

	static GetSharePointDateFormat(passedDate) {
		let month = passedDate.getMonth() + 1;
		let monthStr = month <= 9 ? "0" + month : month;
		return (
			passedDate.getFullYear() +
			"-" +
			monthStr +
			"-" +
			(passedDate.getDate() <= 9
				? "0" + passedDate.getDate()
				: passedDate.getDate())
		);
	}

	static GetIsoDate = (passedDate) => {
		let month = passedDate.getMonth() + 1;
		let day = passedDate.getDate();
		let hour = passedDate.getHours();
		let minute = passedDate.getMinutes();
		let second = passedDate.getSeconds();

		let monthStr = month <= 9 ? "0" + month : month;
		let dayStr = day <= 9 ? "0" + day : day;
		let hourStr = hour <= 9 ? "0" + hour : hour;
		let minuteStr = minute <= 9 ? "0" + minute : minute;
		let secondStr = second <= 9 ? "0" + second : second;

		return `_${passedDate.getFullYear()}${monthStr}${dayStr}_${hourStr}${minuteStr}${secondStr}`;
	};

	static GetStandardMonthDateYearString(passedDate) {
		if (passedDate) {
			let convertedDate = new Date(passedDate);
			let month = convertedDate.getMonth() + 1;
			let monthStr = month <= 9 ? "0" + month : month;
			let dayStr =
				convertedDate.getDate() <= 9
					? "0" + convertedDate.getDate()
					: convertedDate.getDate();

			return `${convertedDate.getFullYear()}-${monthStr}-${dayStr}`;
		} else {
			return "";
		}
	}

	static ReturnYear = (passedDate) => {
		return passedDate.getFullYear();
	};

	static OffsetDate(passedDate, offset) {
		let today = new Date(passedDate);
		let calculateDueDate = new Date(today.setDate(today.getDate() + offset));
		return calculateDueDate;
	}

	static GetDateRange = (passedDate) => {
		const SUNDAY = 0;
		const MONDAY = 1;
		const TUESDAY = 2;
		const WEDNESDAY = 3;
		const THURSDAY = 4;
		const FRIDAY = 5;
		const SATURDAY = -1;
		const NEXT_DAY = 6;

		let today = new Date(passedDate);
		let offsets = [
			SUNDAY - today.getDay(),
			MONDAY - today.getDay(),
			TUESDAY - today.getDay(),
			WEDNESDAY - today.getDay(),
			THURSDAY - today.getDay(),
			FRIDAY - today.getDay(),
			SATURDAY - today.getDay(),
			NEXT_DAY - today.getDay(),
		];

		return {
			MONDAY: DateAssistant.OffsetDate(passedDate, offsets[1]),
			TUESDAY: DateAssistant.OffsetDate(passedDate, offsets[2]),
			WEDNESDAY: DateAssistant.OffsetDate(passedDate, offsets[3]),
			THURSDAY: DateAssistant.OffsetDate(passedDate, offsets[4]),
			FRIDAY: DateAssistant.OffsetDate(passedDate, offsets[5]),
			SATURDAY: DateAssistant.OffsetDate(passedDate, offsets[6]),
			SUNDAY: DateAssistant.OffsetDate(passedDate, offsets[0]),
			"NEXT-DAY": DateAssistant.OffsetDate(passedDate, offsets[7]),
		};
	};

	static IsThisDateWithinTheWeeklyRange = (passedDate, currentDate) => {
		let week = DateAssistant.GetDateRange(currentDate);

		return (
			DateAssistant.DoTheDatesMatch(passedDate, week["SATURDAY"]) ||
			DateAssistant.DoTheDatesMatch(passedDate, week["SUNDAY"]) ||
			DateAssistant.DoTheDatesMatch(passedDate, week["MONDAY"]) ||
			DateAssistant.DoTheDatesMatch(passedDate, week["TUESDAY"]) ||
			DateAssistant.DoTheDatesMatch(passedDate, week["WEDNESDAY"]) ||
			DateAssistant.DoTheDatesMatch(passedDate, week["THURSDAY"]) ||
			DateAssistant.DoTheDatesMatch(passedDate, week["FRIDAY"])
		);
	};

	static DoTheDatesMatch = (passedDate, currentDate) => {
		let passedDateString =
			DateAssistant.GetStandardMonthDateYearString(passedDate);
		let currentDateString =
			DateAssistant.GetStandardMonthDateYearString(currentDate);

		return passedDateString === currentDateString;
	};
}
