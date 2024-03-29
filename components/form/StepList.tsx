import { StepField } from "./StepField"
import React, { FunctionComponent } from "react"
import { FormikHelpers, FormikErrors, FormikTouched, FieldArrayRenderProps } from "formik"
import { FormValues, StepFormField } from "./RecipeForm"
import { SortableContainer, SortableHandle, SortableElement, SortEndHandler } from "react-sortable-hoc"
import { Icon } from "@blueprintjs/core"
import styled from "styled-components"
import arrayMove from "array-move"
import { icon } from "lib/icons"
import { TD } from "components/base/TD"

interface Props {
  steps: StepFormField[],
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  validateField: FormikHelpers<any>['validateField'],
  arrayHelpers: FieldArrayRenderProps
}

const Container = SortableContainer(({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>
})

const StyledTD = styled(TD)`
  cursor: grab
`

const DragHandle = SortableHandle(() => <StyledTD><Icon icon={icon("drag-handle", { style: { verticalAlign: 'middle' } })}/></StyledTD>)

const SortableItem = SortableElement(({ children }: { children: React.ReactNode }) => (
  <tr>
    <DragHandle />
    {children}
  </tr>
));

export const StepList: FunctionComponent<Props> = ({ steps, setFieldValue, validateField, errors, touched, arrayHelpers }) => {
  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    const newSteps = arrayMove(steps, oldIndex, newIndex).map((step, index) => {
      step.position = index + 1
      return step
    })

    setFieldValue('steps', newSteps)
  }

  return (
    <Container onSortEnd={onSortEnd} useDragHandle>
      {steps.sort((a, b) => a.position - b.position).map((_step, index) => (
        <SortableItem key={index} index={index}>
          <StepField
            key={index}
            index={index}
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            validateField={validateField}
            onRemove={() => arrayHelpers.remove(index)} />
        </SortableItem>
      ))}
    </Container>
  )
}