import googleIcon from '../assets/google.svg'
import loginBackgroundBottom from '../assets/login-background-bottom.svg'
import loginBackgroundTop from '../assets/login-background-top.svg'

function LoginPage() {
    return (
        <>
            <div className='flex justify-center items-center h-screen flex-col relative'>
                <img src={loginBackgroundTop} alt="Ícone do Google" className='absolute right-0 top-0'/>
                <div>
                    <button 
                        className="flex justify-center items-center gap-2.5 bg-[#DBDBDB] p-2 rounded w-[320px] text-[#1E1E1E] text-sm font-medium rounded-tl-3xl rounded-tr-sm rounded-br-3xl rounded-bl-sm"
                    >
                        <img src={googleIcon} alt="Ícone do Google" />
                        Logar com o Google
                    </button>
                </div>

                <img src={loginBackgroundBottom} alt="Ícone do Google" className='absolute left-0 bottom-0 max-h- object-cover w-full'/>
            </div>
        </>
    )
}

export default LoginPage