import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import * as anchor from '@project-serum/anchor';

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletDialogButton } from '@solana/wallet-adapter-material-ui';
import { GatewayProvider } from '@civic/solana-gateway-react';
import { CTAButton, MintButton } from './MintButton';
import capsule from './capsule.png';
import videoBg from './Untitled_design_6.mp4';
import cityBg from './bg_main.gif';
import sewerBg from './bg.jpeg';
import discord from './discord.svg';
import twitter from './twitter.svg';
import magiceden from './magiceden.svg';

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
  CANDY_MACHINE_PROGRAM,
} from './candy-machine';

import { AlertState, getAtaForMint } from './utils';
import { ProgressBar } from './ProgressBar/ProgressBar';
import * as Styled from './Home.styled';

const ConnectButton = styled(WalletDialogButton)``;

const MintContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & ${CTAButton} {
    background-color: rgba(0, 0, 0, 0.65);
    box-shadow: none;
    font-size: 20px;
    font-family: 'Audiowide';
    color: #54cb52;
    border-radius: 0;
    padding: 14px 23px;
    line-height: 1;
    border-radius: 8px;

    &:hover {
      box-shadow: none;
      background: #000;
    }
  }

  & ${ConnectButton} {
    all: unset;
    font-family: inherit;
    background-color: rgba(0, 0, 0, 0.65);
    color: #54cb52;
    font-size: 20px;
    cursor: pointer;
    padding: 10px;
    box-shadow: none;
    border-radius: 8px;
    padding: 14px 23px;
    line-height: 1;

    transition: all 0.2s ease-in-out;

    &:hover {
      // text-shadow: 0 0 4px #fff, 0 0 6px #fff, 0 0 8px #5bff57, 0 0 20px #5bff57,
      //   0 0 30px #5bff57, 0 0 15px #5bff57, 0 0 60px #5bff57;
      background: #000;

      // box-shadow: 1px 1px 5px 1px #0f1e0f;
      box-shadow: none;
      // animation: flicker 1s linear 3;
    }

    &:active {
      // text-shadow: 0 0 4px #fff, 0 0 6px #fff, 0 0 8px #5bff57, 0 0 20px #5bff57,
      //   0 0 30px #5bff57, 0 0 15px #5bff57, 0 0 60px #5bff57;
      background: #000;

      box-shadow: 1px 1px 5px 1px #0f1e0f;
      box-shadow: none;
      // animation: flicker 1s linear 3;
    }

    @keyframes flicker {
      0%,
      19.999%,
      22%,
      62.999%,
      64%,
      64.999%,
      70%,
      100% {
        opacity: 0.99;
      }
      20%,
      21.999%,
      63%,
      63.999%,
      65%,
      69.999% {
        opacity: 0.1;
      }
    }
  }
`;

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const Home = (props: HomeProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    // ref.current.playbackRate = 0.1;
  }, []);
  const [balance, setBalance] = useState<number>();
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  });

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const rpcUrl = props.rpcHost;

  const refreshCandyMachineState = () => {
    (async () => {
      console.log('refresh cm');
      if (!wallet) return;

      const cndy = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      console.log(cndy);
      setCandyMachine(cndy);

      setItemsAvailable(cndy.state.itemsAvailable);
      setItemsRemaining(cndy.state.itemsRemaining);
      setItemsRedeemed(cndy.state.itemsRedeemed);

      // fetch whitelist token balance
      console.log(cndy.state.whitelistMintSettings);
      if (cndy.state.whitelistMintSettings) {
        setWhitelistEnabled(true);
        let balance = 0;
        try {
          const tokenBalance = await props.connection.getTokenAccountBalance(
            (
              await getAtaForMint(
                cndy.state.whitelistMintSettings.mint,
                wallet.publicKey
              )
            )[0]
          );

          balance = tokenBalance?.value?.uiAmount || 0;
        } catch (e) {
          console.error(e);
          balance = 0;
        }

        setWhitelistTokenBalance(balance);
      } else {
        setWhitelistEnabled(false);
      }
    })();
  };

  const onMint = async () => {
    try {
      setIsMinting(true);
      document.getElementById('#identity')?.click();
      if (wallet && candyMachine?.program && wallet.publicKey) {
        const mintTxId = (
          await mintOneToken(candyMachine, wallet.publicKey)
        )[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            'singleGossip',
            true
          );
        }

        if (!status?.err) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          });
        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || 'Minting failed! Please try again!';
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction Timeout! Please try again.';
        } else if (error.message.indexOf('0x138')) {
        } else if (error.message.indexOf('0x137')) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error',
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main>
      <Styled.Wrapper>
        <Styled.TitleContainer>
          <Styled.Links>
            <Styled.Link
              href='https://discord.gg/dvYfNRfxET'
              className='external__link'
              target='_blank'
            >
              <Styled.LinkImage className='external__image' src={discord} />
            </Styled.Link>
            <Styled.Link
              className='external__link'
              href='https://twitter.com/neondotgame'
              target='_blank'
            >
              <Styled.LinkImage src={twitter} className='external__image' />
            </Styled.Link>
          </Styled.Links>
        </Styled.TitleContainer>
        <Styled.Title>Neon Game Mint</Styled.Title>
        <Styled.Overview>
          <Styled.NFTContainer>
            <Styled.NFTImage src={capsule} />
            <Styled.NFTTitle>Capsule</Styled.NFTTitle>
            <Styled.NFTPrice>500,000 $NEON</Styled.NFTPrice>
          </Styled.NFTContainer>
          <Styled.Stats>
            {wallet ? (
              <>
                <Styled.ProgressBarContainer>
                  <ProgressBar
                    redeemedAmount={itemsRedeemed}
                    availableAmount={itemsAvailable}
                  />
                </Styled.ProgressBarContainer>
                <Styled.Redeemed>Redeemed</Styled.Redeemed>
              </>
            ) : (
              <Styled.Redeemed>Redeemed: ? / ?</Styled.Redeemed>
            )}

            {/* {wallet && <p>Remaining: {itemsRemaining}</p>} */}

            {/* {wallet && whitelistEnabled && (
            <p>Whitelist token balance: {whitelistTokenBalance}</p>
          )} */}
          </Styled.Stats>
        </Styled.Overview>
        <MintContainer>
          {!wallet ? (
            <ConnectButton disableRipple>CONNECT WALLET</ConnectButton>
          ) : candyMachine?.state.gatekeeper &&
            wallet.publicKey &&
            wallet.signTransaction ? (
            <GatewayProvider
              wallet={{
                publicKey:
                  wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
                //@ts-ignore
                signTransaction: wallet.signTransaction,
              }}
              // // Replace with following when added
              // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
              gatekeeperNetwork={
                candyMachine?.state?.gatekeeper?.gatekeeperNetwork
              } // This is the ignite (captcha) network
              /// Don't need this for mainnet
              clusterUrl={rpcUrl}
              options={{ autoShowModal: false }}
            >
              <MintButton
                candyMachine={candyMachine}
                isMinting={isMinting}
                onMint={onMint}
              />
            </GatewayProvider>
          ) : (
            <>
              <MintButton
                candyMachine={candyMachine}
                isMinting={isMinting}
                onMint={onMint}
              />
            </>
          )}
        </MintContainer>
      </Styled.Wrapper>

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Home;
