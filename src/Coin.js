import React, {useEffect, useState} from 'react';
import {Link } from 'react-router-dom';
import axios from 'axios';
import './Coin.scss';
const Coin = ({rank, name, image, price, pricechange1h, pricechange24h, pricechange7d, marketcap, id, symbol}) => {

    const [coinDetail, setCoinDetail] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        
        const fetchData = async() => {
            var ressss = await axios.get(`https://api.coingecko.com/api/v3/simple/price/` , {
                params: {
                    ids : id,
                    vs_currencies: 'usd',
                    include_24hr_vol: 'true',
                }
            })

            console.log(Object.values(ressss.data)[0].usd_24h_vol);
            // console.log(ress.data)
            //setCoinData(Object.values(ress.data));
            setCoinDetail(Object.values(ressss.data)[0]);
            setIsLoading(false);
        }
        
        fetchData();

    },[id]);

    function numberWithCommas(x) {
        return Number(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function numberWithCommasAndDecimal(x) {
        return Number(x).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div className="coin-list d-inline-flex">
            <div className="coin-list__rank"><p>{rank}</p></div>
            
            <Link to={`/coins/${id}`}>
            <div className="coin-list__coin-title">
                <div className="coin-list__image"><img src={image}></img></div>
                <p className="d-none d-lg-block coin-name">{name}</p>
                <p className="d-lg-none text-uppercase">{symbol}</p>
                <p className="text-uppercase coin-symbol">{symbol}</p>
                </div>
            </Link>
            <div className="coin-list__price"><p>${numberWithCommasAndDecimal(price)}</p></div>
            <div className="coin-list__price-change 1h">
                {pricechange1h > 0 ? (
                    <p className="green">{pricechange1h.toFixed(1)}%</p>
                ) : (
                    <p className="red">{pricechange1h.toFixed(1)}%</p>
                )
                }
            </div>
            <div className="coin-list__price-change 24h">
                {pricechange24h > 0 ? (
                    <p className="green">{pricechange24h.toFixed(1)}%</p>
                ) : (
                    <p className="red">{pricechange24h.toFixed(1)}%</p>
                )
                }
            </div>
            <div className="coin-list__price-change 1h">
                {pricechange7d > 0 ? (
                    <p className="green">{pricechange7d.toFixed(1)}%</p>
                ) : (
                    <p className="red">{pricechange7d.toFixed(1)}%</p>
                )
                }
            </div>
            <div className="coin-list__volume-change-24h"><p>${numberWithCommas(Number(coinDetail.usd_24h_vol).toFixed(0))}</p></div>
            <div className="coin-list__market-cap"><p>${numberWithCommas(marketcap)}</p></div>
        </div>
    )
}

export default Coin;