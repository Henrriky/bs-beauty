import { useNavigate } from 'react-router'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'

interface props {
  label?: string | undefined
}

function GoBackButton({ label }: props) {
  const navigate = useNavigate()

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate(-1)}
        label={
          <div className="flex items-center gap-3 mb-1">
            <div>
              <ArrowLongLeftIcon className="size-7 text-[#B19B86] hover:text-[#D9D9D9] transition-colors" />
            </div>
            <p className="text-lg">{label}</p>
          </div>
        }
        className="border-none rounded-none hover:bg-opacity-0 hover:bg-transparent"
      />
    </>
  )
}

export default GoBackButton
