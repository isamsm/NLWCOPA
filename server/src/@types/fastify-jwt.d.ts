//d -> definição titulo ts, ts lê para obter info

import '@fastify/jwt'

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            sub: string;
            name: string;
            avatarUrl: string;
        }
    }
}