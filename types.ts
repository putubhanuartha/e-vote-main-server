import { InputFormType } from "./enums"

export type DynamicFormType = {
    type: InputFormType
    title: string
    option?: string[]
    id: string
}