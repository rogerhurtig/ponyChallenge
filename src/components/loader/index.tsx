import * as React from 'react';
import { Grid } from 'react-loader-spinner';

type Props = {
  color?: string;
  width?: string;
  height?: string;
}

const Loader: React.FunctionComponent<Props> = ({height, width, color}) => (
  <Grid
    color={color || '#00BFFF'}
    height={height ?? 100}
    width={width ?? 100}
  />
);

export default Loader;