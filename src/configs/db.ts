import Dexie, { Table } from 'dexie';
import { IToken } from '../types';

  
  export class TokenKitDBDexie extends Dexie {
    tokens!: Table<IToken>
  
    constructor() {
      super('TokenKitDB');
      this.version(1).stores({
        tokens: '++id, name, symbol, decimals, address, verified, public'
      });
      this.version(2).stores({
        tokens: '++id, name, symbol, decimals, address, verified, public, common, pair_id, [verified+common], [verified+public], [verified+common+public]'
      });
    }
  }
  
  export const db = new TokenKitDBDexie();