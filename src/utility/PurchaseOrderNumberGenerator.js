import DateAssistant from "./DateAssistant";

export default class PurchaseOrderNumberGenerator {
  static GetNewOrderNumber = () => {
    const variables = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
    ];
    let varMax = variables.length;
    let rtnVal = "";

    for (let i = 0; i < 6; i++) {
      let newRand = PurchaseOrderNumberGenerator.GetRandomInt(varMax);
      rtnVal += variables[newRand];
    }

    return `${rtnVal}${DateAssistant.GetIsoDate(new Date())}`;
  };

  static GetRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };
}
