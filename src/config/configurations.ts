import * as process from 'node:process';

export const configurations = () => ({
  auth: {
    jwt: process.env.JWT_SECRET || 'secret const',
  },
});
