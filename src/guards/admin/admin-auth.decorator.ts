import { SetMetadata } from '@nestjs/common';

export const AUTHENTICATE_ADMIN = 'AUTHENTICATE_ADMIN';
export const AuthenticateAdmin = () => SetMetadata(AUTHENTICATE_ADMIN, true);
