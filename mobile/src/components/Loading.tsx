import { Center, NativeBaseProvider, Spinner } from 'native-base';
import { THEME } from '../styles/themes'

export function Loading() {
    return (
        <>
        <NativeBaseProvider theme={THEME}>
            <Center flex={1} bg="gray.900">
                <Spinner color='yellow.500'/>
            </Center>
        </NativeBaseProvider>
        </>
    )
}