/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as React from 'react';
// Components
import { StoreContext } from '../../store';
import Loader from '../../loader';

type Args = {
  children?: React.ReactNode;
}

interface Props {
  children?: React.ReactNode;
}

const SvgMap: React.FunctionComponent<Args> = ({children = <></>}: Props) => {
  const [store] = React.useContext(StoreContext);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  // Local CSS state
  const [viewBox, setViewBox] = React.useState({width: 300, height: 300});
  // Constants
  const width = store?.gameSettings?.['maze-width'];

  React.useLayoutEffect(() => {
    if (typeof width != 'number')
      return;

    const mazeWidth = width * width;
    switch(mazeWidth) {
      case 625: return setViewBox({width: 750, height: 750});
      case 400: return setViewBox({width: 500, height: 500});
      case 225: return setViewBox({width: 300, height: 300});
      default:
        // Ignore. There should only be 3 sizes available at this time.
    }
  }, [width])

  if (typeof width != 'number')
    return <Loader />;

  return (
    <svg
      id='pony-challenge-svg-map'
      ref={svgRef}
      style={{
        backgroundColor: 'transparent',
        cursor: 'crosshair',
        maxWidth: '1000px'
      }}
      width="100%"
      height="100%"
      preserveAspectRatio="xMinYMin slice"
      viewBox={`-15 -15 ${viewBox.width} ${viewBox.height}`}
    >
      {children}
    </svg>
  );
};

export default SvgMap;
