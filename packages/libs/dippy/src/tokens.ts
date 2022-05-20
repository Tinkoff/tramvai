import { createToken } from './createToken/createToken';
import type { Container } from './Container';

export const DI_TOKEN = /* #__PURE__*/ createToken<Container>('di');
