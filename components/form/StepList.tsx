import { StepInput } from "../../graphql"
import { StepField } from "./StepField"
import { FunctionComponent } from "react"
import { FormikHelpers, FormikErrors, FormikTouched, FieldArrayRenderProps } from "formik"
import { FormValues } from "./RecipeForm"
import { SortableContainer, SortableHandle, SortableElement, SortEndHandler, arrayMove } from "react-sortable-hoc"
import { Icon } from "@blueprintjs/core"
import { TD } from "../base/TD"
import styled from "styled-components"

interface Props {
  steps: StepInput[],
  setFieldValue: FormikHelpers<any>['setFieldValue'],
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  validateField: FormikHelpers<any>['validateField'],
  arrayHelpers: FieldArrayRenderProps
}

const Container = SortableContainer(({ children }: { children: React.ReactNode }) => {
  return <tbody>{children}</tbody>
})

const DragHandle = styled(SortableHandle(() => <TD><Icon icon="drag-handle-vertical"/></TD>))`
  cursor: grab
`

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
      {steps.sort((a, b) => a.position - b.position).map((step, index) => (
        <SortableItem key={index} index={index}>
          <StepField
            key={step.position}
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