import { Transaction } from "@solana/web3.js";
import { createSwappableProxy, providerFromEngine } from "@toruslabs/base-controllers";
import { JRPCEngine, JRPCRequest } from "@toruslabs/openlogin-jrpc";
import { RequestArguments, SafeEventEmitterProvider, WalletInitializationError } from "@web3auth/base";
import { BaseProvider, BaseProviderConfig, BaseProviderState } from "@web3auth/base-provider";
import bs58 from "bs58";

import { SolanaWallet } from "../../interface";
import { createSolanaMiddleware, IProviderHandlers } from "../../solanaRpcMiddlewares";
import { createInjectedProviderProxyMiddleware } from "./injectedProviderProxy";

export interface PhantomWallet extends SolanaWallet {
  isPhantom?: boolean;
  publicKey?: { toBytes(): Uint8Array };
  isConnected: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  _handleDisconnect(...args: unknown[]): unknown;
}

// TODO: Add support for changing chainId
export class PhantomInjectedProvider extends BaseProvider<BaseProviderConfig, BaseProviderState, PhantomWallet> {
  public _providerProxy!: SafeEventEmitterProvider;

  constructor({ config, state }: { config?: BaseProviderConfig; state?: BaseProviderState }) {
    super({ config, state });
    if (!this.config.chainConfig.chainId) throw WalletInitializationError.invalidProviderConfigError("Please provide chainId in chain config");
  }

  public setupProvider(injectedProvider: PhantomWallet): SafeEventEmitterProvider {
    if (!this.state._initialized) throw WalletInitializationError.providerNotReadyError("Provider not initialized");
    const providerHandlers: IProviderHandlers = {
      requestAccounts: async () => {
        return injectedProvider.publicKey ? [bs58.encode(injectedProvider.publicKey.toBytes())] : [];
      },
      getAccounts: async () => (injectedProvider.publicKey ? [bs58.encode(injectedProvider.publicKey.toBytes())] : []),
      signTransaction: async (req: JRPCRequest<{ message: string }>): Promise<Transaction> => {
        const transaction = await injectedProvider.request<Transaction>({
          method: "signTransaction",
          params: {
            message: req.params?.message,
          },
        });
        return transaction;
      },
      signMessage: async (req: JRPCRequest<{ message: Uint8Array }>): Promise<Uint8Array> => {
        const message = await injectedProvider.request<Uint8Array>({
          method: "signMessage",
          params: {
            message: req.params?.message,
          },
        });
        return message;
      },
      signAndSendTransaction: async (req: JRPCRequest<{ message: string }>): Promise<{ signature: string }> => {
        const txRes = await injectedProvider.request<{ signature: string }>({
          method: "signAndSendTransaction",
          params: {
            message: req.params?.message,
          },
        });
        return { signature: txRes.signature };
      },
      signAllTransactions: async (req: JRPCRequest<{ message: string[] }>): Promise<Transaction[]> => {
        const transaction = await injectedProvider.request<Transaction[]>({
          method: "signAllTransactions",
          params: {
            message: req.params?.message,
          },
        });
        return transaction;
      },
      getProviderState: (req, res, _, end) => {
        res.result = {
          accounts: injectedProvider.publicKey ? [bs58.encode(injectedProvider.publicKey.toBytes())] : [],
          chainId: "", // Phantom doesn't have a chainId yet
          isUnlocked: this.state._initialized,
        };
        end();
      },
    };
    const solanaMiddleware = createSolanaMiddleware(providerHandlers);
    const injectedProviderProxy = createInjectedProviderProxyMiddleware(injectedProvider);
    const engine = new JRPCEngine();
    engine.push(solanaMiddleware);
    engine.push(injectedProviderProxy);
    const provider = providerFromEngine(engine);

    const providerWithRequest = {
      ...provider,
      request: async (args: RequestArguments) => {
        return provider.sendAsync(args);
      },
    } as SafeEventEmitterProvider;
    this._providerProxy = createSwappableProxy<SafeEventEmitterProvider>(providerWithRequest);
    return this._providerProxy;
  }

  protected async lookupNetwork(_: PhantomWallet): Promise<void> {
    // const genesisHash = await phantomProvider.request<string>({
    //   method: "getGenesisHash",
    //   params: [],
    // });
    // const { chainConfig } = this.config;
    // if (!genesisHash) throw WalletInitializationError.rpcConnectionError(`Failed to connect with phantom wallet`);
    // if (chainConfig.chainId !== genesisHash.substring(0, 32))
    //   throw WalletInitializationError.invalidNetwork(
    //     `Wallet is connected to wrong network,Please change your network to ${
    //       SOLANA_NETWORKS[chainConfig.chainId] || chainConfig.displayName
    //     } from phantom wallet extention.`
    //   );
    // return genesisHash.substring(0, 32);
  }
}
