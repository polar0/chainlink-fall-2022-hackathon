import PromiseTable from '../PromiseTable';
import { promiseStatus } from '../../systems/promiseStatus';
import { getPartiesApprovedStatus } from '../../systems/promisePartiesData';
import { displayPdf } from '../../systems/displayPdf';
import { useProvider } from 'wagmi';
import { useEffect, useState } from 'react';

export default function PromisePanel({ contractAttributes }) {
  const [isPromiseLocked, setIsPromiseLocked] = useState(null);
  const [addressToApprovedStatus, setAddressToApprovedStatus] = useState([]);
  const provider = useProvider();

  const { contractAddress, partyAddresses } = contractAttributes;

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

    // const partiesTwitterVerifiedStatus = await getPartiesTwitterVerifiedStatus();
    // setPartiesTwitterVerifiedStatus(partiesTwitterVerifiedStatus);
  };

  useEffect(() => {
    gatherPartiesData();
  }, []);

  return (
    <div className='promise-card'>
      <PromiseTable
        contractAttributes={contractAttributes}
        isPromiseLocked={isPromiseLocked}
        addressToApprovedStatus={addressToApprovedStatus}
      />
      <div key='viewer' className='card-item pdf-viewer'>
        {/* {displayPdf(pdfUri)} */}
        {displayPdf(
          'ipfs:///QmR7GSQM93Cx5eAg6a6yRzNde1FQv7uL6X1o4k7zrJa3LX/ipfs.draft3.pdf',
        )}
      </div>
    </div>
  );
}
