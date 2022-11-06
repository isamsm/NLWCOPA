import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import userAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  console.log(poolTitle)
  
  async function createPool(event: FormEvent){
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      }); 

      const { code } = response.data

      navigator.clipboard.writeText(code) //copia o codigo para sua area de transferencia

      alert('Bolão criado com sucesso. O código foi copiado para sua área de transferencia.')

      setPoolTitle('')

    } catch (err) {
      console.log(err)
      alert('Falha ao criar o bolão, tente novamente!')
    }
  } //envia o bolão criado para o banco de dados

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image 
          src={logoImg} 
          alt="Logo NLW COPA"
          quality={100} 
        />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'> 
          Crie seu próprio bolão da copa e compartilhe entre amigos! 
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image 
            src={userAvatarExampleImg}
            alt="Pessoas que estão usando o NLW COPA"
            quality={100}
          />

          <strong className='text-gray-100 text-xl'> <span className='text-ignite-500'> +{props.userCount} </span> pessoas já estão usando </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input 
            className='flex-1 px-6 py-4 rounded bg-gray-800 text-gray-100 text-sm' 
            type="text" 
            required 
            placeholder='Qual nome do seu bolão?'
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}/> 
          <button className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700' type='submit'> Criar meu bolão </button>
        </form>

        <p className='text-gray-300 text-sm mt-4 leading-relaxed'> Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀 </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'> 
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'> +{props.poolCount} </span>
              <span> Bolões criados  </span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'> +{props.guessCount} </span>
              <span className='text-base font-normal'> Palpites enviados  </span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImg} 
        alt="Dois celulares exibindo uma prévia da aplicação no mobile"
        quality={100}
      />
    </div>
  )
}

export const getStaticProps = async() => {
  const [poolCountResponse, guessesCountResponse, usersCountResponse] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      userCount: usersCountResponse.data.count,
    }
  }
}
