export default function combineData(data) {
  const combinedData = {};

  data.forEach((item) => {
    const key = item.script;
    if (!combinedData[key]) {
      combinedData[key] = {
        script: item.script,
        sprice: [],
        cepe: [],
        symbol_token: [],
        bs: [],
        expdate: item.expdate,
        price: [],
        lots: [],
        lotsize: 0,
        investment: [],
        profitdata: [],
        lastUpdate: item.lastUpdate,
        rowspan: 1,
      };
    } else {
      combinedData[key].rowspan++;
      combinedData[key].spriceTotal += parseFloat(item.sprice);
    }
    combinedData[key].sprice.push({
      item: parseInt(item.sprice),
      lastUpdate: item.lastUpdate,
    });
    combinedData[key].cepe.push({
      item: item.cepe,
      lastUpdate: item.lastUpdate,
    });
    combinedData[key].symbol_token.push(item.symbol_token);
    combinedData[key].bs.push({ item: item.bs, lastUpdate: item.lastUpdate });
    combinedData[key].lots.push({
      item: item.lots,
      lastUpdate: item.lastUpdate,
    });
    // convert investement into a list and store them seperatly
    combinedData[key].investment.push({
      item: item.investment,
      lastUpdate: item.lastUpdate,
    });

    combinedData[key].profitdata.push({
      item: item.profitdata,
      lastUpdate: item.lastUpdate,
    });

    combinedData[key].price.push({
      item: item.price,
      lastUpdate: item.lastUpdate,
    });

    combinedData[key].lotsize += parseFloat(item.lotsize);
    //combinedData[key].price += parseFloat(item.price);

    //combinedData[key].profitdata += parseFloat(item.profitdata);
    //combinedData[key].investment += parseFloat(item.investment);
  });

  return Object.values(combinedData);
}
