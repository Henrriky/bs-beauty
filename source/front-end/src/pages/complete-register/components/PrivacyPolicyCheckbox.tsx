import { Checkbox } from '../../../components/inputs/Checkbox'

interface PrivacyPolicyCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}

function PrivacyPolicyCheckbox({
  checked,
  onChange,
  error,
}: PrivacyPolicyCheckboxProps) {
  return (
    <Checkbox
      id="privacyPolicy"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      label={
        <span>
          Eu li e aceito a{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B19B86] hover:text-[#D4BFAA] underline"
          >
            Política de Privacidade
          </a>
        </span>
      }
      error={error}
    />
  )
}

export default PrivacyPolicyCheckbox
