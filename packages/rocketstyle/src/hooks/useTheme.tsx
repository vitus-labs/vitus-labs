import moize from 'moize'
import { config, set, get, isEmpty } from '@vitus-labs/core'
import { calculateChainOptions } from '../utils'
import type { Configuration, __ROCKETSTYLE__ } from '~/types'

const isMultiKey = moize(
  (value) => {
    if (typeof value === 'object') return [true, get(value, 'propName')]
    return [false, value]
  },
  { maxSize: 15, maxArgs: 1 }
)

const isValidKey = (value) =>
  value !== undefined && value !== null && value !== false

const calculateDimensionsMap = moize(
  ({ themes, useBooleans }) => {
    const result = { keysMap: {}, keywords: {} }
    console.log('calculateDimensionsMap')
    if (isEmpty(themes)) return result

    return Object.entries(themes).reduce((accumulator, [key, value]) => {
      const { keysMap, keywords } = accumulator
      keywords[key] = true

      Object.entries(value).forEach(([itemKey, itemValue]) => {
        if (!isValidKey(itemValue)) return

        if (useBooleans) {
          keywords[itemKey] = true
        }

        set(keysMap, [key, itemKey], true)
      })

      return accumulator
    }, result)
  },
  {
    isSerialized: true,
    maxSize: 500,
  }
)

const calculateDimensionThemes = (theme, options) => {
  if (isEmpty(options.dimensions)) return {}

  return Object.entries(options.dimensions).reduce(
    (accumulator, [key, value]) => {
      const [, dimension] = isMultiKey(value)

      const helper = options[key]

      if (Array.isArray(helper) && helper.length > 0) {
        // eslint-disable-next-line no-param-reassign
        accumulator[dimension] = calculateChainOptions(helper, [
          theme,
          config.css,
        ])
      }

      return accumulator
    },
    {}
  )
}

type UseTheme = <T extends Record<string, unknown>>({
  theme,
  options,
}: {
  theme: T
  options: Configuration
}) => __ROCKETSTYLE__

const useTheme: UseTheme = ({ theme, options }) => {
  const themes = calculateDimensionThemes(theme, options)
  const { keysMap, keywords } = calculateDimensionsMap({
    themes,
    useBooleans: options.useBooleans,
  })

  // define empty objects so they can be reassigned later
  // eslint-disable-next-line no-underscore-dangle
  const __ROCKETSTYLE__ = {
    dimensions: keysMap,
    reservedPropNames: keywords,
    baseTheme: calculateChainOptions(options.theme, [theme, config.css]),
    themes,
  }

  return __ROCKETSTYLE__
}

export default useTheme
