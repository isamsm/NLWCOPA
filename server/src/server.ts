import Fastify from "fastify";
import cors from '@fastify/cors'
import jwt from  '@fastify/jwt'

import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { poolRoutes } from "./routes/pool";
import { userRoutes } from "./routes/user";

async function bootstrap() {
    const fastify = Fastify({
        logger: true
    })

    //http://localhost:3333/pools/count

    await fastify.register(cors, {
        origin: true, 
    }) //qualquer aplicação poderá acessar o backend

    await fastify.register(jwt, {
        secret: 'nlwcopa',
    }) //em produção isso deve ser uma variável ambiente

    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(poolRoutes)
    await fastify.register(userRoutes)

    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()