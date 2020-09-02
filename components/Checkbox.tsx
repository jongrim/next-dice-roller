import * as React from 'react';
import { Checkbox as RebassCheckbox } from '@rebass/forms';

export default function Checkbox(props) {
  return (
    <RebassCheckbox
      {...props}
      sx={Object.assign(
        {
          'input:disabled ~ &': {
            color: 'secondary',
          },
          'input:checked ~ &': {
            color: 'secondary',
          },
        },
        props.sx
      )}
    />
  );
}
