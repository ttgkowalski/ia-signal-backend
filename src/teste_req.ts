fetch("https://api.trade.atriunbroker.finance/v3/users/register", {
    "headers": {
      "accept": "application/json",
      "accept-language": "pt-BR,pt;q=0.5",
      "cache-control": "no-cache",
      "content-type": "application/json",
      "pragma": "no-cache",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Brave\";v=\"140\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Linux\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "sec-gpc": "1",
      "cookie": "aff=788754; aff_model=revenue; afftrack=atrium2; retrack=; aff_id=788754; aff_model=revenue; aff_track=atrium2; brand_id=52; landing=trade.atriunbroker.finance; pll_language=pt; device_id=c5b4d68d-5313-4f80-bef0-186c932e503a; device_id=c5b4d68d-5313-4f80-bef0-186c932e503a; experimentRedirect=1; platform_version=3744.3.4972.b2b.release; device_locale=pt; lang=pt_PT; newUser={%22identifier%22:%22fevofok631@datoinf.com%22}; platform=389",
      "Referer": "https://trade.atriunbroker.finance/"
    },
    "body": "{\"identifier\":\"fejih16941@datoinf.com\",\"password\":\"fejih16941@datoinf\",\"accepted\":[\"terms\",\"privacy policy\"],\"country_id\":30,\"first_name\":\"Alton\",\"last_name\":\"Beck\",\"timezone\":\"America/Sao_Paulo\"}",
    "method": "POST"
  }).then(res => res.json()).then(data => console.log(data));