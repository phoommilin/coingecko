import logo from './logo.svg';
import Prices from './Prices';
import Testing from './Testing';
import Books from './Books';
import CoinSummaryPage from './pages/CoinSummaryPage'; 
import {BrowserRouter, Route} from 'react-router-dom';
import CoinDetailPage from './pages/CoinDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={CoinSummaryPage}/>
      <Route path="/coins/:id" component={CoinDetailPage} />
    </BrowserRouter>
  );
}

export default App;
