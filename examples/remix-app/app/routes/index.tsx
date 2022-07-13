import { useEffect } from "react";

const useWeb3Auth = () => {
  const initWeb3Auth = async () => {
    const { Web3Auth } = await import('@web3auth/web3auth')
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
