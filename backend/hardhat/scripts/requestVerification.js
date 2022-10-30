const { ethers } = require('hardhat');
const { fundContract } = require('./fundContract');
const { VERIFY_TWITTER_ADDRESS_MUMBAI } = require('../helper-hardhat-config');

const USERNAME = 'TwitterDev';

const requestVerification = async () => {
  const verifyTwitter = await ethers.getContractAt(
    'VerifyTwitter',
    VERIFY_TWITTER_ADDRESS_MUMBAI,
  );

  // If the contract is not funded with LINK, fund it
  await fundContract();

  console.log('Requesting verification...');
  const tx = await verifyTwitter.requestVerification(USERNAME);
  const txReceipt = await tx.wait(1);

  console.log('Transaction receipt events: ', txReceipt.events[4]);
};

requestVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
