let web3, rates;
const _tokens = ["eth", "bnb", "matic"];
//name provider decimals rate balance yen
let tokenData = {
  eth:{provider:"https://mainnet.infura.io/v3/91ee6f7916c2401da3e84e67d4d4be20"},
  bnb:{provider:"https://bsc-dataseed1.binance.org:443"},
  matic:{ provider:"https://polygon-rpc.com"}
};

$('.btn.nozoku').click(async => {
  const ethData = await geneData("jpyc", "eth");
  const bnbData = await geneData("jpyc", "bnb");
  const maticData = await geneData("matic-network", "eth");
  rates = [ethData.jpyc.eth, bnbData.jpyc.bnb, ((ethData.jpyc.eth / maticData["matic-network"].eth)/1)];

  for(i=0;i < _tokens.length; i++){
    let _token = tokenData[_tokens[i]];
    _token.rate = rates[i];
    web3 = await new Web3(_token.provider);
    await web3.eth.getBalance($('.walletaddr').val(), (error, balance) => {
      _token.balance = web3.utils.fromWei(balance, "ether");
    })
    _token.yen = _token.balance / _token.rate;
  }
  console.log(tokenData);
})

async function geneData(id, vs){
  return await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${vs}`)).json();
}

/*
function ERC20nozoku(walletAddr, tokenAddr, decimals){
  const tokenInst = new web3.eth.Contract(abi.erc20, tokenAddr);
  let result = tokenInst.balanceOf(walletAddr);
  console.log("raw:" +result);
  console.log(result / (10 ** decimals));
}
*/