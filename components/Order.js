import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
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
  const [tokenRecords, setTokenRecords] = useState([]);
  const threshold = 5000;
  const [deleteHovered, setDeleteHovered] = useState(false);

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

        return combinedItems;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
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
    setDeleteHovered(false);
  };
  // calc total investment
  let totalInvestment = 0;
  let totalProfit = 0;
  positionStore.buys.forEach((orders) => {
    totalInvestment += orders.investment.reduce(
      (total, item) => total + item.item,
      0
    );

    orders.investment.forEach((item, index) => {
      const token = orders.symbol_token[index];
      const currentPrice = parseFloat(findLTPByToken(token, tokenRecords));
      let currentProfit = 0;

      if (orders.bs[index].item === "Buy") {
        currentProfit =
          parseFloat(orders.profitdata[index].item) *
          (currentPrice - orders.price[index].item);
      } else if (orders.bs[index].item === "Sell") {
        currentProfit =
          parseFloat(orders.profitdata[index].item) *
          (orders.price[index].item - currentPrice);
      }

      totalProfit += parseFloat(currentProfit);
    });
  });

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
                <TableCell rowSpan={orders.rowspan}>
                  {/* Sum up the prices of all orders for the current script */}
                  {orders.price.reduce(
                    (total, item) => total + parseFloat(item.item),
                    0
                  )}
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
                  )}{" "}
                </TableCell>
                <TableCell rowSpan={orders.rowspan}>
                  {/* Sum up the items in the investment JSON array */}
                  {orders.investment.reduce(
                    (total, item) => total + item.item,
                    0
                  )}
                </TableCell>
                <TableCell rowSpan={orders.rowspan}>
                  {tokenRecords?.length > 0 ? (
                    <>
                      {(() => {
                        // Initialize total profit to 0
                        let totalProfit = 0;

                        // Iterate over each item in the investment array
                        orders.investment.forEach((item, index) => {
                          // Get the token corresponding to the current index
                          const token = orders.symbol_token[index];

                          // Calculate current price for the specific token
                          const currentPrice = parseFloat(
                            findLTPByToken(token, tokenRecords)
                          );

                          let currentProfit = 0; // Initialize currentProfit variable

                          // Check if the order is "Buy"
                          if (orders.bs[index].item === "Buy") {
                            currentProfit =
                              parseFloat(orders.profitdata[index].item) *
                              (currentPrice - orders.price[index].item);
                          } else if (orders.bs[index].item === "Sell") {
                            // Calculate profit for "Sell" orders
                            currentProfit =
                              parseFloat(orders.profitdata[index].item) *
                              (orders.price[index].item - currentPrice);
                          }

                          // Add currentProfit to totalProfit
                          totalProfit += parseFloat(currentProfit);
                        });

                        // Return the total profit rounded to 2 decimal places
                        return (
                          <>
                            {totalProfit.toFixed(2)}{" "}
                            {totalProfit > 0 ? (
                              <Icon name="caret up" color="green" />
                            ) : (
                              <Icon name="caret down" color="red" />
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    0
                  )}
                </TableCell>

                <TableCell>
                  <Button
                    icon
                    onMouseEnter={() =>
                      setDeleteHovered(`${scriptIndex}-${contentIndex}`)
                    }
                    onMouseLeave={() => setDeleteHovered(null)}
                    onClick={() => handleDelete(scriptIndex, contentIndex)}
                    style={{
                      backgroundColor:
                        deleteHovered === `${scriptIndex}-${contentIndex}`
                          ? "red"
                          : "transparent",
                      color:
                        deleteHovered === `${scriptIndex}-${contentIndex}`
                          ? "white"
                          : "red",
                    }}
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
        <TableBody>
          <TableRow>
            <TableCell colSpan={7}>Total</TableCell>
            <TableCell>{totalInvestment}</TableCell>
            <TableCell>{totalProfit.toFixed(2)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default inject("positionStore")(observer(Order));
