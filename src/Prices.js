import React, { Component } from 'react';
import axios from 'axios';
import params from 'react-router-dom';
class Prices extends Component {
    state = {
        cryptos: []
    }

    componentDidMount() {
       this.fetchData();
    }

    async fetchData() {
        let qs = `?start=1`
        try {
            let res = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest' + qs, {
                headers: { 'X-CMC_PRO_API_KEY': '8b12918f-f3a4-4d0a-87b2-e67db0286676' },
                params: {
                    limit: "50",
                    convert: "USD",
                },
            });
            console.log(res.data.data)
            // this.setState({
            //     cryptos: res.data.slice(0, 50)
            // });
        } catch (error) {
            console.log(error);
        }

    }
    render() {
        return (
            <div></div>
        )
    }
}
export default Prices