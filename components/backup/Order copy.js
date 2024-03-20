import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import positionStore from "/store/positionStore";
import combineBuys from "../../utility/combinedBuys";
import combineData from "../../utility/combineData";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Icon
} from "semantic-ui-react";

const Order = ({ positionStore }) => {
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [oldRows, setOldRows] = useState([]);
  const currentPrice = 100;

  useEffect(() => {
    // Check if an item was updated to positionStore within the last 2 seconds
    const recentlyUpdatedRows = [];
    const threshold = 2000; // 2 seconds (adjust as needed)

    for (const order of positionStore.buys) {
      const timeSinceLastUpdate = Date.now() - order.lastUpdate;

      if (timeSinceLastUpdate < threshold) {
        recentlyUpdatedRows.push(order);
      }
    }

    const differenceRows = positionStore.buys.filter((order) => {
      // Check if the order is NOT in the recentlyUpdatedRows array
      return !recentlyUpdatedRows.includes(order);
    });

    setHighlightedRows(recentlyUpdatedRows);
    setOldRows(differenceRows);
  }, [positionStore]);

  return (
    <div>
      {console.log(combineData(positionStore.buys))}
      <Table basic="very" unstackable celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Slno</TableHeaderCell>
            <TableHeaderCell>Script</TableHeaderCell>
            <TableHeaderCell>Stright Price</TableHeaderCell>
            <TableHeaderCell>Ce/Pe</TableHeaderCell>
            <TableHeaderCell>Buy/Sell</TableHeaderCell>
            <TableHeaderCell>Exp Date</TableHeaderCell>
            <TableHeaderCell>Iv</TableHeaderCell>
            <TableHeaderCell>Bought</TableHeaderCell>
            <TableHeaderCell>Current Price</TableHeaderCell>
            <TableHeaderCell>Profite</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {oldRows.map((orders, index) => (
            <TableRow key={index} verticalAlign="top">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{orders.script}</TableCell>
              <TableCell>{orders.sprice}</TableCell>
              <TableCell>{orders.cepe}</TableCell>
              <TableCell>{orders.bs}</TableCell>
              <TableCell>{orders.expdate}</TableCell>
              <TableCell>{orders.iv}</TableCell>
              <TableCell>{orders.price}</TableCell>
              <TableCell>{currentPrice} {currentPrice>orders.price?<Icon name='caret up' color="green"/> : <Icon name='caret down' color="red" /> } </TableCell>
              <TableCell>PROFIT</TableCell>
            </TableRow>
          ))}
          {highlightedRows.map((orders, index) => (
            <TableRow key={index} verticalAlign="top" active>
              <TableCell>{index + 1 + oldRows.length}</TableCell>
              <TableCell>{orders.script}</TableCell>
              <TableCell>{orders.sprice}</TableCell>
              <TableCell>{orders.cepe}</TableCell>
              <TableCell>{orders.bs}</TableCell>
              <TableCell>{orders.expdate}</TableCell>
              <TableCell>{orders.iv}</TableCell>
              <TableCell>{orders.price}</TableCell>
              <TableCell>{currentPrice} {currentPrice>orders.price?<Icon name='caret up' color="green"/> : <Icon name='caret down' color="red" /> }</TableCell>
              <TableCell>PROFIT</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default inject("positionStore")(observer(Order));