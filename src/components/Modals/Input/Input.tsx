import { FieldErrors, FieldValues, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import "./Input.css"
// import { useEffect } from "react"

interface InputProps {
  id: string,
  register: UseFormRegister<FieldValues>,
  labelValue: string,
  errors: FieldErrors,
  setValue: UseFormSetValue<FieldValues>
  initialValue?: string,
  required?: boolean,
  type?: "text" | "date",
  placeholder?: string,
  watch?: UseFormWatch<FieldValues>;
}
const Input: React.FC<InputProps> = ({ id, register, labelValue, errors, setValue, watch, required, type = "text", placeholder }) => {

  return (
    <>
      <label htmlFor={id} className='modal__label'>{labelValue}</label>
      <input type={type}
        id={id}
        placeholder={placeholder}
        {...register(id,
          { required: required }
        )}
        className={`modal__input ${errors[id] ? 'input__required' : 'input_valid'}`}

      onChange={(e) => setValue(id, e.target.value)}
      value={watch?.(id)}
      />
    </>
  )
}

export default Input;