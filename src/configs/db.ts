import Dexie, { Table } from 'dexie';
import { IToken, TokensDBInfo } from '../types';

  
  export class TokenKitDBDexie extends Dexie {
    tokens!: Table<IToken>
    info!: Table<TokensDBInfo>
    mainnet_tokens!: Table<IToken>
    mainnet_info!: Table<TokensDBInfo>
  
    constructor() {
      super('TokenKitDB');
      this.version(1).stores({
        tokens: '++id, name, symbol, decimals, address, verified, public'
      });
      this.version(2).stores({
        tokens: '++id, name, symbol, decimals, address, verified, public, common, pair_id, [verified+common], [verified+public], [verified+common+public]'
      });
      this.version(3).stores({
        info: '++id, name, tokens_count, tokens_version'
      });
      this.version(4).stores({
        mainnet_tokens: '++id, name, symbol, decimals, address, verified, public, common, pair_id, [verified+common], [verified+public], [verified+common+public]',
        mainnet_info: '++id, name, tokens_count, tokens_version'
      });
    }
  }
  
  export const db = new TokenKitDBDexie();