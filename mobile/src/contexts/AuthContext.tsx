import { api } from '../services/api';

import { createContext, ReactNode, useState, useEffect } from "react";

import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';


WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>; //dentro do signin => metodo processo autentificação
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps); //AutoContext => armazena context

export function AuthContextProvider({ children }: AuthProviderProps) { //AuthContextProvider => compartilha context com toda a aplicação
    const [user, setUser] = useState<UserProps>({} as UserProps); //guardar informação usuário autentificado
    const [isUserLoading, setIsUserLoading] = useState(false);

   const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    }); //promptAssync => inicia fluxo autentificação

    console.log(AuthSession.makeRedirectUri({ useProxy: true }))

    async function signIn() {
        try {
            setIsUserLoading(true);
            await promptAsync();

        }   catch (error) {
            console.log(error)
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    async function signInWithGoogle(access_token: string) {
        try {
            setIsUserLoading(true);

        const tokenResponse = await api.post('/users', { access_token })

        api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`;

        const userInfoResponse = await api.get('/me');
        setUser(userInfoResponse.data.user)

        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    } //se está autenticando ou não. feedback

    useEffect(() => {
        if(response?.type === 'success' && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken);
        }
    }, [response])

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
        }}>

            {children}

        </AuthContext.Provider>
    )

}