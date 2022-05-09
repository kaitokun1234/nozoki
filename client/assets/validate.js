function validation(){
}

$('.btn.nozoku').on("click", async () => {
  const walletinput = $('input.walletaddr');
  const erccheck = $('.check');
  const tokenAddrinput = $('input.tokenAddr');
  const tokensymbinput = $('input.tokenSymb');
  const chainselector = $('select');
  const re = /(^0x)+([a-f0-9]{40})/i;
  //ウォレットアドレスのバリデーション
  if(!walletinput.val()){
    //errmsg("ウォレットアドレスを入力してください");
    return;
  }
  if(!re.test(walletinput.val())){
    errmsg("ウォレットアドレスが無効です");
    return;
  }
  if(!erccheck.prop("checked")){
    //errmsg("バリデートを乗り越えました");
    await nozoku();
    return;
  }

  //ここからerc20のバリデーション
  if(!tokenAddrinput.val() || !tokensymbinput.val() || chainselector.val() == ""){
    //errmsg("未入力の項目があります");
    return;
  }
  if(tokensymbinput.val().length > 10){
    errmsg("トークン名が長すぎます");
    return;
  }
  if(!re.test(tokenAddrinput.val())){
    errmsg("トークンアドレスが無効です");
    return;
  }
  //console.log("バリデーションを乗り越えました");
  await nozoku();
})

function errmsg(msg){
  alert(msg);
}
