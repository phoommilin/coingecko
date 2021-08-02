import React, {useState, useEffect} from 'react';
import './CoinSummaryPage.scss';
import axios from 'axios';
import params from 'react-router-dom';
import Coin from '../Coin';
import ReactPaginate from 'react-paginate';

const CoinSummaryPage = () => {

    const [coins, setCoins] = useState([].slice(0, 50));
    

    useEffect(() => {
        const fetchData = async() => {
            var res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d'
                // params: {
                //     vs_curency: "usd",
                //     order : "market_cap_desc",
                //     // convert: "USD",
                // },
            )
            setCoins(res.data);
            console.log(res.data);
                // params: {
                //     vs_curency: "usd",
                //     order : "market_cap_desc",
                //     // convert: "USD",
                // },
            
        }

        fetchData();
    }, []);

    const [pageNumber, setPageNumber] = useState(0);

    const itemsPerPage = 10;
    const pagesVisited = pageNumber * itemsPerPage;

    const displayItems = coins
    .slice(pagesVisited, pagesVisited + itemsPerPage)
    .map((coin) => {
      return (
        <Coin
        id={coin.id}
        rank={coin.market_cap_rank}
        name={coin.name}
        image={coin.image}
        price={coin.current_price}
        pricechange1h={coin.price_change_percentage_1h_in_currency}
        pricechange24h={coin.price_change_percentage_24h_in_currency}
        pricechange7d={coin.price_change_percentage_7d_in_currency}
        marketcap={coin.market_cap}
        symbol={coin.symbol}
        ></Coin>
      );
    });

    const pageCount = Math.ceil(coins.length / itemsPerPage);

    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    return (
        <div className="container coin-table-container pt-5">
            <div className="coin-table">
                <div className="scrollable">
                <div className="table-heading d-inline-flex">
                    <div className="table-heading__rank"><p>#</p></div>
                    <div className="table-heading__coin-title"><p>Coin</p></div>
                    <div className="table-heading__price"><p>Price</p></div>
                    <div className="table-heading__price-change 1h"><p>1h</p></div>
                    <div className="table-heading__price-change 24h"><p>24h</p></div>
                    <div className="table-heading__price-change 7d"><p>7d</p></div>
                    <div className="table-heading__volume-change-24h"><p>24h Volume</p></div>
                    <div className="table-heading__market-cap"><p>Mkt Cap</p></div>
                </div>
                {displayItems}
                </div>
            </div>
                <ReactPaginate
                previousLabel={"Previous"}
                pageRangeDisplayed={"4"}
                marginPagesDisplayed={"1"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={"previousBttn"}
                nextLinkClassName={"nextBttn"}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
                />
        </div>
    )
}

export default CoinSummaryPage;