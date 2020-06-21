import { FieldProps, FormikHelpers, FormikErrors, FormikTouched, getIn } from "formik"
import { FormValues, StepFormField } from "./RecipeForm"
import { FunctionComponent } from "react"
import { Flex, Box } from "rebass/styled-components"
import { Tag } from "@blueprintjs/core"
import { NumericInput } from 'components/base/NumericInput'
import { secondsToHours, secondsToMinutes, minutesToSeconds, hoursToSeconds } from "lib/utils"

interface Props {
  field: FieldProps<StepFormField['duration']>['field']
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  validateField: FormikHelpers<any>['validateField']
}

export const DurationPicker: FunctionComponent<Props> = ({ field, setFieldValue, errors, touched, validateField }) => {
  const durationIntent = getIn(errors, field.name) && getIn(touched, field.name) ? "danger" : "none"
  let hours: number | undefined
  let minutes: number | undefined

  if (field.value !== undefined && field.value !== null) {
    hours = secondsToHours(field.value)
    minutes = secondsToMinutes(field.value)
  }

  const setDuration = (hours: number, minutes: number) => {
    const totalDuration = minutesToSeconds(minutes) + hoursToSeconds(hours)
    setFieldValue(field.name, totalDuration === 0 ? null : totalDuration)
  }

  return (
    <Flex>
      <Box mr={1}>
        <NumericInput
          value={hours}
          name={field.name}
          onBlur={field.onBlur}
          onChange={(value) => setDuration(value ?? 0, minutes ?? 0)}
          validateField={validateField}
          containerProps={{ width: 100 }}
          rightElement={<Tag minimal={true}>h</Tag>}
          intent={durationIntent} />
      </Box>

      <Box>
        <NumericInput
          value={minutes}
          name={field.name}
          onBlur={field.onBlur}
          onChange={(value) => setDuration(hours ?? 0, value ?? 0)}
          validateField={validateField}
          containerProps={{ width: 100 }}
          rightElement={<Tag minimal={true}>m</Tag>}
          intent={durationIntent} />
      </Box>
    </Flex>
  )
}