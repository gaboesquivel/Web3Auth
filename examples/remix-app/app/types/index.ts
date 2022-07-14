export {};

declare global {
  interface Window {
    Web3auth?: any;
    OpenloginAdapter?: any;
    web3_auth: any;
    web3_auth_provider: any;
  }
}