import { Button as ButtonNativeBase, Text, IButtonProps } from 'native-base';

interface Props extends IButtonProps {
    title: string;
    type?: 'PRIMARY'| 'SECONDARY'
} //botão com texto interativo com props. ibuttonprops => mais propriedades

export function Button({ title, type = 'PRIMARY', ...rest }: Props) { //se não tiver o tipo especificado, é primary por padrão
    return (
        <>
            <ButtonNativeBase 
                w="full" //width
                h={14} //height
                rounded="sm"
                fontSize="md"
                textTransform="uppercase"
                bg={type === 'SECONDARY' ? 'red.500' : 'yellow.500'}
                _pressed={{
                    bg: type == 'SECONDARY' ? 'red.400' : 'yellow.600'
                }} //quando botão é pressionado
                _loading={{
                    _spinner: { color: 'black' }
                }}


                {...rest}>
                <Text
                    fontSize='sm'
                    fontFamily='heading'
                    color={type == 'SECONDARY' ? 'white' : 'black'}
                >
                    {title}
                </Text>
            </ButtonNativeBase>
        </>
    )
}

 //...rest => operador que diz que qualquer outra propriedade implicita pode ser passada para o componente