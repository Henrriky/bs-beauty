import { SVGAttributes } from 'react'
import Logo from '../../assets/logo.svg'

type BSBeautyLogoProps = SVGAttributes<SVGElement>

function BSBeautyLogo(props: BSBeautyLogoProps) {
  return (
    <div>
      <Logo {...props} />
    </div>
  )
}

export default BSBeautyLogo
