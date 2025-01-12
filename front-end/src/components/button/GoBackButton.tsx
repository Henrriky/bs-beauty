import { useNavigate } from 'react-router'
import { ArrowLongLeftIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'

function GoBackButton() {
  const navigate = useNavigate()

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate(-1)}
        label={
          <div className="">
            <ArrowLongLeftIcon className="size-8 text-[#B19B86] hover:text-[#D9D9D9] transition-colors" />
          </div>
        }
        className="max-w-10 border-none rounded-none hover:bg-opacity-0 hover:bg-transparent"
      />
    </>
  )
}

export default GoBackButton
