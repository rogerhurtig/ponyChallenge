import * as React from 'react';
import Select from 'react-select';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// Components
import { StoreContext, GameSettingActionType } from '../store';
// Styled Elements
import { Label, TextDiv } from '../styledElements/index';
// Models
import { IStartGame } from '../../services/models/StartGame';
// Entities
import { PonyCharacter } from '../../services/entities/PonyCharacter';
// Material UI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';

interface IGameSettings {
  difficulty: number;
  mazeSize: {label: string; value: number; };
  character: {label: string; value: string; };
}

const schema = yup.object({
  difficulty: yup.number().min(0).max(10).required(),
  mazeSize: yup.object({label: yup.string(), value: yup.number().required('Please select maze size')}).required(),
  character: yup.object({label: yup.string(), value: yup.string().required('Please select pony')}).required()
}).required();

type Props = {
  startGame: (gameSettings: IStartGame) => void;
}

const GameSettings: React.FunctionComponent<Props> = ({startGame}) => {
  const [, dispatch] = React.useContext(StoreContext);
  const { control, handleSubmit, formState: { errors } } = useForm<IGameSettings>({
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<IGameSettings> = ({difficulty, mazeSize, character}) => {
    const payload: IStartGame = {
      difficulty,
      'maze-width': mazeSize.value,
      'maze-height': mazeSize.value,
      'maze-player-name': character.value
    }

    // Set chosen game settings in global state
    if (dispatch)
      dispatch({type: GameSettingActionType.Add, value: payload});

    startGame(payload);
  };

  const mazeSizeOptions = [
    {value: 15, label: 'Small'},
    {value: 20, label: 'Medium'},
    {value: 25, label: 'Large'}
  ];

  const characterOptions = Object.keys(PonyCharacter)
    .filter(key => !(parseInt(key) >= 0))
    .map((key: string) => ({
      value: key,
      label: key
    }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        item
        xs={12}
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        key="form-container"
        direction="column"
      >
        <Label id="select-difficulty-label">
          Select difficulty
        </Label>
        <Controller
          name="difficulty"
          control={control}
          defaultValue={0}
          render={({ field }) => <Grid
            container
            item
            xs={12}
            alignContent="center"
            alignItems="center"
            justifyContent="center"
            key="slider-container"
            direction="row"
            wrap="wrap"
          > 
            <TextDiv style={{paddingRight: '10px'}}>Easy</TextDiv>
            <Slider
              {...field}
              defaultValue={0}
              min={0}
              max={10}
              aria-labelledby="select-difficulty-label"
              aria-label="Select difficulty slider"
              style={{width: '60%', color: 'var(--myLittlePony-pink)'}}
            />
            <TextDiv style={{paddingLeft: '10px'}}>Hard</TextDiv>
          </Grid>}
        />
        &nbsp;
        <Label id="select-maze-label" htmlFor="select-maze-size">
          Select maze size
        </Label>
        <Controller
          name="mazeSize"
          control={control}
          render={({ field }) => <Select
            aria-labelledby="select-maze-label"
            inputId="select-maze-size"
            styles={{container: (provided) => ({...provided, width: 220})}}
            {...field} 
            options={mazeSizeOptions}
          />}
        />
        <p style={{color: '#d32f2f'}}>{errors.mazeSize?.value?.message}</p>
        <Label id="select-character-label" htmlFor="select-character-size">
          Select pony
        </Label>
        <Controller
          name="character"
          control={control}
          render={({ field }) => <Select
            aria-labelledby="select-character-label"
            inputId="select-character-size"
            styles={{container: (provided) => ({...provided, width: 220})}}
            {...field} 
            options={characterOptions}
          />}
        />
        <p style={{color: '#d32f2f'}}>{errors.character?.value?.message}</p>
        <Button
          color="secondary"
          variant="contained"
          type="submit"
        >
          Start Game
        </Button>
      </Grid>
    </form>
  );
}

export default GameSettings;