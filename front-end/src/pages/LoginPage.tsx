import googleIcon from '../assets/google.svg'
import './LoginPage.css'

function LoginPage() {
    return (
        <>
            <form className='form' action="">
                <div className='loginButtons'>
                    <button className="flex justify-center items-center gap-2.5 bg-gray-300 p-2 rounded"><img src={googleIcon} alt="" />Logar com o Google</button>
                </div>
            </form>
        </>
    )
}

export default LoginPage