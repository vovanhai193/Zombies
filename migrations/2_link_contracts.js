var SafeMath = artifacts.require('SafeMath')
var SafeMath32 = artifacts.require('SafeMath32')
var SafeMath16 = artifacts.require('SafeMath16')
var ZombieFactory = artifacts.require('ZombieFactory')

module.exports = function (deployer) {
  deployer.deploy(SafeMath)
  deployer.deploy(SafeMath32)
  deployer.deploy(SafeMath16)
  deployer.link(SafeMath, ZombieFactory)
  deployer.link(SafeMath32, ZombieFactory)
  deployer.link(SafeMath16, ZombieFactory)
}
