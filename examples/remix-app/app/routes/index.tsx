import { useEffect } from "react";

const clientId =
  'BGg06C3u5cKtQ8pY3sANCcwZe30Ch8qz7xbbd-1RAQsUBPeZThjuG6EH6qeTaBB-VKdii-oeOvp2uemQcHBNxKY'

  // ⭐️ subscribe to lifecycle events emitted by web3auth
const subscribeAuthEvents = (web3auth: any) => {
  web3auth.on(ADAPTER_EVENTS.CONNECTED, (data: CONNECTED_EVENT_DATA) => {
    console.log("connected to wallet", data);
    // web3auth.provider will be available here after user is connected
  });
  web3auth.on(ADAPTER_EVENTS.CONNECTING, () => {
    console.log("connecting");
  });
  web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
    console.log("disconnected");
  });
  web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
    console.log("error", error);
  });
  web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
    console.log("error", error);
  });
  // emitted when modal visibility changes.
  web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (isVisible) => {
    console.log("is modal visible", isVisible);
  });
};

const useWeb3Auth = () => {
  const initWeb3Auth = async () => {
    console.log('🔑 initializing web3auth ...')

    if (!window.Web3auth) return console.error('window.Web3auth namespace not found')
    if (!window.OpenloginAdapter) return console.error('window.OpenloginAdapter namespace not found')
  
    const web3auth = new window.Web3auth.Web3Auth({
      clientId,
      chainConfig: { chainNamespace: 'eip155', chainId: '0x3' },
      authMode: 'DAPP',
    })

    const openloginAdapter = new window.OpenloginAdapter.OpenloginAdapter({
      adapterSettings: {
        network: 'testnet',
        clientId,
        uxMode: 'popup',
      },
    })

    web3auth.configureAdapter(openloginAdapter)

    // web3auth.initModal()

    window.web3_auth = web3auth

    console.log('🔑 web3auth initialized!')
  }

  const login = () => {}

  useEffect(()=> {
    initWeb3Auth()
  }, [])

  return { login }
}

export default function Index() {
  const { login } = useWeb3Auth()

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix with Web3Auth</h1>
      <button onClick={() => login()}>Click me to login</button>
    </div>
  );
}
