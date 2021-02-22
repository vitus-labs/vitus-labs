import React, { ReactNode, FC, useContext, ComponentType } from 'react'
import { Provider as CoreProvider, context } from '@vitus-labs/core'

type Theme = {
  rootSize: number
  breakpoints?: Record<string, number>
  __VITUS_LABS__?: never
} & Record<string, unknown>

export type TProvider = {
  children: ReactNode
  theme?: Theme
  mode?: 'light' | 'dark'
  inversed?: boolean
  provider?: ComponentType<any>
}

const Provider: FC<TProvider> = ({
  theme,
  mode,
  children,
  inversed,
  provider: RocketstyleProvider = CoreProvider,
}) => {
  if (inversed) {
    const { provider: InnerProvider, mode: ctxMode, ...ctx } = useContext(
      context
    )
    const isDark = ctxMode === 'dark'
    const inversedTheme = isDark ? 'light' : 'dark'

    return (
      <InnerProvider
        mode={inversedTheme}
        isDark={isDark}
        isLight={!isDark}
        {...ctx}
      >
        {children}
      </InnerProvider>
    )
  }

  const isDark = mode === 'dark'

  return (
    <RocketstyleProvider
      mode={mode}
      isDark={isDark}
      isLight={!isDark}
      theme={theme}
      provider={RocketstyleProvider}
    >
      {children}
    </RocketstyleProvider>
  )
}

// eslint-disable-next-line import/prefer-default-export
export { context }
export default Provider
