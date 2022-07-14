import { useEffect, useState } from "react";
  

const useWeb3Auth = () => {
  const [web3_auth, setWeb3Auth] = useState<any>(null)
  const [web3_auth_provider, setWeb3AuthProvider] = useState<any>(null)

  const initWeb3Auth = async () => {
    console.log('🔑 initializing web3auth ...')

    if (!window.Web3auth) return console.error('window.Web3auth namespace not found')
    if (!window.OpenloginAdapter) return console.error('window.OpenloginAdapter namespace not found')
  
    const web3_auth = new window.Web3auth.Web3Auth({
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

    web3_auth.configureAdapter(openloginAdapter)

    await web3_auth.init()

    setWeb3Auth(web3_auth)

    console.log('🔑 web3auth initialized!')
  }

  const login = async () => {
    console.log('🔑 web3auth login')
    if(!web3_auth) return console.log('web3_auth not set')
    const web3_auth_provider  = await web3_auth.connect();
    setWeb3AuthProvider(web3_auth_provider)
    console.log('🔑 web3auth logged in!', web3_auth_provider)
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
