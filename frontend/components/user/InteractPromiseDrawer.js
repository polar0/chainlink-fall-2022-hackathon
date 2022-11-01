import {
  getPartiesApprovedStatus,
  getPartiesTwitterVerifiedStatus,
} from '../../systems/promisePartiesData';
import { getVerificationDiv } from '../../systems/promisePartiesData';
import { promiseStatus } from '../../systems/promiseStatus';
import { Button } from 'antd';
import { useAccount, useProvider, useNetwork } from 'wagmi';
import { useEffect, useState } from 'react';
import PromiseTable from '../PromiseTable';
import RowPromiseApproval from './RowPromiseApproval';
import RowPromiseLock from './RowPromiseLock';

export default function InteractPromiseDrawer({ contractAttributes }) {
  const [isPromiseLocked, setIsPromiseLocked] = useState(null);
  const [addressToApprovedStatus, setAddressToApprovedStatus] = useState([]);
  const [addressToTwitterVerifiedStatus, setAddressToTwitterVerifiedStatus] =
    useState([]);
  const [allPartiesApproved, setAllPartiesApproved] = useState(false);
  const [interactingUser, setInteractingUser] = useState({});
  const provider = useProvider();
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();

  const { contractAddress, partyAddresses, partyTwitterHandles } =
    contractAttributes;

  const getPromiseStatus = async () => {
    const isLocked = await promiseStatus().getIsPromiseLocked(
      contractAddress,
      provider,
    );
    setIsPromiseLocked(isLocked);
  };

  const gatherPartiesData = async () => {
    getPromiseStatus();

    const partiesApprovedStatus = await getPartiesApprovedStatus(
      contractAddress,
      partyAddresses,
      provider,
    );
    setAddressToApprovedStatus(partiesApprovedStatus);

    const partiesTwitterVerifiedStatus = await getPartiesTwitterVerifiedStatus(
      partyTwitterHandles,
      partyAddresses,
      provider,
      chain,
    );
    setAddressToTwitterVerifiedStatus(partiesTwitterVerifiedStatus);
  };

  useEffect(() => {
    gatherPartiesData();
  }, []);

  useEffect(() => {
    // Display data for the interacting user
    const interactingUser = {
      address: userAddress,
      promiseApprovedStatus: addressToApprovedStatus[userAddress.toLowerCase()],
      twitterVerifiedStatus:
        addressToTwitterVerifiedStatus[userAddress.toLowerCase()],
      twitterVerifiedDiv: getVerificationDiv(
        addressToTwitterVerifiedStatus[userAddress.toLowerCase()],
        'Your Twitter account is not verified',
      ),
    };
    setInteractingUser(interactingUser);

    // Go through all the parties to know if everyone has approved
    const allApproved = Object.values(addressToApprovedStatus).every(
      (partyApprovedStatus) => partyApprovedStatus === true,
    );
    setAllPartiesApproved(allApproved);

    // Contract data, once fetched, will update the table
  }, [addressToApprovedStatus, addressToTwitterVerifiedStatus]);

  return (
    <div className='promise-drawer'>
      <PromiseTable
        contractAttributes={contractAttributes}
        isPromiseLocked={isPromiseLocked}
        addressToApprovedStatus={addressToApprovedStatus}
        addressToTwitterVerifiedStatus={addressToTwitterVerifiedStatus}
      />

      <div className='drawer-item interaction'>
        <RowPromiseApproval
          key='approval'
          interactingUser={interactingUser}
          contractAddress={contractAddress}
          userAddress={userAddress}
          addressToApprovedStatus={addressToApprovedStatus}
          gatherPartiesData={gatherPartiesData}
        />

        <div className='twitter-verify-status'>
          {interactingUser.twitterVerifiedDiv}
        </div>
        {interactingUser.twitterVerifiedStatus ? (
          <div className='verified'>Twitter verified</div>
        ) : (
          <div className='twitter-verify-interact'>
            <Button type='primary'>Verify Twitter</Button>
          </div>
        )}

        <RowPromiseLock
          key='lock'
          interactingUser={interactingUser}
          contractAddress={contractAddress}
          userAddress={userAddress}
          isPromiseLocked={isPromiseLocked}
          addressToApprovedStatus={addressToApprovedStatus}
          getPromiseStatus={getPromiseStatus}
          allPartiesApproved={allPartiesApproved}
        />
      </div>
    </div>
  );
}

// Move pagination to the bottom in user promises drawer
