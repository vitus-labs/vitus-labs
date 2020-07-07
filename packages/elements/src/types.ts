type isEmpty = null | undefined
type ContentAlignX = 'left' | 'center' | 'right' | isEmpty
type ContentAlignY = 'top' | 'center' | 'bottom' | isEmpty
type ContentDirection = 'inline' | 'rows' | isEmpty

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

export type Booltype = boolean | Array<boolean> | Record<string, boolean>

export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends React.ComponentType<infer TProps>
  ? TProps
  : TComponentOrTProps
