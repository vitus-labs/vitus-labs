// @ts-nocheck
/* eslint-disable no-underscore-dangle */
import React, { forwardRef, useEffect, useMemo, useContext } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { config, omit, pick, compose } from '@vitus-labs/core'
import { useTheme, useThemeOptions } from '~/hooks'
import {
  localContext,
  // hocForwardRef,
  createProvider,
  calculateAttrsHoc,
} from '~/internal'
import {
  calculateTheme,
  calculateThemeVariant,
  themeModeCb,
} from '~/utils/theme'
import { calculateStyles } from '~/utils/styles'
import { chainOptions } from '~/utils/collection'
import {
  pickStyledProps,
  // calculateChainOptions,
  calculateStylingAttrs,
} from '~/utils/attrs'
import {
  PSEUDO_KEYS,
  CONFIG_KEYS,
  STYLING_KEYS,
  STATIC_KEYS,
} from '~/constants'

import type { RocketComponent, StyleComponent, Configuration } from '~/types'

// --------------------------------------------------------
// styledComponent helpers for chaining attributes
// --------------------------------------------------------
type OrOptions = (
  keys: Readonly<Array<string>>,
  opts: Record<string, unknown>,
  defaultOpts: Record<string, unknown>
) => Record<string, unknown>
const orOptions: OrOptions = (keys, opts, defaultOpts) =>
  keys.reduce(
    (acc, item) => ({ ...acc, [item]: opts[item] || defaultOpts[item] }),
    {}
  )

const chainReservedOptions = (keys, opts, defaultOpts) =>
  keys.reduce(
    (acc, item) => ({
      ...acc,
      [item]: chainOptions(opts[item], defaultOpts[item]),
    }),
    {}
  )

// --------------------------------------------------------
// helpers for create statics on class
// --------------------------------------------------------
const createStaticsEnhancers = ({ context, dimensionKeys, func, opts }) => {
  dimensionKeys.forEach((item) => {
    // eslint-disable-next-line no-param-reassign
    context[item] = (props) => func({ [item]: props }, opts)
  })
}

// --------------------------------------------------------
// cloneAndEnhance
// helper function which allows function chaining
// always returns styleComponent with static functions
// assigned
// --------------------------------------------------------
type CloneAndEnhance = <A extends Configuration, B extends Configuration>(
  opts: A,
  defaultOpts: B
) => ReturnType<typeof styleComponent>

const cloneAndEnhance: CloneAndEnhance = (opts, defaultOpts) =>
  styleComponent({
    ...defaultOpts,
    compose: { ...defaultOpts.compose, ...opts.compose },
    ...orOptions(CONFIG_KEYS, opts, defaultOpts),
    ...chainReservedOptions(
      [...defaultOpts.dimensionKeys, ...STYLING_KEYS],
      opts,
      defaultOpts
    ),
  })

// --------------------------------------------------------
// styleComponent
// helper function which allows function chaining
// always returns a valid React component with static functions
// assigned, so it can be even rendered as a valid component
// or styles can be extended via its statics
// --------------------------------------------------------
const styleComponent: StyleComponent = (options) => {
  const { component, styles } = options
  const { styled } = config

  // const _calculateChainOptions = calculateChainOptions(options.attrs)
  const _calculateStylingAttrs = calculateStylingAttrs({
    multiKeys: options.multiKeys,
    useBooleans: options.useBooleans,
  })

  const componentName =
    options.name || options.component.displayName || options.component.name

  // create styled component with all options.styles if available
  const STYLED_COMPONENT = component.IS_ROCKETSTYLE
    ? component
    : styled(component)`
        ${calculateStyles(styles, config.css)}
      `

  // --------------------------------------------------------
  // final component to be rendered
  // --------------------------------------------------------
  const RenderComponent = options.provider
    ? createProvider(STYLED_COMPONENT)
    : STYLED_COMPONENT

  // --------------------------------------------------------
  // hocs
  // --------------------------------------------------------
  const composeFuncs = Object.values(options.compose || {})
    .filter((item) => typeof item === 'function')
    .reverse()

  const HAS_COMPOSE = composeFuncs.length > 0

  // --------------------------------------------------------
  // ENHANCED COMPONENT (returned component)
  // --------------------------------------------------------
  const EnhancedComponent: RocketComponent = forwardRef(
    ({ onMount, ...props }, ref) => {
      // --------------------------------------------------
      // hover - focus - pressed state passed via context from parent component
      // --------------------------------------------------
      const rocketstyleCtx = options.consumer ? useContext(localContext) : {}

      // --------------------------------------------------
      // general theme and theme mode dark / light passed in context
      // --------------------------------------------------
      const { theme, mode } = useThemeOptions({
        inversed: options.inversed,
      })

      // --------------------------------------------------
      // calculate themes for all possible styling dimensions
      // .theme(...) + defined dimensions like .states(...), .sizes(...)
      // --------------------------------------------------
      const __ROCKETSTYLE__ = useMemo(
        () =>
          useTheme<typeof theme>({
            theme,
            options,
            cb: themeModeCb,
          }),
        // recalculate this only when theme changes
        [theme]
      )

      const {
        reservedPropNames,
        themes: rocketThemes,
        dimensions,
        baseTheme: rocketBaseTheme,
      } = __ROCKETSTYLE__

      const { baseTheme, themes } = useMemo(
        () =>
          calculateThemeVariant(
            { themes: rocketThemes, baseTheme: rocketBaseTheme },
            mode
          ),
        // recalculate this only when theme mode changes dark / light
        [mode]
      )

      // --------------------------------------------------
      // calculate reserved Keys defined in dimensions as styling keys
      // there is no need to calculate this each time - keys are based on
      // dimensions definitions
      // --------------------------------------------------
      const RESERVED_STYLING_PROPS_KEYS = useMemo(
        () => Object.keys(reservedPropNames),
        []
      )

      // --------------------------------------------------
      // onMount hook
      // if onMount is provided (useful for development tooling or so)
      // it will pass all available styling options in the callback
      // --------------------------------------------------
      useEffect(() => {
        const { multiKeys, dimensionKeys, dimensionValues } = options

        if (onMount) {
          onMount({
            multiKeys,
            dimensionKeys,
            dimensionValues,
            ...__ROCKETSTYLE__,
          })
        }
      }, [theme, mode])

      // --------------------------------------------------
      // .attrs(...)
      // first we need to calculate final props which are
      // being returned by using `attr` chaining method
      // --------------------------------------------------
      // const calculatedAttrs = _calculateChainOptions([
      //   props,
      //   theme,
      //   {
      //     renderContent,
      //     mode,
      //     isDark,
      //     isLight,
      //   },
      // ])

      // --------------------------------------------------
      // get final props which are (latest has the highest priority):
      // (1) merged styling from context,
      // (2) `attrs` chaining method, and from
      // (3) passing them directly to component
      // --------------------------------------------------
      const { pseudo = {}, ...mergeProps }: Record<string, unknown> = {
        ...(options.consumer
          ? options.consumer((callback) => callback(rocketstyleCtx as any))
          : {}),
        // ...calculatedAttrs,
        ...props,
      }

      // --------------------------------------------------
      // rocketstate
      // calculate final component state including pseudo state
      // passed as $rocketstate prop
      // --------------------------------------------------
      const rocketstate: Record<string, unknown> = _calculateStylingAttrs({
        props: pickStyledProps(mergeProps, reservedPropNames),
        dimensions,
      })

      // --------------------------------------------------
      // pseudo state
      // calculate final component pseudo state including pseudo state
      // from props and override by pseudo props from context
      // --------------------------------------------------
      const finalPseudo = {
        ...pick(props, PSEUDO_KEYS),
        ...pseudo,
      }

      // --------------------------------------------------
      // rocketstyle
      // calculated (based on styling props) final theme which will be passed
      // to our styled component
      // passed as $rocketstyle prop
      // --------------------------------------------------
      const rocketstyle = calculateTheme({
        rocketstate,
        themes,
        baseTheme,
      })

      // --------------------------------------------------
      // final props
      // final props passed to WrappedComponent
      // excluding: styling props
      // including: $rocketstyle, $rocketstate
      // --------------------------------------------------
      const finalProps = {
        // this removes styling state from props and passes its state
        // under rocketstate key only
        ...omit(mergeProps, [...RESERVED_STYLING_PROPS_KEYS, ...PSEUDO_KEYS]),
        // if enforced to pass styling props, we pass them directly
        ...(options.passProps ? pick(mergeProps, options.passProps) : {}),
        ref,
        $rocketstyle: rocketstyle,
        $rocketstate: {
          ...rocketstate,
          pseudo: finalPseudo,
        },
      }

      // all the development stuff injected
      if (process.env.NODE_ENV !== 'production') {
        finalProps['data-rocketstyle'] = componentName
      }

      return <RenderComponent {...finalProps} />
    }
  )

  EnhancedComponent.IS_ROCKETSTYLE = true
  EnhancedComponent.displayName = componentName

  // ------------------------------------------------------
  // This will hoist and generate dynamically next static methods
  // for all dimensions available in configuration
  // ------------------------------------------------------

  let FinalComponent = EnhancedComponent

  if (HAS_COMPOSE) {
    FinalComponent = compose(
      ...composeFuncs,
      calculateAttrsHoc(options)
    )(EnhancedComponent)
  } else {
    FinalComponent = compose(calculateAttrsHoc(options))(EnhancedComponent)
  }

  hoistNonReactStatics(FinalComponent, options.component)
  createStaticsEnhancers({
    context: FinalComponent,
    dimensionKeys: [...options.dimensionKeys, ...STATIC_KEYS],
    func: cloneAndEnhance,
    opts: options,
  })
  // ------------------------------------------------------
  FinalComponent.IS_ROCKETSTYLE = true
  FinalComponent.displayName = componentName
  // ------------------------------------------------------

  FinalComponent.config = (opts = {}) => {
    const result = pick(opts, CONFIG_KEYS)

    return cloneAndEnhance(result as any, options) as any
  }

  return FinalComponent as RocketComponent
}

export default styleComponent
