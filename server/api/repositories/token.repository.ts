import { IToken, Token } from '../models/token.model'
import { Repository } from './repository'

export class TokenRepository extends Repository<IToken> {
  constructor() {
    super();
    this.model = Token;
  }
}
