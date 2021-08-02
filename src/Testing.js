import React , { useEffect , useState} from 'react';
import axios from 'axios';
import params from 'react-router-dom';

const Testing = () => {

    const [coins, setCoins] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            let qs = `?start=1`
            var res = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest' + qs, {
                headers: { 'X-CMC_PRO_API_KEY': '8b12918f-f3a4-4d0a-87b2-e67db0286676' },
                params: {
                    limit: "500",
                    // convert: "USD",
                },
            });
            setCoins(res.data.data);
            console.log(res.data.data[0].name)
            // for( var i = 0; i < 50;i++) {
            //     console.log("Fuckyou" + i)
            // }
        }

        fetchData();

    }, []);

    return (
        <div>
            {coins.map((coin) => {

                    var roundMarketCap = Math.floor(coin.quote.USD.market_cap.toFixed(2)/1000000);
                    const roundMarketCapp = (x) => { 
                        if(x/1000000000 > 1) {
                            return (
                                Math.floor(x.toFixed(0)/1000000000) + " Billion"
                            )
                        } else {
                            return (
                                Math.floor(x.toFixed(0)/1000000) + " Million"
                            )
                        }
                    }
                    console.log(roundMarketCap)
        
                    return (
                      <div className="book">
                        <h2>{coin.name}</h2>
                        <p>{roundMarketCapp(coin.quote.USD.market_cap)}</p>
                        <p>{coin.quote.USD.price.toFixed(2)}</p>
                      </div>
                    );
                  })
            }
        </div>
    )
}

export default Testing;