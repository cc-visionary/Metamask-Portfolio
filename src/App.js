import { useCallback, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { AutoComplete, Button } from 'antd';
import axios from 'axios';

import { injected } from './wallet/Connectors';
import { abi, availableTokens, coingecko_base_url } from './utils/constants';
import { getAddresses, setAddresses } from './utils/store';

import Chart from './Chart';
import PriceTable from './PriceTable';

import './App.css';

export default function App() {
  const hasMetamaskInstalled = typeof window.ethereum !== 'undefined';
  const [tokens, setTokens] = useState([]);
  const [tokenAddresses, setTokenAddresses] = useState(getAddresses() || []);
  const [toBeAdded, setToBeAdded] = useState(availableTokens[0].name);
  const [total, setTotal] = useState(0);
  const { active, account, library, activate, deactivate } = useWeb3React();

  // get the balance of all token addresses
  const getBalances = useCallback(async () => {
    setTokens([])
    for (let tokenAddress of tokenAddresses) {
      getBalance(tokenAddress)
    }
  }, [account]);

  async function getBalance(tokenAddress) {
    const contract = new library.eth.Contract(abi, tokenAddress);
    const [symbol, decimals, name, balanceOf] = await Promise.all([
      contract.methods.symbol().call(),
      contract.methods.decimals().call(),
      contract.methods.name().call(),
      contract.methods.balanceOf(account).call(),
    ]);

    const balance = balanceOf / Math.pow(10, decimals)

    try {
      const coin_list = await axios.get(`${coingecko_base_url}/coins/list`);
      const data = coin_list.data
      const index = data.map(d => d.symbol.toUpperCase()).indexOf(symbol.toUpperCase());
      const coingecko_id =  data[index].id

      const coingecko_price = await axios.get(`${coingecko_base_url}/simple/price?ids=${coingecko_id}&vs_currencies=usd`)
      const price = parseFloat(coingecko_price.data[coingecko_id]['usd'])

      const newToken = {
        symbol,
        name,
        price,
        balance,
        usd: balance * price,
      }
      if(!tokens.map(t => t.symbol).includes(newToken.symbol)) {
        setTokens(currentTokens => [...currentTokens, newToken]);
        setTotal(t => t + balance * price)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function getDefaultCurrency() {
    if(!tokens.map(t => t.symbol).includes('BNB')) {
      const balance = await library.eth.getBalance(account) / Math.pow(10, 18);
      try {
        const coingecko_id = 'binancecoin';
        const coingecko_price = await axios.get(`${coingecko_base_url}/simple/price?ids=${coingecko_id}&vs_currencies=usd`)
        const price = parseFloat(coingecko_price.data[coingecko_id]['usd'])
        
        setTokens([...tokens, {symbol: 'BNB', name: 'Binance Coin', price, balance, usd: balance * price }])
        setTotal(total + balance * price)
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    if(active) {
      getBalances();
      getDefaultCurrency();
    } else {
      setTokens([]);
      setTotal(0)
    }
  }, [account]);

  async function handleConnectDisconnect() {
    if(hasMetamaskInstalled) {
      try {
        if(active) {
          await deactivate();
        } else {
          await activate(injected);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  function addToken() {
    const index = availableTokens.map(t => t.name).indexOf(toBeAdded);
    if(index >= 0) {
      const currAddress = availableTokens[index].address;
      if(!tokenAddresses.includes(currAddress)) {
        getBalance(currAddress)
        const newAddresses = [...tokenAddresses, currAddress];
        setTokenAddresses(newAddresses)
        setAddresses(newAddresses)
      }
    } else {
      // if the input is an address
      if(toBeAdded[0] === "0" && toBeAdded[1] === "x") {
        if(!tokenAddresses.includes(toBeAdded)) {
          getBalance(toBeAdded)
          const newAddresses = [...tokenAddresses, toBeAdded];
          setTokenAddresses(newAddresses)
          setAddresses(newAddresses)
        }
      } else {
        console.log("Invalid Input")
      }
    }
    setToBeAdded(availableTokens[0].name)
  }

  function removeItem(index) {
    const newAddresses = [...tokenAddresses.slice(0, index), ...tokenAddresses.slice(index + 1)]
    const newTokens = [...tokens.slice(0, index), ...tokens.slice(index + 1)]

    setTokenAddresses(newAddresses)
    setAddresses(newAddresses)
    setTokens(newTokens)
  }

  return (
    <div className="app">
      <div className="button-row">
        <div></div>
        <div className="button-div">
          <Button type={active ? "primary" : "default"} onClick={handleConnectDisconnect} disabled={!hasMetamaskInstalled}>{active ? 'Disconnect' : 'Connect to Metamask'}</Button>
          <div>{active ? `Connected with ${account}` : 'Disconnected'}</div>
        </div>
      </div>
      <div className="body">
        <div className="left-body">
          <h2 className="total">Total: ${parseFloat(total).toFixed(2)}</h2>
          <Chart data={tokens.length > 1 ? tokens.map((t) => ({type: t.symbol, value: parseFloat(t.usd) / parseFloat(total) * 100})) : []} />
        </div>
        <div className="right-body">
          <div className="add-token">
            <AutoComplete 
              value={toBeAdded} 
              onChange={(val) => setToBeAdded(val)} 
              placeholder="Input the token name/address" 
              options={availableTokens.map(t => ({value: t.name})).filter(t => !tokens.map(tt => tt.name).includes(t.value))} 
              disabled={!active}
            />
            <Button onClick={addToken} disabled={!active}>Add</Button>
          </div>
          <PriceTable data={tokens} removeItem={removeItem} />
        </div>
      </div>
    </div>
  );
}