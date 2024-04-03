import React from "react";
import { inject, observer } from "mobx-react";
import { useState, useEffect } from "react";
import {
  FormField,
  Button,
  Dropdown,
  Form,
  Input,
  Message,
  Segment,
  Loader,
} from "semantic-ui-react";
import buyStore from "/store/BuyStore";
import positionStore from "/store/positionStore";
import combineData from "../utility/combineData";
const Position = ({ handleStepClick }) => {
  //const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [lotsError, setLotsError] = useState(false);
  const [scriptData, setScriptData] = useState([]);
  const [strike, setStrike] = useState([]);
  const [expairy, setExpairy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptJsonData, setScriptJsonData] = useState([]);
  const [selectedCEPESymbol, setSelectedCEPESymbol] = useState("");
  const [selectedLotSize, setSelectedLotsize] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/getscripts");
        //console.log(response)
        const newData = await response.json();
        if (newData) {
          //console.log(newData);
          const processedData = [];
          newData.map((item) => {
            processedData.push({ key: item, text: item, value: item });
          });
          setScriptData(processedData);
        }
      } catch (error) {
        console.log("Error fetching data " + error);
      }
    };
    fetchData();
  }, []);
  const cepe = [
    { key: "CE", text: "CE", value: "CE" },
    { key: "PE", text: "PE", value: "PE" },
  ];
  const bs = [
    { key: "Buy", text: "Buy", value: "Buy" },
    { key: "Sell", text: "Sell", value: "Sell" },
  ];
  const lots = [];
  for (let i = 1; i <= 100; i++) {
    lots.push({ key: i.toString(), text: i.toString(), value: i.toString() });
  }

  const [formData, setformData] = useState({
    script: "",
    sprice: "",
    cepe: "",
    bs: "",
    expdate: "",
    price: "",
    lots: "",
  });
  const handleAddScript = () => {
    if (!validateInputs()) return;
    buyStore.orders.push({
      script: formData.script,
      sprice: formData.sprice,
      cepe: formData.cepe,
      bs: formData.bs,
      expdate: formData.expdate,
      price: formData.price,
      lots: formData.lots,
      lotsize: selectedLotSize,
      symbol_token: returnSymbolToken(selectedCEPESymbol),
      investment: formData.price * formData.lots * selectedLotSize,
      profitdata: formData.lots * selectedLotSize,
    });
    toggleOrderCount(buyStore.orders.length);
  };
  const [orderCount, setOrderCount] = useState(0);
  const toggleOrderCount = (count) => {
    setOrderCount(count);

    setformData({
      script: "",
      sprice: "",
      cepe: "",
      bs: "",
      expdate: "",
      price: "",
      lots: "",
    });
  };
  const validateInputs = () => {
    let isValid = true;

    if (!formData.price || isNaN(formData.price)) {
      setPriceError(true);
      isValid = false;
    } else {
      setPriceError(false);
    }

    if (!formData.lots || isNaN(formData.lots)) {
      setLotsError(true);
      isValid = false;
    } else {
      setLotsError(false);
    }

    return isValid;
  };

  const handleScriptChange = async (e, { value }) => {
    setIsLoading(true);
    setformData({ ...formData, script: value });
    const scriptDataResponse = await fetch(
      "http://localhost:3000/api/v1/getscriptbyname?name=" + value
    );
    if (!scriptDataResponse.ok) {
      throw new Error("Unable to get data .. error");
    }
    const data = await scriptDataResponse.json();
    setScriptJsonData(data);

    const strikePriceArray = [];

    data.map((item) => {
      const formattedStrike = parseFloat(item.strike / 100).toFixed(2);
      strikePriceArray.push(formattedStrike);
    });
    const tempStrikePrice = removeDuplicates(strikePriceArray);
    const strikePriceDropdown = [];
    tempStrikePrice.map((item) => {
      strikePriceDropdown.push({
        key: item,
        text: item,
        value: item,
      });
    });
    // Sort the strikePriceDropdown array based on the 'key' property
    strikePriceDropdown.sort((a, b) => a.key - b.key);

    // Function to remove duplicates from an array
    function removeDuplicates(array) {
      return array.filter((item, index) => array.indexOf(item) === index);
    }

    setStrike(strikePriceDropdown);

    // SetExpairy(expiryDateArrayDropdown);
    setIsLoading(false);
  };
  const handleCePeChange = async (e, { value }) => {
    setformData({ ...formData, cepe: value });
    const cepe = value;
    const selectedprice = (formData.sprice * 100).toFixed(6);

    //console.log(floatToString(formData.sprice * 100).toFixed(6));
    const expDateArray = [];

    const filteredData = [];
    scriptJsonData.forEach((item) => {
      if (
        item.symbol &&
        typeof item.symbol === "string" &&
        item.strike === selectedprice &&
        item.symbol.substr(-2) === cepe
      ) {
        // Check if item.symbol exists
        filteredData.push(item);
      }
    });

    filteredData.forEach((item) => {
      expDateArray.push(item.expiry);
    });

    // Function to remove duplicates from array
    const removeDuplicates = (array) => {
      return array.filter((item, index) => array.indexOf(item) === index);
    };

    const tempExpdateArray = removeDuplicates(expDateArray);

    const expiryDateArrayDropdown = tempExpdateArray.map((item) => ({
      key: item,
      text: item,
      value: item,
    }));

    expiryDateArrayDropdown.sort((a, b) => new Date(a.key) - new Date(b.key));
    setExpairy(expiryDateArrayDropdown);
  };

  const handleExpDateChange = async (e, { value }) => {
    setformData({ ...formData, expdate: value });
    const expdate = value;

    const selectedprice = (formData.sprice * 100).toFixed(6);

    const extractedSymbolToken = [];

    scriptJsonData.forEach((item) => {
      if (
        item.symbol &&
        typeof item.symbol === "string" &&
        item.strike === selectedprice &&
        item.symbol.substr(-2) === formData.cepe &&
        item.expiry === expdate
      ) {
        // Check if CEPE Symbol exists exists
        extractedSymbolToken.push(item);
      }
    });

    setSelectedCEPESymbol(extractedSymbolToken[0].symbol);
    setSelectedLotsize(extractedSymbolToken[0].lotsize);
  };

  const returnSymbolToken = (symbol) => {
    for (const obj of scriptJsonData) {
      if (obj.symbol === symbol) {
        return obj.token;
      }
    }
    return null; // Symbol not found
  };

  const handleSaveClick = () => {
    const timestamp = Date.now();
    const combinedOrders = buyStore.orders;
    const ordersWithTimestamp = combinedOrders.map((order) => ({
      ...order,
      lastUpdate: timestamp,
    }));
    //positionStore.buys.push(...ordersWithTimestamp);
    positionStore.buys.push(...combineData(ordersWithTimestamp));
    buyStore.clearOrders();

    handleStepClick(0);
  };
  return (
    <Form fluid size="mini">
      <FormField>
        <label>Script</label>
        <Dropdown
          placeholder="Script"
          fluid
          search
          selection
          options={scriptData}
          value={formData.script}
          onChange={handleScriptChange}
          onSearchChange={(e, { searchQuery }) => {
            const filteredOptions = scriptData.filter((option) =>
              option.text.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setScriptData(filteredOptions);
          }}
          scrolling // Enable scrolling
        />
      </FormField>
      <FormField>
        <label>Strike Price</label>
        {isLoading ? ( // Show loader if isLoading is true
          <Segment>
            <Loader active inline="centered" size="small"></Loader>
          </Segment>
        ) : (
          <Dropdown
            placeholder="Strike Price"
            fluid
            search
            selection
            options={strike}
            value={formData.sprice}
            onChange={(e, { value }) =>
              setformData({ ...formData, sprice: value })
            }
            scrolling // Enable scrolling
          />
        )}
      </FormField>
      <FormField>
        <label>Ce/Pe</label>
        <Dropdown
          placeholder="ce/pe"
          fluid
          selection
          options={cepe}
          value={formData.cepe}
          onChange={handleCePeChange}
        />
      </FormField>
      <FormField>
        <label>B/S</label>
        <Dropdown
          placeholder="Buy/Sell"
          fluid
          selection
          options={bs}
          value={formData.bs}
          onChange={(e, { value }) => setformData({ ...formData, bs: value })}
        />
      </FormField>
      <FormField>
        <label>Exp date</label>
        <Dropdown
          placeholder="expdate"
          fluid
          selection
          options={expairy}
          value={formData.expdate}
          onChange={handleExpDateChange}
        />
      </FormField>
      <FormField error={priceError}>
        <label>Price</label>
        <Input
          value={formData.price}
          onChange={(e, { value }) =>
            setformData({ ...formData, price: value })
          }
        />
        {priceError && <Message error content="Price must be a number" />}
      </FormField>
      <FormField error={lotsError}>
        <label>Lots</label>
        <Dropdown
          placeholder="Lots"
          fluid
          search
          selection
          options={lots}
          value={formData.lots}
          onChange={(e, { value }) => setformData({ ...formData, lots: value })}
          scrolling // Enable scrolling
        />

        {lotsError && <Message error content="Iv must be a number" />}
      </FormField>

      <Button color="green" onClick={handleAddScript}>
        ADD MORE SCRIPT
      </Button>
      <Button
        color="red"
        onClick={handleSaveClick}
        disabled={buyStore.orders.length <= 0}
      >
        SAVE {buyStore.orders.length <= 0 ? "" : `(+${buyStore.orders.length})`}
      </Button>
    </Form>
  );
};
export default inject("buyStore", "positionStore")(observer(Position));
