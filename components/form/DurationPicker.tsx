import { FieldProps, FormikHelpers, FormikErrors, FormikTouched, getIn } from "formik"
import { FormValues } from "./RecipeForm"
import { FunctionComponent } from "react"
import { Flex, Box } from "rebass/styled-components"
import { Tag } from "@blueprintjs/core"
import { NumericInput } from './NumericInput'
import { secondsToHours, secondsToMinutes, minutesToSeconds, hoursToSeconds } from "../../lib/utils"

interface Props {
  field: FieldProps<number>['field']
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  validateField: FormikHelpers<any>['validateField']
}

export const DurationPicker: FunctionComponent<Props> = ({ field, setFieldValue, errors, touched, validateField }) => {
  const durationIntent = getIn(errors, field.name) && getIn(touched, field.name) ? "danger" : "none"
  const hours = secondsToHours(field.value ?? 0)
  const minutes = secondsToMinutes(field.value ?? 0)

  debugger

  const setHours = (hours: number) => {
    setFieldValue(field.name, minutesToSeconds(minutes) + hoursToSeconds(hours))
  }

  const setMinutes = (minutes: number) => {
    setFieldValue(field.name, minutesToSeconds(minutes) + hoursToSeconds(hours))
  }

  return (
    <Flex>
      <Box mr={1}>
        <NumericInput
          value={hours}
          name={field.name}
          onBlur={field.onBlur}
          onChange={(value) => setHours(value)}
          validateField={validateField}
          boxProps={{ width: 100 }}
          inputProps={{
            rightElement: <Tag minimal={true}>h</Tag>,
            intent: durationIntent
          }} />
      </Box>

      <Box>
        <NumericInput
          value={minutes}
          name={field.name}
          onBlur={field.onBlur}
          onChange={(value) => setMinutes(value)}
          validateField={validateField}
          boxProps={{ width: 100 }}
          inputProps={{
            rightElement: <Tag minimal={true}>m</Tag>,
            intent: durationIntent
          }} />
      </Box>
    </Flex>
  )
}