import './LoginPage.css'
import personIcon from '../assets/personIcon.svg'
import googleIcon from '../assets/google.svg'
import lockIcon from '../assets/lock.svg'

function LoginPage() {
    return (
        <>
            <form className='form' action="">
                <div className='inputGroup'>
                    <div className='inputItem'>
                        <div>
                            <img src={personIcon} className='icon'></img>
                            <input type="text" placeholder='Nome de Usuário' />
                        </div>
                        <hr />
                    </div>
                    <div className='inputItem'>
                        <div>
                            <img src={lockIcon} className='icon'></img>
                            <input type="text" placeholder='Senha' />
                        </div>
                        <hr />
                    </div>
                </div>
                <div className='loginButtons'>
                    <button className="mailLogin" type="submit">Login</button>
                    <button className="googleLogin"><img src={googleIcon} alt="" />Logar com o Google</button>
                </div>
                <div className='auxOptions'>
                    <a className='auxOptionsItem' href="">Esqueceu a senha</a>
                    <a className='auxOptionsItem' href="">Entrar</a>
                </div>
            </form>
        </>
    )
}

export default LoginPage