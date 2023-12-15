import { useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { Controller } from "react-hook-form";
import "./CountryPicker.css"

const CountryPicker = ({ countryID, cityID = "", form, initialValues, onlyCountry = false }) => {
  const { control, formState: { errors, isDirty }, setValue, getValues } = form;
  const [countryValue, setCountryValue] = useState("");

  useEffect(() => {
    setValue(countryID, initialValues.country)
    // setValue(cityID, "Islāmābād")
    if(!onlyCountry){
      setValue(cityID, initialValues.city)
    }
  }, [])


  return (
    <div className='profile__modal__country__picker'>
      <div>
        <label htmlFor={countryID}>Country/Region<span className="asterik">*</span></label>
        <Controller
          name={countryID}
          control={control}
          render={({ field }) => (
            <div>
              <CountryDropdown
                onChange={(val) => {
                  setValue(countryID, val);
                  setCountryValue(val);
                }}
                value={field.value}
                onBlur={field.onBlur}
                
                className={errors.signup__country && isDirty.signup__country ? "input__error" : ''}
                id={countryID}
              />
              {errors.signup__country && isDirty.signup__country && (
                <p className='login__error'>{errors.signup__country.message}</p>
              )}
            </div>
          )}
          rules={{ required: 'Country/Region is required' }}
        />
      </div>
      {!onlyCountry &&
        <div>
          <label htmlFor={cityID}>City/District<span className="asterik">*</span></label>
          <Controller
            name={cityID}
            control={control}
            render={({ field }) => {
              // console.log(field.value);
              return (
                <div>
                  <RegionDropdown
                    onChange={(val) => {
                      setValue(cityID, val);
                    }}
                    value={field.value}
                    country={getValues(countryID)}
                    onBlur={field.onBlur}
                    className={errors.signup__city && isDirty.signup__city ? "input__error" : ''}
                    id={cityID}
                  />
                  {errors.signup__city && isDirty.signup__city && (
                    <p className='login__error'>{errors.signup__city.message}</p>
                  )}
                </div>
              )
            }}
            rules={{ required: 'City/District is required' }}
          />
        </div>
      }

    </div>
  )
}
export default CountryPicker