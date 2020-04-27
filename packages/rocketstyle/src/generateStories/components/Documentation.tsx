// @ts-nocheck
import React, { createElement } from 'react'
import { InfoTable, Title, H1, H2, Text } from './styled'
import DimensionOptions from './DimensionOptions'

export default ({
  title,
  state,
  dimensions,
  useBooleans,
  component,
  baseKnobs,
  rocketstyleKnobs,
}) => (
  <InfoTable>
    <Title>{title}</Title>

    {Object.keys(dimensions).map((item) => {
      return (
        <DimensionOptions
          key={item}
          useBooleans={useBooleans}
          dimensionName={item}
          dimensionKey={dimensions[item]}
          options={state.keys[item]}
          component={component}
          baseKnobs={baseKnobs}
        />
      )
    })}

    <H1>Interactive examples</H1>
    <H2>Using key props</H2>
    <Text>
      This is an example using standart key names as props. Use Standard knobs
      for editing this component.
    </Text>
    {createElement(component, {
      ...baseKnobs,
      ...(useBooleans ? rocketstyleKnobs[0] : rocketstyleKnobs),
    })}

    {useBooleans && (
      <>
        <H2>Using boolean props</H2>
        <Text>
          Your component supports using boolean props. This can be edited when
          initializing rocketstyle configuration. Set useBooleans to false if
          you would like to turn it off.
        </Text>
        <Text>
          This is an example using boolean values as props. Use useBoolean knobs
          for editing this component.
        </Text>

        {createElement(component, {
          ...baseKnobs,
          ...(useBooleans ? rocketstyleKnobs[1] : rocketstyleKnobs),
        })}
      </>
    )}

    <H1>Randomly rendered examples:</H1>
  </InfoTable>
)
