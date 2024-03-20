export default function combineBuys(buys) {
  const combinedBuys = {};
  /*
      script: "",
      sprice: "",
      cepe: "",
      bs: "",
      expdate: "",
      price: "",
      iv: "",

  */

  buys.forEach((buy) => {
    const script = buy.script;

    if (combinedBuys[script]) {
      combinedBuys[script].sprice = buy.sprice;
      combinedBuys[script].cepe = buy.cepe;
      combinedBuys[script].bs = buy.bs;
      combinedBuys[script].expdate = buy.expdate;
      combinedBuys[script].price = parseInt(combinedBuys[script].price) + parseInt(buy.price);
      combinedBuys[script].iv = buy.iv;
      combinedBuys[script].rowspan++;
    } else {
      combinedBuys[script] = {
        script: script,
        sprice: buy.sprice,
        cepe: buy.cepe,
        bs: buy.bs,
        expdate: buy.expdate,
        price: buy.price,
        iv: buy.iv,
        rowspan: 1 
      };
    }
  });

  const combinedBuysArray = Object.values(combinedBuys);
  return combinedBuysArray;
}

