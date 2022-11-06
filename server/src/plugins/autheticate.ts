import { FastifyRequest } from "fastify";

export async function Autheticate(request: FastifyRequest) {
    await request.jwtVerify()
} 