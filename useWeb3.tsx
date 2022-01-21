import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState } from "react";
import Web3 from "web3";
import type IWeb3 from "web3";
import Web3Modal from "web3modal";

interface Props {
  network: "mainnet" | "ropsten" | "kovan" | "rinkeby" | "goerli";
  theme: "dark" | "light";
}

const useWeb3 = ({ network = "mainnet", theme = "light" }: Props) => {
  const publicWeb3 = new Web3(
    `https://${network}.infura.io/v3/${process.env.INFURA_ID}`
  );
  const [connected, setConnected] = useState(false);
  const [web3, setWeb3] = useState<IWeb3>(publicWeb3);
  const [account, setAccount] = useState<String>();

  const disconnect = () => {
    setConnected(false);
    setAccount(undefined);
    setWeb3(publicWeb3);
  };

  const connect = async () => {
    try {
      if (typeof window !== "undefined") {
        const web3Modal = new Web3Modal({
          network: network,
          theme: theme,
          cacheProvider: false,
          providerOptions: {
            walletconnect: {
              package: WalletConnectProvider,
              options: {
                infuraId: process.env.INFURA_ID,
              },
            },
          },
        });
        web3Modal.clearCachedProvider();
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3);
        setConnected(true);
      }
    } catch (error) {
      setConnected(false);
      setAccount(undefined);
      console.log(error);
    }
  };
  return { connected, connect, disconnect, web3, account };
};

export default useWeb3;
