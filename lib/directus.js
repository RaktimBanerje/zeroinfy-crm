import { createDirectus, rest } from '@directus/sdk';

const directus = createDirectus('https://zeroinfy.thinksurfmedia.in').with(rest());

export default directus;