require('colorslite');

const GAME_ODDS = {
  US: 'GAME_ODDS_US',
  EU: 'GAME_ODDS_EU',
};

const BET_TYPE = {
  STRAIGHT: 'BET_TYPE_STRAIGHT',
  SPLIT: 'BET_TYPE_SPLIT',
  STREET: 'BET_TYPE_STREET',
  CORNER: 'BET_TYPE_CORNER',
  DOUBLE_STREET: 'BET_TYPE_DOUBLE_STREET',
  BASKET: 'BET_TYPE_BASKET',
  COLUMN: 'BET_TYPE_COLUMN',
  DOZEN: 'BET_TYPE_DOZEN',
  EVEN: 'BET_TYPE_EVEN',
};

const EVEN_TYPE = {
  RED: 'EVEN_TYPE_RED',
  BLACK: 'EVEN_TYPE_BLACK',
  EVEN: 'EVEN_TYPE_EVEN',
  ODD: 'EVEN_TYPE_ODD',
  LOW: 'EVEN_TYPE_LOW',
  HIGH: 'EVEN_TYPE_HIGH',
};

const EVEN_RED_ROLLS =   ['1', '3', '5', '7', '9', '12', '14', '16', '18', '19', '21', '23', '25', '27', '30', '32', '34', '36'];
const EVEN_BLACK_ROLLS = ['2', '4', '6', '8', '10', '11', '13', '15', '17', '20', '22', '24', '26', '28', '29', '31', '33', '35'];
const EVEN_EVEN_ROLLS =  ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36'];
const EVEN_ODD_ROLLS =   ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31', '33', '35'];
const EVEN_LOW_ROLLS =   ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
const EVEN_HIGH_ROLLS =  ['19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];

const DOZEN_TYPE = {
  FIRST: 'DOZEN_TYPE_FIRST',
  SECOND: 'DOZEN_TYPE_SECOND',
  THIRD: 'DOZEN_TYPE_THIRD',
};

const DOZEN_FIRST_ROLLS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const DOZEN_SECOND_ROLLS = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
const DOZEN_THIRD_ROLLS = ['25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];

const COLUMN_TYPE = {
  FIRST: 'COLUMN_TYPE_FIRST',
  SECOND: 'COLUMN_TYPE_SECOND',
  THIRD: 'COLUMN_TYPE_THIRD',
};

const COLUMN_FIRST_ROLLS = ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28', '31', '34'];
const COLUMN_SECOND_ROLLS = ['2', '5', '8', '11', '14', '17', '20', '23', '26', '29', '32', '35'];
const COLUMN_THIRD_ROLLS = ['3', '6', '9', '12', '15', '18', '21', '24', '27', '30', '33', '36'];

const BASKET_ROLLS = ['00', '0', '1', '2', '3'];

const STRAIGHT_TYPE = ['00', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];

class Game {
  constructor({ odds, minimumBet } = {}) {
    this.odds = odds || GAME_ODDS.US;
    this.minimumBet = minimumBet || 10;
    this.bets = [];
    this.rolls = 0;
  }

  roll() {
    this.rolls++;
    const possibilities = this.odds === GAME_ODDS.US ? STRAIGHT_TYPE.slice(0) : STRAIGHT_TYPE.slice(1);

    return possibilities[Math.floor(Math.random() * possibilities.length)];
  }

  spin() {
    const roll = this.roll();

    this.bets.forEach(({ player, type, on, amount }) => {
      if (type === BET_TYPE.EVEN) {
        if (
          (on === EVEN_TYPE.RED && EVEN_RED_ROLLS.includes(roll)) ||
          (on === EVEN_TYPE.BLACK && EVEN_BLACK_ROLLS.includes(roll)) ||
          (on === EVEN_TYPE.EVEN && EVEN_EVEN_ROLLS.includes(roll)) ||
          (on === EVEN_TYPE.ODD && EVEN_ODD_ROLLS.includes(roll)) ||
          (on === EVEN_TYPE.LOW && EVEN_LOW_ROLLS.includes(roll)) ||
          (on === EVEN_TYPE.HIGH && EVEN_HIGH_ROLLS.includes(roll))
        ) {
          player.wallet += amount * 2;
        }
      } else if (type === BET_TYPE.DOZEN) {
        if (
          (on === DOZEN_TYPE.FIRST && DOZEN_FIRST_ROLLS.includes(roll)) ||
          (on === DOZEN_TYPE.SECOND && DOZEN_SECOND_ROLLS.includes(roll)) ||
          (on === DOZEN_TYPE.THIRD && DOZEN_THIRD_ROLLS.includes(roll))
        ) {
          player.wallet += amount * 3;
        }
      } else if (type === BET_TYPE.COLUMN) {
        if (
          (on === COLUMN_TYPE.FIRST && COLUMN_FIRST_ROLLS.includes(roll)) ||
          (on === COLUMN_TYPE.SECOND && COLUMN_SECOND_ROLLS.includes(roll)) ||
          (on === COLUMN_TYPE.THIRD && COLUMN_THIRD_ROLLS.includes(roll))
        ) {
          player.wallet += amount * 3;
        }
      } else if (type === BET_TYPE.BASKET) {
        if (BASKET_ROLLS.includes(roll)) {
          player.wallet += amount * 7;
        }
      } else if (type === BET_TYPE.STRAIGHT && roll === on) {
        player.wallet += amount * 36;
      }

      if (player.wallet > player.highest) player.highest = player.wallet;
    });

    this.bets = [];
  }

  bet(player, type, on, amount) {
    this.validateBet(player, type, on, amount);

    player.wallet -= amount;

    this.bets.push({
      player,
      type,
      on,
      amount,
    });
  }

  validateBet(player, type, on, amount) {
    if (typeof amount !== 'number') throw new Error('Amount must be a number');
    if (amount < 1) throw new Error('Amount must be at least 1');
    if (amount > player.wallet) throw new Error('Player does not have enough in wallet');

    if (type === BET_TYPE.EVEN) {
      if (!Object.values(EVEN_TYPE).includes(on)) {
        throw new Error('Invalid even bet type');
      }
    } else if (type === BET_TYPE.DOZEN) {
      if (!Object.values(DOZEN_TYPE).includes(on)) {
        throw new Error('Invalid dozen bet type');
      }
    } else if (type === BET_TYPE.COLUMN) {
      if (!Object.values(COLUMN_TYPE).includes(on)) {
        throw new Error('Invalid column bet type');
      }
    } else if (type === BET_TYPE.BASKET && this.odds !== GAME_ODDS.US) {
      throw new Error('Basket bet type only available on US odds');
    } else if (type === BET_TYPE.DOUBLE_STREET) {
      throw new Error('Not yet supported');
    } else if (type === BET_TYPE.CORNER) {
      throw new Error('Not yet supported');
    } else if (type === BET_TYPE.STREET) {
      throw new Error('Not yet supported');
    } else if (type === BET_TYPE.SPLIT) {
      throw new Error('Not yet supported');
    } else if (type === BET_TYPE.STRAIGHT) {
      if (!STRAIGHT_TYPE.includes(on)) {
        throw new Error('Invalid straight bet type');
      }

      if (on === '00' && this.odds !== GAME_ODDS.US) {
        throw new Error('00 straight bet only available on US odds');
      }
    } else {
      throw new Error('Invalid bet type');
    }
  }
}

class Player {
  constructor({ wallet } = {}) {
    this.wallet = wallet || 2000;
    this.highest = wallet || 2000;
  }
}

// Martingale
(() => {
  const game = new Game({ odds: GAME_ODDS.US });
  const player = new Player();
  let startingBet = 10;
  let bet = startingBet;

  (function repeat() {
    if (player.wallet < bet) {
      console.log('Out of money!');
      console.log('Rolls:', game.rolls);
      console.log('Highest:', player.highest);
      return;
    }

    game.bet(player, BET_TYPE.EVEN, EVEN_TYPE.BLACK, bet);
    const before = player.wallet;
    game.spin();
    const after = player.wallet;
    if (before === after) {
      console.log(`[${after}] Lost ${bet}!`.red);
      bet = bet * 2;
    } else {
      console.log(`[${after}] Won ${after - before}!`.green);
      bet = startingBet;
    }

    setTimeout(repeat, 0);
  })();
})();

// Reverse Martingale
(() => {
  const game = new Game({ odds: GAME_ODDS.US });
  const player = new Player();
  let startingBet = 10;
  let bet = startingBet;
  let streak = 0;
  let maxStreak = 3;

  (function repeat() {
    if (player.wallet < bet) {
      console.log('Out of money!');
      console.log('Rolls:', game.rolls);
      console.log('Highest:', player.highest);
      return;
    }

    game.bet(player, BET_TYPE.EVEN, EVEN_TYPE.BLACK, bet);
    const before = player.wallet;
    game.spin();
    const after = player.wallet;
    if (before === after) {
      console.log(`[${after}] Lost ${bet}!`.red);
      bet = startingBet;
    } else {
      console.log(`[${after}] Won ${after - before}!`.green);
      if (streak < maxStreak) {
        bet = bet * 2;
        streak += 1;
      } else {
        bet = startingBet;
        streak = 0;
      }
    }

    setTimeout(repeat, 0);
  })();
});

// James Bond
(() => {
  const game = new Game({ odds: GAME_ODDS.EU });
  const player = new Player();

  (function repeat() {
    if (player.wallet < 20) {
      console.log('Out of money!');
      console.log('Rolls:', game.rolls);
      console.log('Highest:', player.highest);
      return;
    }

    game.bet(player, BET_TYPE.EVEN, EVEN_TYPE.HIGH, 14);
    game.bet(player, BET_TYPE.STRAIGHT, '0', 1);
    const before = player.wallet;
    game.spin();
    const after = player.wallet;

    if (before === after) {
      console.log(`[${after}] Lost ${15}!`.red);
    } else {
      console.log(`[${after}] Won ${after - before}!`.green);
    }

    setTimeout(repeat, 0);
  })();
});
