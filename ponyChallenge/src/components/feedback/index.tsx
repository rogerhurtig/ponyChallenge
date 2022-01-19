import * as React from 'react';
// Models
import { IResponseInfo } from '../../api/models/ResponseInfo';
import { Subject } from 'rxjs';
// Material UI
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {
  subject: Subject<IResponseInfo>;
}

const Feedback: React.FunctionComponent<Props> = ({subject}) => {
  // Local state
  const [alert, setAlert] = React.useState<IResponseInfo | undefined>();

  React.useEffect(() => {
    const sub = subject.subscribe(alert => setAlert(alert));
    return () => sub.unsubscribe();
  })

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert(undefined);
  };

  if (!alert)
    return null;

  return (
    <Snackbar
      open={alert != undefined}
      autoHideDuration={alert?.duration ?? 3000}
      onClose={handleClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      style={{zIndex: 24000}}
    >
      <Alert onClose={handleClose} severity={alert.type}>
        {`${alert.title}: ${alert.text}`}
      </Alert>
    </Snackbar>
  );
}

export default Feedback;