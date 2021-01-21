import React, { forwardRef, ReactNode, Ref } from 'react'
import {
  Direction,
  AlignX,
  AlignY,
  ResponsiveBooltype,
  Responsive,
  Css,
} from '~/types'
import Styled from './styled'

type Props = {
  parentDirection: Direction
  gap: Responsive
  contentType: 'before' | 'content' | 'after'
  children: ReactNode
  tag: import('styled-components').StyledComponentPropsWithRef<any>
  direction: Direction
  alignX: AlignX
  alignY: AlignY
  equalCols: ResponsiveBooltype
  extendCss: Css
}
type Reference = Ref<HTMLElement>

const Component = forwardRef<Reference, Partial<Props>>(
  (
    {
      contentType,
      tag,
      parentDirection,
      direction,
      alignX,
      alignY,
      equalCols,
      gap,
      extendCss,
      ...props
    },
    ref
  ) => {
    const debugProps =
      process.env.NODE_ENV !== 'production'
        ? {
            'data-vl-element': contentType,
          }
        : {}

    return (
      <Styled
        ref={ref}
        as={tag}
        $contentType={contentType}
        $element={{
          parentDirection,
          direction,
          alignX,
          alignY,
          equalCols,
          gap,
          extendCss,
        }}
        {...debugProps}
        {...props}
      />
    )
  }
)

export default Component
