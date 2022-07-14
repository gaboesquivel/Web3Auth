import { useEffect } from "react";
  

const useWeb3Auth = () => {
  const initWeb3Auth = async () => {
    console.log('🔑 initializing web3auth ...')

    if (!window.Web3auth) return console.error('window.Web3auth namespace not found')
    if (!window.OpenloginAdapter) return console.error('window.OpenloginAdapter namespace not found')
  
    const web3auth = new window.Web3auth.Web3Auth({
      clientId: 'BGg06C3u5cKtQ8pY3sANCcwZe30Ch8qz7xbbd-1RAQsUBPeZThjuG6EH6qeTaBB-VKdii-oeOvp2uemQcHBNxKY',
      chainConfig: { chainNamespace: 'eip155', chainId: '0x3' },
      authMode: 'DAPP',
    })

    const openloginAdapter = new window.OpenloginAdapter.OpenloginAdapter({
      adapterSettings: {
        network: 'testnet',
        clientId: 'BG5FqoNkE0W0XJZ05s-I9RWCULJmtLg8J9y2eMUJv3kLouvay7z_XBzB5PysoUMBu4LD7aDzIqVKZktKhVtn6mA',
        uxMode: 'popup',
      },
    })

    web3auth.configureAdapter(openloginAdapter)

    // make it globally accessible 
    window.web3_auth = web3auth

    await window.web3_auth.init()

    console.log('🔑 web3auth initialized!')
  }

  const login = async () => {
    console.log('🔑 web3auth login')
    window.web3_auth_provider  = await window.web3_auth.connect();
    console.log('🔑 web3auth logged in!', window.web3_auth_provider)
  }

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
