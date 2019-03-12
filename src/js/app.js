var Web3 = require("web3");
var cryptoZombies;
var userAccount;

function startApp() {
  var cryptoZombiesAddress = "0xF972CC4F951D1B10FA88Df2E430Fa1839371Aa77";
  cryptoZombies = new web3js.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);

  var accountInterval = setInterval(function() {
    // Check if account has changed
    if (web3.eth.accounts[0] !== userAccount) {
      userAccount = web3.eth.accounts[0];
      // Call a function to update the UI with the new account
      getZombiesByOwner(userAccount)
      .then(displayZombies);
    }
  }, 100);

  // Use `filter` to only fire this code when `_to` equals `userAccount`
  cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
  .on("data", function(event) {
    let data = event.returnValues;
    getZombiesByOwner(userAccount)
    .then(displayZombies);
    // The current user just received a zombie!
    // Do something here to update the UI to show it
  }).on("error", console.error);// Start here
}

function displayZombies(ids) {
  $("#zombies").empty();
  for (id of ids) {
    // Look up zombie details from our contract. Returns a `zombie` object
    getZombieDetails(id)
    .then(function(zombie) {
      // Using ES6's "template literals" to inject variables into the HTML.
      // Append each one to our #zombies div
      $("#zombies").append(`<div class="zombie">
        <ul>
          <li>Name: ${zombie.name}</li>
          <li>DNA: ${zombie.dna}</li>
          <li>Level: ${zombie.level}</li>
          <li>Wins: ${zombie.winCount}</li>
          <li>Losses: ${zombie.lossCount}</li>
          <li>Ready Time: ${zombie.readyTime}</li>
        </ul>
      </div>`);
    });
  }
}

function createRandomZombie(name) {
  // This is going to take a while, so update the UI to let the user know
  // the transaction has been sent
  $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");
  // Send the tx to our contract:
  return cryptoZombies.methods.createRandomZombie(name)
  .send({ from: userAccount })
  .on("receipt", function(receipt) {
    $("#txStatus").text("Successfully created " + name + "!");
    // Transaction was accepted into the blockchain, let's redraw the UI
    getZombiesByOwner(userAccount).then(displayZombies);
  })
  .on("error", function(error) {
    // Do something to alert the user their transaction has failed
    $("#txStatus").text(error);
  });
}

function feedOnKitty(zombieId, kittyId) {
  $("#txStatus").text("Eating a kitty. This may take a while...");
  return cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
  .send({ from: userAccount })
  .on("receipt", function(receipt) {
    $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
    getZombiesByOwner(userAccount).then(displayZombies);
  })
  .on("error", function(error) {
    $("#txStatus").text(error);
  });
}

function levelUp(zombieId) {
  $("#txStatus").text("Leveling up your zombie...");
  return cryptoZombies.methods.levelUp(zombieId)
  .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
  .on("receipt", function(receipt) {
    $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");
  })
  .on("error", function(error) {
    $("#txStatus").text(error);
  });
}

function getZombieDetails(id) {
  return cryptoZombies.methods.zombies(id).call()
}

function zombieToOwner(id) {
  return cryptoZombies.methods.zombieToOwner(id).call()
}

function getZombiesByOwner(owner) {
  return cryptoZombies.methods.getZombiesByOwner(owner).call()
}

window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
  } else {
    // Handle the case where the user doesn't have Metamask installed
    // Probably show them a message prompting them to install Metamask
  }

  // Now you can start your app & access web3 freely:
  startApp();

  $('#createRandomZombie').on('click',function(){
    createRandomZombie("RandomZombie" + Math.floor((Math.random() * 666) + 1));
  });
});
