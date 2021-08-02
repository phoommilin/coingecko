import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router';
import { Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import './CoinDetailPage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faBell, faLevelUpAlt, faLevelDownAlt  } from '@fortawesome/free-solid-svg-icons';
import {faTwitter, faGithub, faFacebook, faDiscord, faTelegram, faReddit} from '@fortawesome/free-brands-svg-icons'
import { faStar as farStar, faQuestionCircle, faClone } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios';
import CoinDetail from '../components/CoinDetail';
import EthLogo from '../ethereum.png';
import { forEach } from 'async';

const CoinDetailPage = () => {

    let {id} = useParams();
    const [coinData, setCoinData] = useState([]);
    const [dayVolume, setDayVolume] = useState([])
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const catData = coinData.categories;
    const [active, setActive] = useState('');
    const [catNameData, setCatNameData] = useState([]);

    useEffect(() => {
        
        const fetchData = async() => {
            var ress = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/`)
            var resss = await axios.get(`https://api.coingecko.com/api/v3/simple/price/` , {
                params: {
                    ids : id,
                    vs_currencies: 'usd',
                    include_24hr_vol: 'true',
                }
            })
            var catName = await axios.get(`https://api.coingecko.com/api/v3/coins/categories/list`)
            setDayVolume(Object.values(resss.data)[0])
            //console.log(ress.data);
            //setCoinData(Object.values(ress.data));
            setCoinData(ress.data)
            setIsLoading(false)
            setCatNameData(Object.values(catName.data));
        }
        
        fetchData();

    },[id]);

    function numberWithCommas(x) {
        return Number(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function extractHostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname
    
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
    
        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];
    
        return hostname;
    }

    function extractRootDomain(url) {
        var domain = extractHostname(url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;
    
        //extracting the root domain here
        //if there is a subdomain 
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
            //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
            if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
                //this is using a ccTLD
                domain = splitArr[arrLen - 3] + '.' + domain;
            }
        }

        domain = domain.replace('.org', '');
        domain = domain.replace('.io', '');
        domain = domain.replace('.to', '');

        return domain;
    }
    const renderChainLogo = (chain) => {
        let logo;
        switch (chain) {
            case 'ethereum':
                logo = EthLogo;
                break;
            case 'binance-smart-chain':
                logo = 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615';
                break;
            default:
                logo = EthLogo;
                break;
        }
        return logo;
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          A measure of a cryptocurrency trading volume across all tracked platforms in the last 24 hours. This is tracked on a rolling 24-hour basis with no open/closing times.
        </Tooltip>
    );

    const renderData = () => {
        
            if(isLoading) {
                return <div>Loading...</div>
            }

            return (
                <div>
                    <div className="container coin">
                        <div className="row">
                            <div className="col-12 col-lg-8 coin__left-column">
                                <div className="coin-rank">Rank #{coinData.market_cap_rank}</div>
                                <div className="coin-title">
                                    <img src={coinData.image.small} />
                                    {coinData.name} ({coinData.symbol.toUpperCase()})
                                </div>
                                <div className="coin-price d-flex">
                                    {coinData.market_data.current_price.usd < 1 ?
                                        <div className="coin-price-usd">${coinData.market_data.current_price.usd}</div>
                                    : <div className="coin-price-usd">${numberWithCommas(coinData.market_data.current_price.usd)}</div>
                                    }
                                    {
                                        coinData.market_data.price_change_percentage_24h > 0 ?
                                            <div className="coin-price-change green">{coinData.market_data.price_change_percentage_24h.toFixed(1)}%</div>
                                        :
                                            <div className="coin-price-change red">{coinData.market_data.price_change_percentage_24h.toFixed(1)}%</div>
                                    }
                                    
                                </div>
                                <div className="coin-btc d-flex">
                                    <div className="coin-btc-price">{coinData.market_data.current_price.btc} BTC</div>
                                    {
                                        coinData.market_data.price_change_percentage_24h_in_currency.btc > 0 ?
                                        <div className="d-flex">
                                            <div className="coin-btc-change green">{coinData.market_data.price_change_percentage_24h_in_currency.btc.toFixed(1)}%</div>
                                            <div className="coin-btc-change-icon">
                                                <FontAwesomeIcon icon={faLevelUpAlt} color="#4eaf0a" />
                                            </div>
                                        </div>
                                        :
                                        <div className="d-flex">
                                            <div className="coin-btc-change red">{coinData.market_data.price_change_percentage_24h_in_currency.btc.toFixed(1)}%</div>
                                            <div className="coin-btc-change-icon">
                                                <FontAwesomeIcon icon={faLevelDownAlt} color="#e15241" />
                                            </div>
                                        </div>
                                    }
                                   
                                </div>
                                {   coinData.market_data.current_price.eth > 0 ?
                                
                                <div className="coin-btc d-flex">
                                    <div className="coin-btc-price">{coinData.market_data.current_price.eth} ETH</div>
                                    {
                                        coinData.market_data.price_change_percentage_24h_in_currency.eth > 0 ?
                                        <div className="d-flex">
                                            <div className="coin-btc-change green">{coinData.market_data.price_change_percentage_24h_in_currency.eth.toFixed(1)}%</div>
                                            <div className="coin-btc-change-icon">
                                                <FontAwesomeIcon icon={faLevelUpAlt} color="#4eaf0a" />
                                            </div>
                                        </div>
                                        :
                                        <div className="d-flex">
                                            <div className="coin-btc-change red">{coinData.market_data.price_change_percentage_24h_in_currency.eth.toFixed(1)}%</div>
                                            <div className="coin-btc-change-icon">
                                                <FontAwesomeIcon icon={faLevelDownAlt} color="#e15241" />
                                            </div>
                                        </div>
                                    }
                                   
                                </div>
                                    : null

                                }
                                <div className="white-action-buttons">
                                    <button className="white-button">
                                        <FontAwesomeIcon icon={faShare} color="#374151" />
                                    </button>
                                    <button className="white-button">
                                        <FontAwesomeIcon icon={faBell} color="#374151"/>
                                    </button>
                                    <button className="white-button">
                                        <FontAwesomeIcon icon={farStar} color="#374151"/>
                                    </button>
                                </div>
                            </div>
                            <div className="col-12 col-lg-4 coin__right-column">
                                <div className="buy-sell-section-box">
                                    <div className="buy-sell-section">
                                        <button className="green-button">Buy / Sell</button>
                                        <button className="green-button">Long / Short</button>
                                        <button className="green-button">Earn / Loan</button>
                                        <button className="green-button">Collect Nft</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-8 coin__left-column">
                                <div className="row coin-data">
                                    <div className="col-12 col-lg-6 coin-data-first-column">
                                        <div className="coin-data-item d-flex">
                                            <div className="coin-data-item-title">
                                                <span>Market Cap</span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 0, hide: 300 }}
                                                    
                                                    overlay={
                                                        
                                                            <Popover id="popover-basic" >
                                                                <Popover.Body>
                                                                <div className="popover-box">
                                                                Market Cap = Current Price x Circulating Supply
                                                                <br/>
                                                                <br/>
                                                                Refers to the total market value of a cryptocurrency’s circulating supply. It is similar to the stock market’s measurement of multiplying price per share by shares readily available in the market (not held & locked by insiders, governments)
                                                                </div>
                                                                </Popover.Body>
                                                            </Popover>
                                                        
                                                    }
                                                >
                                                <div className="question-icon">
        
                                                 <FontAwesomeIcon icon={faQuestionCircle} />
                                                </div>
                                                </OverlayTrigger>
                                            </div>
                                            <div className="coin-data-item-value">${numberWithCommas(coinData.market_data.market_cap.usd)}</div>
                                        </div>
                                        <div className="coin-data-item d-flex">
                                            <div className="coin-data-item-title">
                                                <span>24 Hour Trading Vol</span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 0, hide: 300 }}
                                                    
                                                    overlay={
                                                        
                                                            <Popover id="popover-basic" >
                                                                <Popover.Body>
                                                                <div className="popover-box">
                                                                A measure of a cryptocurrency trading volume across all tracked platforms in the last 24 hours. This is tracked on a rolling 24-hour basis with no open/closing times.
                                                                <br/>
                                                                <br/>
                                                                <a className="readmore-link" href="https:www.google.com">Readmore</a>
                                                                </div>
                                                                </Popover.Body>
                                                            </Popover>
                                                        
                                                    }
                                                >
                                                    <div className="question-icon">
                                                        <FontAwesomeIcon icon={faQuestionCircle} />
                                                    </div>
                                                </OverlayTrigger>
                                            </div>
                                            <div className="coin-data-item-value">${numberWithCommas(dayVolume.usd_24h_vol.toFixed(0))}</div>
                                        </div>
                                        {
                                            coinData.market_data.fully_diluted_valuation.usd > 0 ?
                                            <div className="coin-data-item d-flex">
                                                <div className="coin-data-item-title"><span>Fully Diluted Valuation</span>
                                                <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 0, hide: 300 }}
                                                        
                                                        overlay={
                                                            
                                                                <Popover id="popover-basic" >
                                                                    <Popover.Body>
                                                                    <div className="popover-box">
                                                                    Market Cap = Current Price x Circulating Supply
                                                                    <br/>
                                                                    <br/>
                                                                    Refers to the total market value of a cryptocurrency’s circulating supply. It is similar to the stock market’s measurement of multiplying price per share by shares readily available in the market (not held & locked by insiders, governments)
                                                                    </div>
                                                                    </Popover.Body>
                                                                </Popover>
                                                            
                                                        }
                                                    >
                                                    <div className="question-icon">
        
                                                    <FontAwesomeIcon icon={faQuestionCircle} />
                                                    </div>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="coin-data-item-value">${numberWithCommas(coinData.market_data.fully_diluted_valuation.usd)}</div>
                                            </div>
                                            : null
                                        }
                                        {
                                            coinData.market_data.total_value_locked > 0 ?
                                            <div className="coin-data-item d-flex">
                                                <div className="coin-data-item-title">
                                                    <span>Total Value Locked (TVL)</span>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 0, hide: 300 }}
                                                        
                                                        overlay={
                                                            
                                                                <Popover id="popover-basic" >
                                                                    <Popover.Body>
                                                                    <div className="popover-box">
                                                                    Capital deposited into the platform in the form of loan collateral or liquidity trading pool. 
                                                                    <br/>
                                                                    <br/>
                                                                    Data provided by Defi Llama
                                                                    </div>
                                                                    </Popover.Body>
                                                                </Popover>
                                                            
                                                        }
                                                    >
                                                        <div className="question-icon">
                                                            <FontAwesomeIcon icon={faQuestionCircle} />
                                                        </div>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="coin-data-item-value">${numberWithCommas(coinData.market_data.total_value_locked)}</div>
                                            </div>
                                            : null
                                        }
                                        {
                                            coinData.market_data.fdv_to_tvl_ratio > 0 ?
                                            <div className="coin-data-item d-flex">
                                                <div className="coin-data-item-title">
                                                    <span>Fully Diluted Valuation / TVL Ratio</span>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 0, hide: 300 }}
                                                        
                                                        overlay={
                                                            
                                                                <Popover id="popover-basic" >
                                                                    <Popover.Body>
                                                                    <div className="popover-box">
                                                                    Ratio of fully diluted valuation (FDV) over total value locked (TVL) of this asset. A ratio of more than 1.0 means that the FDV is greater than its TVL.
                                                                    <br/>
                                                                    <br/>
                                                                    FDV/TVL is used to approximate a protocol’s fully diluted market value vs. the amount in assets it has staked/locked.
                                                                    </div>
                                                                    </Popover.Body>
                                                                </Popover>
                                                            
                                                        }
                                                    >
                                                        <div className="question-icon">
                                                            <FontAwesomeIcon icon={faQuestionCircle} />
                                                        </div>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="coin-data-item-value">{numberWithCommas(coinData.market_data.fdv_to_tvl_ratio)}</div>
                                            </div>
                                            : null
                                        }
                                        {
                                            coinData.market_data.mcap_to_tvl_ratio > 0 ?
                                            <div className="coin-data-item d-flex">
                                                <div className="coin-data-item-title">
                                                    <span>Market Cap / TVL Ratio</span>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 0, hide: 300 }}
                                                        
                                                        overlay={
                                                            
                                                                <Popover id="popover-basic" >
                                                                    <Popover.Body>
                                                                    <div className="popover-box">
                                                                    Ratio of market capitalization over total value locked of this asset. A ratio of more than 1.0 refers to its market cap being greater than its total value locked. 
                                                                    <br/>
                                                                    <br/>
                                                                    MC/TVL is used to approximate a protocol’s market value vs. the amount in assets it has staked/locked.
                                                                    </div>
                                                                    </Popover.Body>
                                                                </Popover>
                                                            
                                                        }
                                                    >
                                                        <div className="question-icon">
                                                            <FontAwesomeIcon icon={faQuestionCircle} />
                                                        </div>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="coin-data-item-value">{numberWithCommas(coinData.market_data.mcap_to_tvl_ratio)}</div>
                                            </div>
                                            : null
                                        } 
                                    </div>
                                    <div className="col-12 col-lg-6 coin-data-second-column">
                                        <div className="coin-data-item d-flex">
                                            <div className="coin-data-item-title">
                                                <span>Circulating Supply</span>
                                                <OverlayTrigger
                                                    placement="top"
                                                    delay={{ show: 0, hide: 300 }}
                                                    
                                                    overlay={
                                                        
                                                            <Popover id="popover-basic" >
                                                                <Popover.Body>
                                                                <div className="popover-box">
                                                                The amount of coins that are circulating in the market and are tradeable by the public. It is comparable to looking at shares readily available in the market (not held & locked by insiders, governments).
                                                                <br/>
                                                                <br/>
                                                                <a className="readmore-link" href="https:www.google.com">Readmore</a>
                                                                </div>
                                                                </Popover.Body>
                                                            </Popover>
                                                        
                                                    }
                                                >
                                                <div className="question-icon">
        
                                                 <FontAwesomeIcon icon={faQuestionCircle} />
                                                </div>
                                                </OverlayTrigger>
                                            </div>
                                            <div className="coin-data-item-value">{numberWithCommas(coinData.market_data.circulating_supply.toFixed(0))}</div>
                                        </div>
                                        {
                                            coinData.market_data.total_supply > 0 ?
                                            <div className="coin-data-item d-flex">
                                                <div className="coin-data-item-title">
                                                    <span>Total Supply</span>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 0, hide: 300 }}
                                                        
                                                        overlay={
                                                            
                                                                <Popover id="popover-basic" >
                                                                    <Popover.Body>
                                                                    <div className="popover-box">
                                                                    The amount of coins that have already been created, minus any coins that have been burned (removed from circulation). It is comparable to outstanding shares in the stock market. 
                                                                    <br/>
                                                                    <br/>
                                                                    Total Supply = Onchain supply - burned tokens
                                                                    </div>
                                                                    </Popover.Body>
                                                                </Popover>
                                                            
                                                        }
                                                    >
                                                    <div className="question-icon">
        
                                                    <FontAwesomeIcon icon={faQuestionCircle} />
                                                    </div>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="coin-data-item-value">{numberWithCommas(coinData.market_data.total_supply.toFixed(0))}</div>
                                            </div>
                                            : null
                                        }
                                        {
                                            coinData.market_data.max_supply > 0 ?
                                            <div className="coin-data-item d-flex">
                                                <div className="coin-data-item-title">
                                                    <span>Max Supply</span>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 0, hide: 300 }}
                                                        
                                                        overlay={
                                                            
                                                                <Popover id="popover-basic" >
                                                                    <Popover.Body>
                                                                    <div className="popover-box">
                                                                    The maximum number of coins coded to exist in the lifetime of the cryptocurrency. It is comparable to the maximum number of issuable shares in the stock market.
                                                                    <br/>
                                                                    <br/>
                                                                    Max Supply = Theoretical maximum as coded
                                                                    </div>
                                                                    </Popover.Body>
                                                                </Popover>
                                                            
                                                        }
                                                    >
                                                    <div className="question-icon">
        
                                                    <FontAwesomeIcon icon={faQuestionCircle} />
                                                    </div>
                                                    </OverlayTrigger>
                                                </div>
                                                <div className="coin-data-item-value">{numberWithCommas(coinData.market_data.max_supply)}</div>
                                            </div>
                                            : null
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 show-button-mobile">
                                <div onClick={() => setActive('active')} className={`show-button ` + active}>
                                    Show All
                                </div>
                            </div>
                            <div className={`col-12 col-lg-4 coin__right-column mobile ` + active}>
                                {(Object.keys(coinData.platforms)).length > 1 ?
                                <div className="row coin-link-row ">
                                    <div className="col-4 coin-link-title">Contract</div>
                                    <div className="col-8 coin-link-list d-flex">
                                            <a href="https://www.coingecko.com">
                                            { Object.keys(coinData.platforms).map((key, index) =>
                                            <div>
                                                { (coinData.platforms[key].length > 4) ?
                                                    <div className="coin-link-item">
                                                        <img src={renderChainLogo(key)} />
                                                        <span>
                                                        {coinData.platforms[key].slice(0,3)}...{coinData.platforms[key].slice(-3)}
                                                        </span>
                                                        <FontAwesomeIcon icon={faClone} className="copy-icon" />
                                                    </div>
                                                    : null
                                                }
                                            </div>
                                            )}
                                            </a>
                                    </div>
                                </div>
                                : null
                                }
                                
                                {
                                    coinData.links.homepage != null ?
                                    <div className="row coin-link-row ">
                                        <div className="col-4 coin-link-title">Website</div>
                                        <div className="col-8 coin-link-list d-flex">
                                    

                                            {(coinData.links.homepage.map((homelink) => {

                                                if(homelink === "") {
                                                    return (
                                                        null
                                                    )
                                                } else {
                                                    return (
                                                        <div className="coin-link-list">
                                                            <a target='_blank' href={homelink}>
                                                                <div className="coin-link-item">
                                                                    <span>
                                                                        {extractRootDomain(homelink)}
                                                                    </span>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    )
                                                }   
                                            }))}
                                        </div>
                                    </div>

                                    : null    
                                }
                                {
                                    coinData.links.blockchain_site != null ?
                                    <div className="row coin-link-row">
                                        <div className="col-4 coin-link-title"><span>Explorers</span></div>
                                        <div className="col-8 coin-link-list d-flex">
                                            {(coinData.links.blockchain_site.map((blocklink) => 
                                                blocklink ? 
                                                <div className="coin-link-list">
                                                    <a target='_blank' href={blocklink}>
                                                        <div className="coin-link-item">
                                                            <span>{extractRootDomain(blocklink)}</span>
                                                        </div>
                                                    </a>
                                                </div> : ''
                                            ))}
                                        </div>
                                    </div>
                                    : null
                                    
                                }
                                <div className="row coin-link-row ">
                                    <div className="col-4 coin-link-title">Wallets</div>
                                    <div className="col-8 coin-link-list d-flex">
                                        <a href="https://www.coingecko.com">
                                            <div className="coin-link-item"><span>Ledger</span></div>
                                        </a>
                                    </div>
                                </div>
                                <div className="row coin-link-row ">
                                    <div className="col-4 coin-link-title">Community</div>
                                    <div className="col-8 coin-link-list d-flex">
                                        {
                                            coinData.links.subreddit_url !== "" ?
                                            <a target='_blank' href={coinData.links.subreddit_url}>
                                                <div className="coin-link-item">
                                                    <FontAwesomeIcon icon={faReddit} />
                                                    <span>Reddit</span>
                                                </div>
                                            </a>
                                            : null
                                        }
                                        {
                                            coinData.links.twitter_screen_name !== "" ?
                                            <a target='_blank' href={`https://twitter.com/` + coinData.links.twitter_screen_name}>
                                                <div className="coin-link-item">
                                                    <FontAwesomeIcon icon={faTwitter} />
                                                    <span>Twitter</span>
                                                </div>
                                            </a>
                                            : null
                                        }
                                        {
                                            coinData.links.facebook_username !== "" ?
                                            <a target='_blank' href={`https://facebook.com/` + coinData.links.facebook_username}>
                                                <div className="coin-link-item">
                                                    <FontAwesomeIcon icon={faFacebook} />
                                                    <span>Facebook</span>
                                                </div>
                                            </a>
                                            : null
                                        }
                                        {
                                            coinData.links.telegram_channel_identifier.toString() !== "" ?
                                            <a target='_blank' href={`https://t.me/` + coinData.links.telegram_channel_identifier}>
                                                <div className="coin-link-item">
                                                    <FontAwesomeIcon icon={faTelegram} />
                                                    <span>Telegram</span>
                                                </div>
                                            </a>
                                            : null
                                        }
                                    </div>
                                </div>
                                <div className="row coin-link-row ">
                                    <div className="col-4 coin-link-title">Source Code</div>
                                    <div className="col-8 coin-link-list d-flex">
                                        
                                        {   coinData.links.repos_url != null ?
                                        
                                                <a target='_blank' href={coinData.links.repos_url.github[0]}>
                                                    <div className="coin-link-item">
                                                        <FontAwesomeIcon icon={faGithub} />
                                                        <span>Github</span>
                                                    </div>
                                                </a>
                                            : null
                                        }
                                        
                                    </div>
                                </div>
                                <div className="row coin-link-row ">
                                    <div className="col-4 coin-link-title">API id</div>
                                    <div className="col-8 coin-link-list d-flex">
                                        <div className="coin-link-id">
                                            <div className="coin-link-item">
                                                <span>{coinData.id}</span>
                                                <FontAwesomeIcon icon={faClone} className="copy-icon"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    coinData.categories.length > 3 ?

                                    <div className="row coin-link-row ">
                                        <div className="col-4 coin-link-title">Tags</div>
                                        <div className="col-8 coin-link-list d-flex">
                                            <a target='_blank' href={`https://www.coingecko.com/en/categories/` + coinData.categories[0].replace(/ +/g, '-').toLowerCase()}>
                                                <div className="coin-link-item"><span>{coinData.categories[0]}</span></div>
                                            </a>
                                            <a target='_blank' href={`https://www.coingecko.com/en/categories/` + coinData.categories[1].replace(/ +/g, '-').toLowerCase()}>
                                                <div className="coin-link-item"><span>{coinData.categories[1]}</span></div>
                                            </a>
                                            <a target='_blank' href={`https://www.coingecko.com/en/categories/` + coinData.categories[2].replace(/ +/g, '-').toLowerCase()}>
                                                <div className="coin-link-item"><span>{coinData.categories[2]}</span></div>
                                            </a>
                                            { show?
                                            <div>
                                                {coinData.categories.slice(3).map((coins) => {
                                                    console.log(coins.replace(/ +/g, '-').toLowerCase())
                                                    return (
                                                    <a target='_blank' href={`https://www.coingecko.com/en/categories/` + coins.replace(/ +/g, '-').toLowerCase()}>
                                                        <div className="coin-link-item"><span>{coins}</span></div>
                                                    </a>
                                                    )
                                                    
                                                })}
                                                <button onClick={() => setShow(false)}>
                                                    <div className="coin-link-item green"><span>Hide</span></div>
                                                </button> 
                                            </div>   
                                                :
                                                <button onClick={() => setShow(true)}>
                                                    <div className="coin-link-item green"><span>Show All</span></div>
                                                </button>
                                            }
                                        </div>
                                    </div>

                                    :

                                    <div className="row coin-link-row ">
                                        <div className="col-4 coin-link-title">Tags</div>
                                        <div className="col-8 coin-link-list d-flex">
                                            
                                            {coinData.categories.map((coins) => {
                                                
                                                return (
                                                    <a target='_blank' href={`https://www.coingecko.com/en/categories/` + coins.replace(/ +/g, '-').toLowerCase()}>
                                                        <div className="coin-link-item"><span>{coins}</span></div>
                                                    </a>
                                                )
                                            })}
                                        </div>
                                    </div>
                                }
                                
                                <div className="show-button-mobile">
                                    <div onClick={() => setActive('')} className={`show-button hide`}>
                                        Hide
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                    {/* <a href="https://www.coingecko.com">
                                            <div className="coin-link-item"><span>Token</span></div>
                                        </a>
                                        <a href="https://www.coingecko.com">
                                            <div className="coin-link-item"><span>Smart Contract Platform</span></div>
                                        </a>
                                        <a href="https://www.coingecko.com">
                                            <div className="coin-link-item"><span>Yield Farming</span></div>
                                        </a>
                                        {
                                            show?
                                            <div>
                                                <a href="https://www.coingecko.com">
                                                    <div className="coin-link-item"><span>Decentralized Finance (Defi)</span></div>
                                                </a>
                                                <a href="https://www.coingecko.com">
                                                    <div className="coin-link-item"><span>Decentralized Exchange Token (DEX)</span></div>
                                                </a>
                                                <a href="https://www.coingecko.com">
                                                    <div className="coin-link-item"><span>Governance</span></div>
                                                </a> 
                                                <button onClick={() => setShow(false)}>
                                                    <div className="coin-link-item green"><span>Hide</span></div>
                                                </button> 
                                            </div>   
                                            :
                                            <button onClick={() => setShow(true)}>
                                                <div className="coin-link-item green"><span>Show All</span></div>
                                            </button>
                                        } */}
                </div>
            )
    }
    
    return renderData();
}

export default CoinDetailPage;