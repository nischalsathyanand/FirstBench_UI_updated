export default function combineData(data) {
    const combinedData = {};

    data.forEach(item => {
        const key = item.script;
        if (!combinedData[key]) {
            combinedData[key] = {
                script: item.script,
                sprice: [],
                cepe: [],
                symbol_token: [],
                bs: [],
                expdate: item.expdate,
                price: 0,
                iv: [],
                lastUpdate: item.lastUpdate,
                rowspan: 1
            };
        } else {
            combinedData[key].rowspan++;
            combinedData[key].spriceTotal += parseFloat(item.sprice);
        }
        combinedData[key].sprice.push({"item":parseInt(item.sprice),"lastUpdate":item.lastUpdate});
        combinedData[key].cepe.push({"item":item.cepe,"lastUpdate":item.lastUpdate});
        combinedData[key].symbol_token.push(item.symbol_token);
        combinedData[key].bs.push({"item":item.bs,"lastUpdate":item.lastUpdate});
        combinedData[key].iv.push({"item":item.iv,"lastUpdate":item.lastUpdate});
        combinedData[key].price += parseFloat(item.price);
    });

    return Object.values(combinedData);
}
