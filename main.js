// immutable-js(Immutable), Ramda(R), RxJS(rxjs)

// SIDE EFFECTS !!
const randomBool = () => Math.random() > 0.5
const random0to9 = () => Math.round(Math.random() * 10) % 10

const addStockName = stock => ({ ...stock, name: stock.id })
const toFixed = val => val.toFixed(2)
const formatCurrency = val => `$${val}`
const formatPrice = R.compose(formatCurrency, toFixed)
const formatSign = val => val > 0 ? `+${val}` : `${val}`
const formatChange = R.compose(formatSign, toFixed)
const trans = {
    name: R.identity,
    price: formatPrice,
    change: formatChange
}
const formatStock = R.evolve(trans)
const processNewStock = R.compose(formatStock, addStockName)

// source server
const $update = rxjs.Observable.create(observer => {
    // SIDE EFFECTS !!
    var stocks = [
        { id: 'AAPL', price: 121.95, change: 0.01 },
        { id: 'MSFT', price: 65.78, change: 1.51 },
        { id: 'GOOG', price: 821.31, change: -8.84 },
    ];
    stocks.forEach(stock => observer.next(stock))

    setInterval(() => {
        stocks.forEach(stock => {
            stock.change = (randomBool() ? -1 : -1) * (random0to9() / 10)
            stock.price += stock.change
            observer.next(stock)
        })
    }, 1000)
})

$update
    .pipe(rxjs.operators.map(processNewStock))
    .pipe(rxjs.operators.scan((stocks, s) => stocks.set(s.name, s), Immutable.Map()))
    .subscribe(stocks => {
        // SIDE EFFECTS !!
        document.querySelector("#stocks").textContent = JSON.stringify(stocks, null, ' ')
    })
