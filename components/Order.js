import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import positionStore from "/store/positionStore";
import combineBuys from "../utility/combinedBuys";
import combineData from "../utility/combineData";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Icon,
  Button,
} from "semantic-ui-react";
import { get } from "mobx";

const Order = ({ positionStore }) => {
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [oldRows, setOldRows] = useState([]);
  const [tokenRecords, setTokenRecords] = useState([]);
  const currentPrice = 3000;
  const threshold = 5000;

  function findLTPByToken(token, array) {
    const foundItem = array.find((item) => item.symbol === token);
    return foundItem ? foundItem.ltp : null;
  }

  function getTokenList() {
    let token_list = [];
    positionStore.buys.map((orders, index) =>
      orders.cepe.map((content, contentIndex) => {
        orders.symbol_token.map((item) => {
          token_list.push(item);
        });
      })
    );

    return [...new Set(token_list)];
  }

  async function amendTokenRecordLTP(token_list) {
    let token_record = [];

    if (token_list.length > 0) {
      try {
        const requestOptions = {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "LTP",
            exchangeTokens: {
              NFO: token_list,
            },
          }),
        };

        const response = await fetch(
          "http://localhost:3000/smartapi/getMarketData",
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log(data);

        const fetchedItems = data.postion.data.fetched.map((item) => {
          return {
            symbol: item.symbolToken,
            ltp: item.ltp,
          };
        });

        const unfetchedItems = token_list
          .filter(
            (token) =>
              !data.postion.data.fetched.find(
                (item) => item.symbolToken === token
              )
          )
          .map((token) => {
            return {
              symbol: token,
              ltp: null,
            };
          });

        // Combine fetched and unfetched items
        const combinedItems = fetchedItems.concat(unfetchedItems);

        console.log("--------------------");
        console.log(combinedItems);

        return combinedItems;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log("---------------------");
      const token_list = getTokenList();

      const token_record = await amendTokenRecordLTP(token_list);
      setTokenRecords(token_record);
    };

    const interval = setInterval(fetchData, 2000); // Fetch data every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const calculatePositive = (lastUpdate) => Date.now() - lastUpdate < threshold;

  //adding delete
  const handleDelete = (scriptIndex, recordIndex) => {
    const updatedBuys = [...positionStore.buys];
    updatedBuys[scriptIndex].symbol_token.splice(recordIndex, 1);
    if (updatedBuys[scriptIndex].symbol_token.length === 0) {
      updatedBuys.splice(scriptIndex, 1);
    }
    positionStore.buys = updatedBuys;
  };
  //combineData(positionStore.buys).map((orders, index) =>
  const orderRows = positionStore.buys.map(
    (
      orders,
      scriptIndex // Changed scriptindex to scriptIndex
    ) =>
      orders.cepe.map((content, contentIndex) => {
        const isPositive = calculatePositive(
          orders.sprice[contentIndex].lastUpdate
        );
        return (
          <TableRow key={`${scriptIndex}-${contentIndex}`}>
            {contentIndex === 0 && (
              <>
                <TableCell rowSpan={orders.rowspan}>{orders.script}</TableCell>
                <TableCell positive={isPositive}>
                  {orders.sprice[contentIndex].item}
                </TableCell>
                <TableCell positive={isPositive}>
                  {orders.cepe[contentIndex].item}
                </TableCell>
                <TableCell positive={isPositive}>
                  {orders.bs[contentIndex].item}
                </TableCell>
                <TableCell rowSpan={orders.rowspan}>{orders.expdate}</TableCell>
                <TableCell rowSpan={orders.rowspan}>{orders.price}</TableCell>
                <TableCell rowSpan={orders.rowspan}>
                  {tokenRecords?.length > 0 ? (
                    <>
                      {(() => {
                        const sum = orders.symbol_token.reduce(
                          (sum, token) =>
                            sum +
                            parseFloat(findLTPByToken(token, tokenRecords)),
                          0
                        );
                        return (
                          <>
                            {sum.toFixed(2)}{" "}
                            {sum > orders.price ? (
                              <Icon name="caret up" color="green" />
                            ) : (
                              <Icon name="caret down" color="red" />
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    "--"
                  )}
                </TableCell>
                <TableCell rowSpan={orders.rowspan}>
                  {orders.investment}
                </TableCell>
                <TableCell rowSpan={orders.rowspan}>
                  {tokenRecords?.length > 0 ? (
                    <>
                      {(() => {
                        const sum = orders.symbol_token.reduce(
                          (sum, token) =>
                            sum +
                            parseFloat(findLTPByToken(token, tokenRecords)),
                          0
                        );
                        const profit = sum - parseFloat(orders.price);
                        return (
                          <>
                            {profit.toFixed(2)}{" "}
                            {profit > 0 ? (
                              <Icon name="caret up" color="green" />
                            ) : (
                              <Icon name="caret down" color="red" />
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    "--"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    icon
                    color="red"
                    onClick={() => handleDelete(scriptIndex, contentIndex)}
                  >
                    <Icon name="trash" />
                  </Button>
                </TableCell>
              </>
            )}
            {contentIndex !== 0 && (
              <>
                <TableCell positive={isPositive}>
                  {orders.sprice[contentIndex].item}
                </TableCell>
                <TableCell positive={isPositive}>
                  {orders.cepe[contentIndex].item}
                </TableCell>
                <TableCell positive={isPositive}>
                  {orders.bs[contentIndex].item}
                </TableCell>
              </>
            )}
          </TableRow>
        );
      })
  );

  return (
    <div>
      <Table celled structured compact>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Script</TableHeaderCell>
            <TableHeaderCell>Strike Price</TableHeaderCell>
            <TableHeaderCell>CE/PE</TableHeaderCell>
            <TableHeaderCell>Buy/Sell</TableHeaderCell>
            <TableHeaderCell>Expiry Date</TableHeaderCell>
            <TableHeaderCell>Bought</TableHeaderCell>
            <TableHeaderCell>Current Price</TableHeaderCell>
            <TableHeaderCell>Invested Amount</TableHeaderCell>
            <TableHeaderCell>Profit</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>{orderRows}</TableBody>
      </Table>
    </div>
  );
};

export default inject("positionStore")(observer(Order));
