import { FastifyInstance } from "fastify";
import { z } from "zod";
import fetch from "node-fetch";
import { prisma } from "../lib/prisma";
import { Autheticate } from "../plugins/autheticate";

export async function authRoutes(fastify: FastifyInstance) {
    fastify.get(
        '/me', 
        {
            onRequest: [Autheticate]
        }, //antes de executar o código abaixo, executa a função de autenticação
        async (request) => {
            return { user: request.user } //retorna informações do usuario logado se existir um jwt válido
    }) 

    fastify.post('/users', async(request) => {
        const createUserBody = z.object({
            access_token: z.string(),
        })

        const { access_token } = createUserBody.parse(request.body)

        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        }) //chama api do google (retorna dados logados), envia access_token (do mobile) como um header, cabeçalho, de autorização. diz que quem está logado é esse access_token pego do mobile

        const userData = await userResponse.json()

        const userInfoSchema = z.object({
            id: z.string(),
            email: z.string().email(),
            name: z.string(),
            picture: z.string().url(),
        }) //informações que google devolve

        const userInfo = userInfoSchema.parse(userData) //valida se informações devolvidar são realmente as listadas a cima 

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.id,
            }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    avatarUrl: userInfo.picture,
                }
            })
        }

        //terá acesso ao usuário a partir dessa parte, tendo ele sido criado agora ou não

        const token = fastify.jwt.sign({ 
            name: user.name,
            avatarUrl: user.avatarUrl,
         }, {
            sub: user.id, //info para saber quem gerou o token
            expiresIn: '7 days', //expiração token
         }) //gerando token. não coloque informações secretas aqui, não é criptografia

        return { token }
    })
}