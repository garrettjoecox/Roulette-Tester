
require('colorslite');

var wallet = 2000;
var bet = 200;
var threshold = bet*128;
var startingBet = bet;
var style = 'EU';
var estreak = 0;
var ostreak = 0;

jamesBond();

function martingale() {

  if (wallet < bet) {
    console.log('Out of money!');
    return;
  }

  var number = rollNumber();
  var won = 0;

  wallet-= bet;

  console.log(number);
  if (number != 37 && number != 38 && number % 2 === 0) {
    wallet+= (bet * 2);
    won = bet;
    bet = startingBet;
  } else {
    bet = bet*2;
    if (bet > threshold) bet = startingBet;
  }

  log(wallet, won);

  setTimeout(martingale, 50);

}

function notSafeLol() {

  if (wallet < bet) {
    console.log('Out of money!');
    return;
  }

  var number = rollNumber();
  var won = 0;

  wallet-= bet;

  if (1 <= number && number <= 18) {
    wallet+= (bet * 1.1);
    won = bet * 0.1;
  } else if (25 <= number && number <= 36) {
    wallet+= (bet * 1.1);
    won = bet * 0.1;
  }

  log(wallet, won);

  setTimeout(notSafeLol, 50);

}

function jamesBond() {

  if (wallet < bet) {
    console.log('Out of money!');
    return;
  }

  var number = rollNumber();
  var won = 0;

  wallet-= bet;

  if (number === 37) {
    wallet+= (bet * 1.8);
    won = bet * 0.8;
  } else if (13 <= number && number <= 18) {
    wallet+= (bet * 1.5);
    won = bet * 0.5;
  } else if (19 <= number && number <= 36) {
    wallet+= (bet * 1.4);
    won = bet * 0.4;
  }

  log(wallet, won);

  setTimeout(jamesBond, 50);

}

function log(wallet, won) {
  if (won) {
    console.log('Won $'.green + won.toString().green);
    console.log('Wallet:', wallet);
  } else {
    console.log('Lost $'.red + bet.toString().red);
    console.log('Wallet:', wallet);
  }
}

function rollNumber() {
  return style === 'US' ? Math.floor((Math.random() * 38) + 1) : Math.floor((Math.random() * 37) + 1);
}
