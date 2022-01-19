import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
// Components
import PonyApiService, { IPonyService } from '../../services/PonyApiService';
import Feedback from '../feedback';
import Game from './Game';
import { ErrorFallback, logError } from '../FallBackComponent';
// Material UI
import Grid from '@mui/material/Grid';
// Server URL
import { PonyChallengeBasicUrl } from '../../Settings';

const Home: React.FunctionComponent = () => {
  const [ponyApiService] = React.useState<IPonyService>(new PonyApiService(PonyChallengeBasicUrl));

  return (
    <Grid
      container
      item
      xs={12}
      alignContent="center"
      alignItems="center"
      justifyContent="flex-start"
      key="loaderConfig"
      direction="column"
    >
      <Game api={ponyApiService} />
      <Feedback subject={ponyApiService.feedbackSubject} />
    </Grid>
  );
};

const HomeWithErrorBoundary = withErrorBoundary(Home, {
  FallbackComponent: ErrorFallback,
  onError(error, componentStack) {
    logError(error, componentStack);
  }
});

export default HomeWithErrorBoundary;