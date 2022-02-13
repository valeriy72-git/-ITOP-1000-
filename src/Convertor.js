import React, { Component } from "react";
import axios from "axios";
import './Convertor.css';


class App extends React.Component {
    state = {
        rates: {},       
        isLoading: true,
        amountFrom: "",
        amountTo: "",
        currencyFrom: "",
        currencyTo: "",
    };

    currentDateString() {
        return new Date().toLocaleDateString();
    }

    async getRates() {
        const response  = await axios.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
        const usdInfo = response.data.find(info => info.ccy === 'USD')
        const eurInfo = response.data.find(info => info.ccy === 'EUR')
        const rates = {
            'USD-UAH': parseFloat(usdInfo.sale),
            'UAH-USD': 1 / parseFloat(usdInfo.sale),
            'EUR-UAH': parseFloat(eurInfo.sale),
            'UAH-EUR': 1 / parseFloat(eurInfo.sale),
            'USD-EUR': parseFloat(usdInfo.sale) * (1 / parseFloat(eurInfo.sale)),
            'EUR-USD': parseFloat(eurInfo.sale) * (1 / parseFloat(usdInfo.sale)),
        }
        this.setState({ ...this.state, rates, isLoading: false });
    }

    componentDidMount() {
        this.getRates();
    }

    convertAmountFrom(state) {
        const { amountFrom, currencyFrom, currencyTo, rates } = state
        if (currencyFrom && currencyTo && amountFrom) {
            const key = [currencyFrom, currencyTo].join("-")
            const baseAmount = parseFloat(amountFrom || "0")
            const rate = rates[key] || 1
            const result = baseAmount * rate
            this.setState({ ...state, amountTo: result })
        }
    }

    convertAmountTo(state) {
        const { amountTo, currencyFrom, currencyTo, rates } = state
        if (currencyFrom && currencyTo && amountTo) {
            const key = [currencyTo, currencyFrom].join("-")
            const baseAmount = parseFloat(amountTo || "0")
            const rate = rates[key] || 1
            const result = baseAmount * rate
            this.setState({ ...state, amountFrom: result })
        }
    }

    amountFromChange = (event) => {
        const state = { ...this.state, amountFrom: event.target.value }
        this.setState(state)
        this.convertAmountFrom(state)
    }

    currencyFromChange = (event) => {
        const state = { ...this.state, currencyFrom: event.target.value }
        this.setState(state)
        this.convertAmountFrom(state)
    }

    amountToChange = (event) => {
        const state = { ...this.state, amountTo: event.target.value }
        this.setState(state)
        this.convertAmountTo(state)
    }

    currencyToChange = (event) => {
        const state = { ...this.state, currencyTo: event.target.value }
        this.setState(state)
        this.convertAmountFrom(state)
    }

    render (){
        const { isLoading, amountFrom, amountTo, currencyFrom, currencyTo, rates } = this.state;
        return (
            <div className="App-converter">
                <header className="header">
                    <h3>Станом на {this.currentDateString()}</h3>
                    <div className="currency">
                        <p>EUR: {rates["EUR-UAH"]} </p>
                        <p>USD: {rates["USD-UAH"]} </p>
                    </div>
                </header>
            <hr/>
                <main className="convert">
                    <div> 
                        <input type="number" className="eur-input" value={amountFrom} onChange={this.amountFromChange}/>
                        <select className="selectNative js-selectNative" aria-labelledby="jobLabel" value={currencyFrom} onChange={this.currencyFromChange}>
                            <option value="" disabled="" > Select currency...</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="UAH">UAH</option>
                        </select>              
                    </div>

                    <div> 
                        <input type="number" className="usd-input" value={amountTo} onChange={this.amountToChange}/>
                        <select className="selectNative js-selectNative" aria-labelledby="jobLabel" value={currencyTo} onChange={this.currencyToChange}>
                            <option value="" disabled="" > Select currency...</option>
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="UAH">UAH</option>
                        </select>
                    </div>
                </main>
            </div>
        )
    }
}

export default App;