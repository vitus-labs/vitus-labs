import React, { forwardRef, useMemo, ReactNode, Ref } from 'react'
import optimizeTheme, { vitusContext } from '@vitus-labs/unistyle'
import { Direction, AlignX, AlignY, Booltype } from '~/types'
import Styled from './styled'

const KEYWORDS = [
  'parentDirection',
  'contentDirection',
  'alignX',
  'alignY',
  'equalCols',
  'gap',
  'extendCss',
]

type Props = {
  contentType: 'before' | 'content' | 'after'
  children: ReactNode
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  contentDirection: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: Booltype
  [key: string]: any
}
type Reference = Ref<HTMLElement>

const Element = forwardRef<Reference, Partial<Props>>(
  (
    {
      tag,
      parentDirection,
      contentDirection,
      alignX,
      alignY,
      equalCols,
      gap,
      extendCss,
      ...props
    },
    ref
  ) => {
    const localProps = {
      parentDirection,
      contentDirection,
      alignX,
      alignY,
      equalCols,
      gap,
      extendCss,
    }

    const { sortedBreakpoints } = vitusContext()
    const normalizedTheme = useMemo(
      () =>
        optimizeTheme({
          breakpoints: sortedBreakpoints,
          keywords: KEYWORDS,
          props: localProps,
        }),
      [
        parentDirection,
        contentDirection,
        alignX,
        alignY,
        equalCols,
        gap,
        extendCss,
      ]
    )

    return <Styled ref={ref} as={tag} $element={normalizedTheme} {...props} />
  }
)

export default Element
