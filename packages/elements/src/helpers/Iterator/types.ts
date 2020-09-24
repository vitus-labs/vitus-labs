import type { ComponentType, ReactText, ReactNode } from 'react'

export type KeyType = ReactText

type ArrayObjectData = Partial<{ component: ComponentType }> &
  Record<string, any>

type ItemIdType = ArrayObjectData & {
  id?: KeyType
}

type ItemKeyType = ArrayObjectData & {
  key?: KeyType
}

type ItemItemIdType = ArrayObjectData & {
  itemId?: KeyType
}

export type DataArrayObject = ItemIdType | ItemKeyType | ItemItemIdType

type BaseProps = Partial<{
  wrapComponent: ComponentType
  extendProps: boolean
  itemProps:
    | Record<string, any>
    | ((key: string | number) => Record<string, any>)
}>

type ChildrenType = BaseProps & {
  children: ReactNode
}

type DataSimpleArrayType = BaseProps & {
  component: ReactNode
  data: Array<string | number>
  itemKey?: string
}

type DataObjectArrayType = BaseProps & {
  component: ReactNode
  data: Array<DataArrayObject>
  itemKey?: string | ((item: object, index: number) => string | number)
}

export type Props = ChildrenType | DataSimpleArrayType | DataObjectArrayType
