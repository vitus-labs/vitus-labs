import React, { forwardRef, useMemo } from 'react'
import { config, renderContent } from '@vitus-labs/core'
import { Wrapper, Content } from '~/helpers'
import {
  transformVerticalProp,
  calculateSubTag,
  getShouldBeEmpty,
} from './utils'
import { AlignX, AlignY, Direction } from '~/types'
import type { Props } from './types'

const Component = forwardRef<any, Props>(
  (
    {
      innerRef,
      tag,
      // @ts-ignore
      label,
      children,
      beforeContent,
      afterContent,

      block,
      equalCols,
      gap,

      vertical,
      direction = 'inline',
      alignX = 'left',
      alignY = 'center',

      css,
      contentCss,
      beforeContentCss,
      afterContentCss,

      contentDirection = 'inline',
      contentAlignX = 'left',
      contentAlignY = 'center',

      beforeContentDirection = 'inline',
      beforeContentAlignX = 'left',
      beforeContentAlignY = 'center',

      afterContentDirection = 'inline',
      afterContentAlignX = 'left',
      afterContentAlignY = 'center',

      ...props
    },
    ref
  ) => {
    // --------------------------------------------------------
    // check if should render only single element
    // --------------------------------------------------------
    const shouldBeEmpty = useMemo(
      () =>
        getShouldBeEmpty(tag, config.isWeb) || props.dangerouslySetInnerHTML,
      [tag, props.dangerouslySetInnerHTML]
    )

    // --------------------------------------------------------
    // common wrapper props
    // --------------------------------------------------------
    const WRAPPER_PROPS = {
      ref: ref || innerRef,
      extendCss: css,
      tag,
      block,
      contentDirection,
      alignX: contentAlignX,
      alignY: contentAlignY,
      as: undefined, // reset styled-components `as` prop
    }

    // --------------------------------------------------------
    // return simple/empty element like input
    // --------------------------------------------------------
    if (shouldBeEmpty) return <Wrapper {...WRAPPER_PROPS} {...props} />

    // --------------------------------------------------------
    // if not single element, calculate values
    // --------------------------------------------------------
    const isSimple = !beforeContent && !afterContent
    const CHILDREN = children || label
    const SUB_TAG = useMemo(() => calculateSubTag(tag, config.isWeb), [tag])

    // --------------------------------------------------------
    // direction & alignX calculations
    // --------------------------------------------------------
    let wrapperDirection: Direction = direction
    let wrapperAlignX: AlignX = alignX
    let wrapperAlignY: AlignY = alignY

    if (isSimple) {
      if (contentDirection) wrapperDirection = contentDirection
      if (contentAlignX) wrapperAlignX = contentAlignX
      if (contentAlignY) wrapperAlignY = contentAlignY
    }

    if (vertical) wrapperDirection = transformVerticalProp(vertical)

    return (
      <Wrapper
        {...props}
        {...WRAPPER_PROPS}
        direction={wrapperDirection}
        alignX={wrapperAlignX}
        alignY={wrapperAlignY}
      >
        {beforeContent && (
          <Content
            tag={SUB_TAG}
            contentType="before"
            parentDirection={wrapperDirection}
            extendCss={beforeContentCss}
            direction={beforeContentDirection}
            alignX={beforeContentAlignX}
            alignY={beforeContentAlignY}
            equalCols={equalCols}
            gap={gap}
          >
            {renderContent(beforeContent)}
          </Content>
        )}

        {beforeContent || afterContent ? (
          <Content
            tag={SUB_TAG}
            contentType="content"
            parentDirection={wrapperDirection}
            extendCss={contentCss}
            direction={contentDirection}
            alignX={contentAlignX}
            alignY={contentAlignY}
            equalCols={equalCols}
            isContent
          >
            {renderContent(CHILDREN)}
          </Content>
        ) : (
          renderContent(CHILDREN)
        )}

        {afterContent && (
          <Content
            tag={SUB_TAG}
            contentType="after"
            parentDirection={wrapperDirection}
            extendCss={afterContentCss}
            direction={afterContentDirection}
            alignX={afterContentAlignX}
            alignY={afterContentAlignY}
            equalCols={equalCols}
            gap={gap}
          >
            {renderContent(afterContent)}
          </Content>
        )}
      </Wrapper>
    )
  }
)

Component.displayName = 'vitus-labs/elements/Element'

export default Component
