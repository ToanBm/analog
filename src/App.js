import { web3Enable } from '@polkadot/extension-dapp';
import { TimegraphClient } from '@analog-labs/timegraph-js';
import './App.css';
import { useEffect, useState } from 'react';

const CONFIG = {
  identifier:
    "SELECT a._clock, a._index, a.name FROM   '{NININI_name()}' AS a ORDER BY a._clock DESC",
  fields: ["_clock"],
};

async function init() {
 
}

async function initialQuery(name, hashId, setData, setLoading, setFund) {
  setLoading(true);
  await web3Enable(name);
  const timeGraphClient = new TimegraphClient({
    url: "https://timegraph.testnet.analog.one/graphql", // A url to Watch GraphQL instance.
    // Session key created by user wallet using WASM SDK
    sessionKey:
      "your-section-key",
  });

  const fund  = await timeGraphClient.tokenomics.sponsorView({
    viewName: name,
    amount: "500000000"
  })

  setFund(fund);
  const aliasResponse = await timeGraphClient.alias.add({
    hashId: hashId,
    name: name,
    identifier: CONFIG.identifier,
  });
  console.log("aliasResponse", aliasResponse);
 
  const response = await timeGraphClient.view.data({
    _name: name,
    hashId: hashId,
    fields: [...CONFIG.fields],
    limit: 10
  });
  console.log('response', response);
  setData({status: aliasResponse?.status, view: response});
  setLoading(false);
}

function App() {
  const [name, setName] = useState('');
  const [hashId, setHashId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fund, setFund] = useState('');
  const [data, setData] = useState({status: '', view: []});
  useEffect(() => {
    init();
  }, [])
  return (
    <div className="App">
       <div className='container'>
          <div className='form'>
          <div className='input'>
            <label>Name View:</label>
            <input onChange={(e) => setName(e.target.value)} onInput={(e) => setName(e.target.value)}/>
          </div>
          <div className='input'>
            <label>HashId: </label>
            <input onChange={(e) => setHashId(e.target.value)} onInput={(e) => setHashId(e.target.value)}/>
          </div>
          <button disabled={loading} className='button' onClick={() => initialQuery(name, hashId, setData, setLoading, setFund)}>
            {
              loading ? "Quering..." : "Query"
            } 
            </button>
          </div>
          <div className="result">
          <div>
              <p>Fund:</p>
              <div>
                {
                  <p>{JSON.stringify(fund)}</p>
                }
              </div>
            </div>
            <p>Status: {data.status}</p>
            <div>
              <p>View:</p>
              <div>
                {
                  <p>{JSON.stringify(data.view)}</p>
                }
              </div>
            </div>
        </div>
        </div>

    </div>
  );
}

export default App;
