let web3;
let tokenData = { eth: {}, bnb: {}, matic: {} };
const roundDown = (num, rank) => Math.floor( num * Math.pow( 10, rank ) ) / Math.pow( 10, rank ) ;
const geneData = async (id, vs) => await (await fetch(
  `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${vs}`)).json();
const providers = [
  'https://mainnet.infura.io/v3/91ee6f7916c2401da3e84e67d4d4be20',
  'https://bsc-dataseed1.binance.org:443',
  'https://polygon-rpc.com'
];

$(document).ready(function () {
  $('.row.under').hide();
  $('select').formSelect();
  $('.form.ERC20').hide();
});

$('input.check.ERC20').change(() => {
  $('input.check.ERC20').prop('checked') ?
    $('.form.ERC20').fadeIn() :
    $('.form.ERC20').fadeOut();
})

async function nozoku() {
  $('.row.under').show();
  let resultdom = "";
  const walletAddr = $('.walletaddr').val();
  const tokens = ['eth', 'bnb', 'matic'];
  const rates = await calculateRate();

  if ($('input.check.ERC20').prop('checked')) {
    let _symbol = $('input#tokenSymb').val();
    tokens.push(_symbol);
    tokenData[_symbol] = {};
    providers.push(providers[tokens.indexOf($('select').val())]);
  }

  for (i = 0; i < tokens.length; i++) {
    web3 = await new Web3(providers[i]);
    const token = tokenData[tokens[i]];
    const isBase = i < 3 ? true : false;
    const balance = isBase ?
      await web3.eth.getBalance(walletAddr) :
      await erc20Balance(walletAddr, $('input#tokenAddr').val());
    token.balance = web3.utils.fromWei(balance, 'ether');
    token.yen = isBase ? (Number(roundDown((token.balance / rates[i]), 2)).toLocaleString() + "円") : "";
    resultdom = generatedom(token, resultdom, tokens[i]);
  }
  $('div.result').html(resultdom);
}

async function calculateRate() {
  const ethData = await geneData('jpyc', 'eth');
  const bnbData = await geneData('jpyc', 'bnb');
  const maticData = await geneData('matic-network', 'eth');
  return [ethData.jpyc.eth, bnbData.jpyc.bnb,
  ethData.jpyc.eth / maticData['matic-network'].eth / 1
  ];
}

function generatedom(token, alreadytxt, name){
  const result = `${alreadytxt}
  <div class="result group clear py-3">
    <div class="result item">
      <img src="./assets/img/${name}.png" alt="tok" title="tokenlogo" class="brandlogo col-4">
      <strong>${name.toUpperCase()}<strong>
    </div>
    <div class="result item px-4">
      <h4>
        ${roundDown(token.balance, 5)} ${name.toUpperCase()}
      </h4>
        <p>${token.yen}</p>
    </div>
  </div>`
  return result;
}

async function erc20Balance(walletAddr, tokenAddr) {
  const tokenInst = await new web3.eth.Contract(abi.minABI, tokenAddr);
  let balance = await tokenInst.methods.balanceOf(walletAddr).call();
  return balance;
}