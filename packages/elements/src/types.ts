/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType, VFC } from 'react'
import { config } from '@vitus-labs/core'

type ExtractNullableKeys<T> = {
  [P in keyof T as T[P] extends null | never | undefined ? never : P]: T[P]
}

// merge types
type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<Pick<L, Exclude<keyof L, keyof R>> & R>

type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R]
  ? SpreadTwo<L, Spread<R>>
  : unknown

export type MergeTypes<A extends readonly [...any]> = ExtractNullableKeys<
  Spread<A>
>

export type SimpleHoc<P extends Record<string, unknown>> = <
  T extends ComponentType<any>
>(
  WrappedComponent: T
) => VFC<MergeTypes<[P, ExtractProps<T>]>>

export type CssCallback = (css: typeof config.css) => ReturnType<typeof css>
export type Css = CssCallback | string | ReturnType<typeof config.css>

export type isEmpty = null | undefined
export type ContentAlignX =
  | 'left'
  | 'center'
  | 'right'
  | 'spaceBetween'
  | 'spaceAround'
  | 'block'
  | isEmpty

export type ContentAlignY =
  | 'top'
  | 'center'
  | 'bottom'
  | 'spaceBetween'
  | 'spaceAround'
  | 'block'
  | isEmpty

export type ContentDirection =
  | 'inline'
  | 'rows'
  | 'reverseInline'
  | 'reverseRows'
  | isEmpty

export type Ref = HTMLElement

export type AlignY =
  | ContentAlignY
  | ContentAlignY[]
  | Record<string, ContentAlignY>

export type AlignX =
  | ContentAlignX
  | ContentAlignX[]
  | Record<string, ContentAlignX>

export type Direction =
  | ContentDirection
  | ContentDirection[]
  | Record<string, ContentDirection>

export type ResponsiveBooltype =
  | boolean
  | Record<string, boolean>
  | Array<boolean>

export type Responsive =
  | number
  | Array<string | number>
  | Record<string, number | string>

export type ExtendCss = Css | Array<Css> | Record<string, Css>

export type ExtractProps<TComponentOrTProps> =
  TComponentOrTProps extends ComponentType<infer TProps>
    ? TProps
    : TComponentOrTProps
