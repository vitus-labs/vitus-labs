import React, { ComponentType, FC, ReactNode, useContext } from 'react'
import { omit } from '@vitus-labs/core'
import { extendedCss } from '@vitus-labs/unistyle'
import { CONTEXT_KEYS } from '~/constants'
import useGridContext from '~/useContext'
import { RowContext } from '~/context'
import type { Css, ConfigurationProps } from '~/types'
import Styled from './styled'

type Props = Partial<{
  children: ReactNode
  component: ComponentType
  css: Css
}> &
  ConfigurationProps &
  Partial<{
    columns: never
    gap: never
    gutter: never
  }>

type ElementType<
  P extends Record<string, unknown> = Record<string, unknown>
> = FC<P & Props>

const Element: ElementType = ({ children, component, css, ...props }) => {
  const parentCtx = useContext(RowContext)
  const { colCss, colComponent, ...ctx } = useGridContext({
    ...parentCtx,
    ...props,
  })

  return (
    <Styled
      {...omit(props, CONTEXT_KEYS)}
      as={component || colComponent}
      $coolgrid={{
        ...ctx,
        extendCss: extendedCss(css || colCss),
      }}
    >
      {children}
    </Styled>
  )
}

Element.displayName = '@vitus-labs/coolgrid/Col'

export default Element
