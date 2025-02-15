import * as jwt from 'jsonwebtoken';
import { TokenResponse } from '../classes/TokenResponse';

/**
 * Generate a token from any data from parameter.
 * @param baredData a data to bare into token object
 * @returns a token object
 */
export async function generateToken(baredData: any): Promise<TokenResponse> {
  const token = jwt.sign(baredData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
  return new TokenResponse(token);
}
