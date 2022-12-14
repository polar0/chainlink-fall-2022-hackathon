const assert = require('chai').assert;
const createRequest = require('../index.js').createRequest;
const {
  PROMISE_ADDRESS,
  USER_ADDRESS,
  IPFS_CID,
  ARWEAVE_ID,
  ENCRYPTED_PROOF_VALID,
  ENCRYPTED_PROOF_VALID_NO_ARWEAVE,
  ENCRYPTED_PROOF_INVALID,
} = require('./mocks/mock-data.js');

describe('createRequest', () => {
  const jobID = '1';

  /**
   * SUCCESSFUL CALLS
   */

  context('Successful calls', () => {
    // Requests to the mock data to get fake tweets for the signature check
    const requests = [
      {
        name: 'id not supplied',
        testData: {
          data: {
            promiseAddress: PROMISE_ADDRESS,
            userAddress: USER_ADDRESS,
            ipfsCid: IPFS_CID,
            arweaveId: ARWEAVE_ID,
            encryptedProof: ENCRYPTED_PROOF_VALID,
          },
        },
      },
      {
        name: 'empty id',
        testData: {
          id: '',
          data: {
            promiseAddress: PROMISE_ADDRESS,
            userAddress: USER_ADDRESS,
            ipfsCid: IPFS_CID,
            arweaveId: ARWEAVE_ID,
            encryptedProof: ENCRYPTED_PROOF_VALID,
          },
        },
      },
      {
        name: 'regular call',
        testData: {
          id: jobID,
          data: {
            promiseAddress: PROMISE_ADDRESS,
            userAddress: USER_ADDRESS,
            ipfsCid: IPFS_CID,
            arweaveId: ARWEAVE_ID,
            encryptedProof: ENCRYPTED_PROOF_VALID,
          },
        },
      },
    ];

    requests.forEach((req) => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200);
          assert.equal(data.jobRunID, req.name === 'empty id' ? '' : jobID);
          assert.equal(data.data.result, 3);
          assert.equal(data.data.promiseAddress, PROMISE_ADDRESS);
          done();
        });
      });
    });

    // If the user did not upload the file to Arweave, the arweaveId will be an empty string
    it('returns a result of 2 if arweaveId is empty', (done) => {
      const req = {
        id: jobID,
        data: {
          promiseAddress: PROMISE_ADDRESS,
          userAddress: USER_ADDRESS,
          ipfsCid: IPFS_CID,
          arweaveId: '',
          encryptedProof: ENCRYPTED_PROOF_VALID_NO_ARWEAVE,
        },
      };

      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200);
        assert.equal(data.jobRunID, jobID);
        assert.equal(data.data.result, 2);
        assert.equal(data.data.promiseAddress, PROMISE_ADDRESS);
        done();
      });
    });

    // If the user did not use the website to upload the files, the encryptedProof won't be valid
    it('returns a result of 1 if the proof is invalid', (done) => {
      const req = {
        id: jobID,
        data: {
          promiseAddress: PROMISE_ADDRESS,
          userAddress: USER_ADDRESS,
          ipfsCid: IPFS_CID,
          arweaveId: ARWEAVE_ID,
          encryptedProof: ENCRYPTED_PROOF_INVALID,
        },
      };

      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200);
        assert.equal(data.jobRunID, jobID);
        assert.equal(data.data.result, 1);
        assert.equal(data.data.promiseAddress, PROMISE_ADDRESS);
        done();
      });
    });
  });

  /**
   * ERROR CALLS
   */

  context('Error calls', () => {
    const requests = [
      {
        name: 'no data supplied',
        testData: { id: jobID, data: {} },
        expectedError: 'Required parameter not supplied: promiseAddress',
      },
      {
        name: 'no promiseAddress supplied',
        testData: {
          id: jobID,
          data: {
            userAddress: USER_ADDRESS,
            ipfsCid: IPFS_CID,
            arweaveId: ARWEAVE_ID,
            encryptedProof: ENCRYPTED_PROOF_VALID,
          },
        },
        expectedError: 'Required parameter not supplied: promiseAddress',
      },
      {
        name: 'no userAddress supplied',
        testData: {
          id: jobID,
          data: {
            promiseAddress: PROMISE_ADDRESS,
            ipfsCid: IPFS_CID,
            arweaveId: ARWEAVE_ID,
            encryptedProof: ENCRYPTED_PROOF_VALID,
          },
        },
        expectedError: 'Required parameter not supplied: userAddress',
      },
      {
        name: 'no ipfsCid supplied',
        testData: {
          id: jobID,
          data: {
            promiseAddress: PROMISE_ADDRESS,
            userAddress: USER_ADDRESS,
            arweaveId: ARWEAVE_ID,
            encryptedProof: ENCRYPTED_PROOF_VALID,
          },
        },
        expectedError: 'Required parameter not supplied: ipfsCid',
      },
      {
        name: 'no arweaveId supplied',
        testData: {
          id: jobID,
          data: {
            promiseAddress: PROMISE_ADDRESS,
            userAddress: USER_ADDRESS,
            ipfsCid: IPFS_CID,
            encryptedProof: ENCRYPTED_PROOF_VALID,
          },
        },
        expectedError: 'Required parameter not supplied: arweaveId',
      },
      {
        name: 'no encryptedProof supplied',
        testData: {
          id: jobID,
          data: {
            promiseAddress: PROMISE_ADDRESS,
            userAddress: USER_ADDRESS,
            ipfsCid: IPFS_CID,
            arweaveId: ARWEAVE_ID,
          },
        },
        expectedError: 'Required parameter not supplied: encryptedProof',
      },
    ];

    requests.forEach((req) => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          console.log('ERROR', data.error.message);
          const errorMessage = data.error.message.message;
          assert.equal(statusCode, 500);
          assert.equal(data.jobRunID, jobID);
          assert.equal(data.status, 'errored');
          assert.include(errorMessage, req.expectedError);
          done();
        });
      });
    });
  });

  /**
   * VALIDATION ERROR CALLS
   */

  context('Validation error calls', () => {
    // An empty body should return a TypeError
    it('empty body', (done) => {
      createRequest({}, (statusCode, data) => {
        assert.equal(statusCode, 500);
        assert.equal(data.jobRunID, jobID);
        assert.equal(data.status, 'errored');
        assert.equal(
          data.error,
          "AdapterError: TypeError: Cannot read properties of undefined (reading 'promiseAddress')",
        );
        done();
      });
    });
  });
});
