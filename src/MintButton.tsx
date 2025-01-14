import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { CandyMachine } from './candy-machine';
import { CircularProgress } from '@material-ui/core';
import { GatewayStatus, useGateway } from '@civic/solana-gateway-react';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { toDate } from './utils';
import { Spinner } from './Spinner/Spinner';

//Custom cursor to follow cursor
// const cursor = document.querySelector('.cursor');

// document.addEventListener('mousemove', (e) => {
//   if (!cursor) {
//     return;
//   }
//   cursor.setAttribute(
//     'style',
//     'top: ' + (e.pageY - 15) + 'px; left: ' + (e.pageX - 20) + 'px;'
//   );
// });

// //Add on click pulse effect
// function clickEffect(e: any) {
//   var effect = document.createElement('div');
//   effect.className = 'cursoreffect';
//   effect.setAttribute(
//     'style',
//     'top: ' + (e.pageY - 16) + 'px; left: ' + (e.pageX - 21) + 'px;'
//   );
//   document.body.appendChild(effect);
//   effect.addEventListener('animationend', function () {
//     if (!effect.parentElement) {
//       return;
//     }
//     effect.parentElement.removeChild(effect);
//   });
// }
// document.addEventListener('mousedown', clickEffect);

export const CTAButton = styled(Button)`
  background: white;
  font-weight: bold !important;
  box-shadow: none;
  font-size: 20px;
  font-family: 'Audiowide';
  color: #54cb52 !important;
  border-radius: 0;
  padding: 7px 23px;
`; // add your styles here

export const CounterText = styled.span``; // add your styles here

export const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
}: {
  onMint: () => Promise<void>;
  candyMachine: CandyMachine | undefined;
  isMinting: boolean;
}) => {
  const { requestGatewayToken, gatewayStatus } = useGateway();
  const [clicked, setClicked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isActive, setIsActive] = useState(false); // true when countdown completes

  useEffect(() => {
    setIsVerifying(false);
    if (
      gatewayStatus === GatewayStatus.COLLECTING_USER_INFORMATION &&
      clicked
    ) {
      // when user approves wallet verification txn
      setIsVerifying(true);
    } else if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
      console.log('Verified human, now minting...');
      onMint();
      setClicked(false);
    }
  }, [gatewayStatus, clicked, setClicked, onMint]);

  return (
    <CTAButton
      disableRipple
      disabled={
        candyMachine?.state.isSoldOut || isMinting || !isActive || isVerifying
      }
      onClick={async () => {
        if (
          isActive &&
          candyMachine?.state.gatekeeper &&
          gatewayStatus !== GatewayStatus.ACTIVE
        ) {
          console.log('Requesting gateway token');
          setClicked(true);
          await requestGatewayToken();
        } else {
          console.log('Minting...');
          await onMint();
        }
      }}
      variant='contained'
    >
      {!candyMachine ? (
        'CONNECTING...'
      ) : candyMachine?.state.isSoldOut ? (
        'SOLD OUT'
      ) : isActive ? (
        isVerifying ? (
          'VERIFYING...'
        ) : isMinting ? (
          <Spinner />
        ) : (
          'MINT'
        )
      ) : candyMachine?.state.goLiveDate ? (
        <>
          {/* mint starts in */}
          <Countdown
            date={toDate(candyMachine?.state.goLiveDate)}
            onMount={({ completed }) => completed && setIsActive(true)}
            onComplete={() => {
              setIsActive(true);
            }}
            renderer={renderCounter}
          />
        </>
      ) : (
        'UNAVAILABLE'
      )}
    </CTAButton>
  );
};

const renderCounter = ({ days, hours, minutes, seconds }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};
