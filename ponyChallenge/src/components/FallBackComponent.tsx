import * as React from 'react';
import styled from 'styled-components';
import { FallbackProps } from 'react-error-boundary';
// Material UI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const ErrorPaper = styled(({ ...materialUIProps }) => (
  <Paper {...materialUIProps} />
))`
  align-items: center;
  display: flex;
  font-weight: bold;
  text-align: center;
`;

export const logError = (error: Error, info: {
  componentStack: string;
}): void => {
  // Add logger here
  console.log(error);
  console.log(info);
};

export const ErrorFallback: React.ComponentType<FallbackProps> = (props: FallbackProps) => {
  const { error } = props;
  const errorMsg = `Error: ${error?.message}.`;
  const buttonLabel = 'Reload';

  const reload = () => window.location.reload();

  return (
    <ErrorPaper>
      <Grid
        container
        wrap="wrap"
        alignItems="center"
        alignContent="center"
      >
        <Grid
          item
          xs={12}
        >
          {errorMsg}
        </Grid>
        <Grid
          item
          xs={12}
        >
          <Button
            color="primary"
            variant="contained"
            onPointerDown={reload}
            size="small"
          >
            {buttonLabel}
          </Button>
        </Grid>
      </Grid>
    </ErrorPaper>
  );
};