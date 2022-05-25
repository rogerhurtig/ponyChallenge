import * as React from 'react';
// Components
import PonyChallenge from './components/ponyChallenge';
import Header from './components/Header';
// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const Grid = styled(Box)({
  margin: 0,
  padding: 0,
  height: '100vh',
  display: 'grid',
  gridTemplateColumns: 'auto',
  gridTemplateRows: '4em auto',
  gridTemplateAreas: `
    'header'
    'center'
  `,
});

const GridHeader = styled(Header)({
  gridArea: 'header',
  zIndex: 100,
});

const GridCenter = styled(Box)({
  gridArea: 'center',
  zIndex: 1,
  overflow: 'hidden',
  position: 'relative',
});

const App: React.FunctionComponent = () => {
  return (
    <Grid>
      <GridHeader header={'Pony Challenge'} />
      <GridCenter>
        <PonyChallenge />
      </GridCenter>
  </Grid>
  );
}

export default App;
