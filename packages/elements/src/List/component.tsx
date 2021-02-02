import React, { forwardRef } from 'react'
import { pick, omit } from '@vitus-labs/core'
import Element from '~/Element'
import Iterator from '~/helpers/Iterator'
import { ExtractProps } from '~/types'

type Props = Partial<
  ExtractProps<typeof Iterator> &
    ExtractProps<typeof Element> & {
      rootElement?: boolean
      label: never
      content: never
    }
>

const Component = forwardRef<unknown, Props>(
  ({ rootElement = false, ...props }, ref) => {
    const renderedList = <Iterator {...pick(props, Iterator.RESERVED_PROPS)} />

    if (!rootElement) return renderedList

    return (
      <Element ref={ref} {...omit(props, Iterator.RESERVED_PROPS)}>
        {renderedList}
      </Element>
    )
  }
)

Component.displayName = 'vitus-labs/elements/List'

export default Component
