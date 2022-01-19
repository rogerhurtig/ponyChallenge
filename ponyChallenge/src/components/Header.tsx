import * as React from 'react';
// Components
import LittlePonyImg from '../img/littlePony.png';
import { StoreContext, GameSettingActionType, MazeIdActionType } from './store';
// Material UI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

type Props = {
  header: string;
}

const Header: React.FunctionComponent<Props> = ({header}) => {
  const [, dispatch] = React.useContext(StoreContext);

  const onGameOver = () => {
    if (dispatch) {
      dispatch({type: MazeIdActionType.Delete});
      dispatch({type: GameSettingActionType.Delete});
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{backgroundColor: 'var(--myLittlePony-pink)'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="sleeping-pony"
            sx={{ mr: 2 }}
            onPointerDown={onGameOver}
          >
            <img
              src={LittlePonyImg as string}
              alt="My little pony in a maze"
              style={{height: '40px', width: '40px'}}
            />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, padding: '0px 24px 0px 24px' }}
          >
            {header}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;