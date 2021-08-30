import { createToken } from './createToken/createToken';
import type { Container } from './Container';

export const DI_TOKEN = createToken<Container>('di');
