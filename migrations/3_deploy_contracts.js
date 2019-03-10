var ZombieFactory = artifacts.require('ZombieFactory');
var ZombieFeeding = artifacts.require('ZombieFeeding');
var ZombieHelper = artifacts.require('ZombieHelper');
var ZombieAttack = artifacts.require('ZombieAttack');
var ZombieOwnership = artifacts.require('ZombieOwnership');

module.exports = function(deployer) {
  deployer.deploy(ZombieFactory);
  deployer.deploy(ZombieFeeding);
  deployer.deploy(ZombieHelper);
  deployer.deploy(ZombieAttack);
  deployer.deploy(ZombieOwnership);
};
