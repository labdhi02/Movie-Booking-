import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UnauthorizedError, TokenExpiredError } from '../errors/custom-errors';

export interface SupabaseJWTPayload {
  sub: string;
  email: string;           
  phone?: string;       
  role?: string;     
  aal?: string;   
  aud: string;         
  exp: number;           
  iat: number;              
  session_id?: string;      
  app_metadata?: object;    
  user_metadata?: {        
    first_name?: string;
    last_name?: string;
    [key: string]: any;
  };
}

export function verifySupabaseJWT(token: string): SupabaseJWTPayload {
  try {
    const payload = jwt.verify(token, config.supabaseJwtSecret, {
      algorithms: ['HS256'], 
    }) as SupabaseJWTPayload;
    
    return payload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new TokenExpiredError('Token expired');
    }
    throw new UnauthorizedError('Invalid token signature');
  }
}
