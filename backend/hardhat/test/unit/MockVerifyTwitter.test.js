const { assert, expect } = require('chai');
const {
  developmentChains,
  LINK_TOKEN_MUMBAI,
  OPERATOR_MUMBAI,
  ORACLE_PAYMENT,
} = require('../../helper-hardhat-config');
const { deployments, network, ethers } = require('hardhat');

const REQUEST_ID = ethers.utils.formatBytes32String('0x1234567890');
const TEST_USERNAME = 'alice';
const TEST_USERNAME_2 = 'john123';

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('MockVerifyTwitter unit tests', function() {
      let deployer;
      let user;
      let mockVerifyTwitterDeploy;
      let mockVerifyTwitter;
      let mockPromiseFactory;

      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        user = accounts[1];
        await deployments.fixture(['main', 'mocks']);
        mockVerifyTwitterDeploy = await ethers.getContract('MockVerifyTwitter');
        mockVerifyTwitter = mockVerifyTwitterDeploy.connect(deployer);
        mockPromiseFactory = await ethers.getContract(
          'MockPromiseFactory',
          deployer,
        );
        await mockPromiseFactory.setTwitterVerifier(mockVerifyTwitter.address);
      });

      describe('constructor', function() {
        it('Should initialize the contract correctly', async () => {
          const mockPromiseFactoryAddress = await mockVerifyTwitter.getPromiseFactoryContract();
          // ChainlinkClientTestHelper provides these 2 functions for testing
          const linkAddress = await mockVerifyTwitter.publicChainlinkToken();
          const oracleAddress = await mockVerifyTwitter.publicOracleAddress();
          // It is a constant not initialized in the constructor, so not really necessary to test
          const oraclePayment = await mockVerifyTwitter.getOraclePayment();

          assert.equal(mockPromiseFactoryAddress, mockPromiseFactory.address);
          assert.equal(linkAddress, LINK_TOKEN_MUMBAI);
          assert.equal(oracleAddress, OPERATOR_MUMBAI);
          assert.equal(oraclePayment.toString(), ORACLE_PAYMENT);

          // Check that ConfirmedOwner is initialized correctly
          const tx = await mockVerifyTwitter.modifierOnlyOwner();
          const txReceipt = await tx.wait(1);

          assert.equal(txReceipt.events[0].eventSignature, 'Here()');
        });
      });

      describe('requestVerification', function() {
        it('Should emit an event with the correct requestId and the username', async () => {
          await expect(mockVerifyTwitter.requestVerification(TEST_USERNAME))
            .to.emit(mockVerifyTwitter, 'VerificationRequested')
            .withArgs(REQUEST_ID, TEST_USERNAME);
        });
      });

      // In this test, the deployer is the one creating the requests, see:
      // publicAddExternalRequest(msg.sender, requestId)
      // This line, only present in the mock contract, associates the request id to the deployer address
      // Normally, it would be associated with the oracle (operator) address,
      // which prevents anyone else (including the deployer) from calling fulfillVerification
      describe('fulfillVerification', function() {
        beforeEach(async () => {
          // Add a new request to the mapping
          await mockVerifyTwitter.requestVerification(TEST_USERNAME);
        });
        it('Should revert if called by anyone other than the oracle', async () => {
          mockVerifyTwitter = mockVerifyTwitter.connect(user);

          // Try to fulfill the request
          await expect(
            mockVerifyTwitter.fulfillVerification(
              REQUEST_ID,
              TEST_USERNAME,
              true,
              user.address,
            ),
          ).to.be.revertedWith('Source must be the oracle of the request');
        });

        it('Should add a verified user to the mapping in PromiseFactory and emit an event', async () => {
          await expect(
            mockVerifyTwitter.fulfillVerification(
              REQUEST_ID,
              TEST_USERNAME,
              true,
              user.address,
            ),
          )
            .to.emit(mockVerifyTwitter, 'VerificationSuccessful')
            .withArgs(REQUEST_ID, TEST_USERNAME, user.address, true);

          const isVerifiedHandle = await mockPromiseFactory.getTwitterVerifiedHandle(
            user.address,
          );

          assert.equal(isVerifiedHandle, TEST_USERNAME);
        });

        it('Should not add a user who failed verification to the mapping in PromiseFactory and emit a failed event', async () => {
          await expect(
            mockVerifyTwitter.fulfillVerification(
              REQUEST_ID,
              TEST_USERNAME,
              false,
              user.address,
            ),
          )
            .to.emit(mockVerifyTwitter, 'VerificationFailed')
            .withArgs(REQUEST_ID, TEST_USERNAME);

          const isVerifiedHandle = await mockPromiseFactory.getTwitterVerifiedHandle(
            user.address,
          );

          assert.equal(isVerifiedHandle, '');
        });

        it('Should allow the same user to request verification again', async () => {
          await mockVerifyTwitter.fulfillVerification(
            REQUEST_ID,
            TEST_USERNAME,
            true,
            user.address,
          );

          // Request verification again
          const tx = await mockVerifyTwitter.requestVerification(
            TEST_USERNAME_2,
          );
          const txReceipt = await tx.wait(1);

          assert.equal(txReceipt.events[0].args.requestId, REQUEST_ID);

          // Fulfill the request again
          await mockVerifyTwitter.fulfillVerification(
            REQUEST_ID,
            TEST_USERNAME_2,
            true,
            user.address,
          );

          const isVerifiedHandle = await mockPromiseFactory.getTwitterVerifiedHandle(
            user.address,
          );

          assert.equal(isVerifiedHandle[0], TEST_USERNAME);
          assert.equal(isVerifiedHandle[1], TEST_USERNAME_2);
        });

        it('Should allow the user to verify the same username again but not add it again to the mapping', async () => {
          await mockVerifyTwitter.fulfillVerification(
            REQUEST_ID,
            TEST_USERNAME,
            true,
            user.address,
          );

          // Request verification again
          const tx = await mockVerifyTwitter.requestVerification(TEST_USERNAME);
          const txReceipt = await tx.wait(1);

          assert.equal(txReceipt.events[0].args.requestId, REQUEST_ID);

          // Fulfill the request again
          await mockVerifyTwitter.fulfillVerification(
            REQUEST_ID,
            TEST_USERNAME,
            true,
            user.address,
          );

          const isVerifiedHandle = await mockPromiseFactory.getTwitterVerifiedHandle(
            user.address,
          );

          assert.equal(isVerifiedHandle[0], TEST_USERNAME);
          assert.equal(isVerifiedHandle[1], undefined);
        });
      });

      describe('utils', function() {
        it('addressToString', async () => {
          const address = '0x0000000000000000000000000000000000000000';
          const addressString = await mockVerifyTwitter.testAddressToString(
            address,
          );

          assert.equal(
            addressString,
            '0x0000000000000000000000000000000000000000',
          );
        });
      });
    });
