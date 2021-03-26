/* eslint-disable no-param-reassign */
import React, { createRef } from 'react'
import { get } from '@vitus-labs/core'
import type { SimpleHoc } from '~/types'

const isNumber = (a: unknown, b: unknown) =>
  Number.isInteger(a) && Number.isInteger(b)

const types = {
  height: 'offsetHeight',
  width: 'offsetWidth',
}

type Calculate = ({
  beforeContent,
  afterContent,
}: {
  beforeContent: HTMLElement
  afterContent: HTMLElement
}) => (type: 'height' | 'width') => void

const calculate: Calculate = ({ beforeContent, afterContent }) => (
  type: keyof typeof types
) => {
  const beforeContentSize = get(beforeContent, types[type])
  const afterContentSize = get(afterContent, types[type])

  if (isNumber(beforeContentSize, afterContentSize)) {
    if (beforeContentSize > afterContentSize) {
      beforeContent.style[type] = `${beforeContentSize}px`
      afterContent.style[type] = `${beforeContentSize}px`
    } else {
      beforeContent.style[type] = `${afterContentSize}px`
      afterContent.style[type] = `${afterContentSize}px`
    }
  }
}

type Props = Partial<{
  equalBeforeAfter: boolean
  vertical?: boolean
  afterContent?: React.ReactNode
  beforeContent?: React.ReactNode
}>

const withEqualBeforeAfter: SimpleHoc<Props> = (WrappedComponent) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const Enhanced = (props) => {
    const {
      equalBeforeAfter,
      vertical,
      afterContent,
      beforeContent,
      ...rest
    } = props
    const elementRef = createRef<HTMLElement>()

    const calculateSize = () => {
      const beforeContent = get(elementRef, 'current.children[0]')
      const afterContent = get(elementRef, 'current.children[2]')
      const updateElement = calculate({ beforeContent, afterContent })

      if (vertical) updateElement('height')
      else updateElement('width')
    }

    if (equalBeforeAfter) calculateSize()

    return (
      <WrappedComponent
        {...rest}
        afterContent={afterContent}
        beforeContent={beforeContent}
        ref={elementRef}
      />
    )
  }

  Enhanced.displayName = `withEqualSizeBeforeAfter(${displayName})`

  return Enhanced
}

export default withEqualBeforeAfter
