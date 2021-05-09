import clsx from 'clsx';
import { FC } from 'react';
import styles from './StressContainer.module.scss';

enum StressFlag {
  ONE = 1,
  TWO = 2,
  THREE = 4,
  FOUR = 8,
  FIVE = 16,
  SIX = 32,
  SEVEN = 64,
  EIGHT = 128
}

type StressContainerProps = {
  physicalStressBoxes: number,
  physicalStressTaken?: number,
  mentalStressBoxes: number,
  mentalStressTaken?: number,
  socialStressBoxes: number,
  socialStressTaken?: number
};

const StressBox: FC<{ stressFlag: StressFlag, totalStress: number, takenStress: number }> = (props) => {
  const { takenStress, totalStress, stressFlag } = props;

  return <div className={clsx(
    styles['stress-box'],
    !(totalStress & stressFlag) && styles['stress-box--disabled'],
    (takenStress & stressFlag) && styles['stress-box--taken']
  )}></div>
}

const StressTrack: FC<{ totalStress: number, takenStress?: number, trackTitle: string }> = (props) => {
  const stress = { totalStress: props.totalStress, takenStress: props.takenStress || 0 };

  return (
    <div className={styles['stress-track']}>
      <div className={styles['stress-track--title']}>{props.trackTitle}</div>
      <div className={styles['stress-track--boxes']}>
        <StressBox {...{ ...stress, stressFlag: StressFlag.ONE }} />
        <StressBox {...{ ...stress, stressFlag: StressFlag.TWO }} />
        <StressBox {...{ ...stress, stressFlag: StressFlag.THREE }} />
        <StressBox {...{ ...stress, stressFlag: StressFlag.FOUR }} />
        <StressBox {...{ ...stress, stressFlag: StressFlag.FIVE }} />
        <StressBox {...{ ...stress, stressFlag: StressFlag.SIX }} />
        <StressBox {...{ ...stress, stressFlag: StressFlag.SEVEN }} />
        <StressBox {...{ ...stress, stressFlag: StressFlag.EIGHT }} />
      </div>
    </div>
  );
}

const StressSection: FC<StressContainerProps> = (props) => {

  return (
    <div className={styles['stress-section']}>
      <h5 className={styles['stress-section--title']}>Stress</h5>
      <StressTrack trackTitle='Physical' totalStress={props.physicalStressBoxes} takenStress={props.physicalStressTaken} />
      <StressTrack trackTitle='Mental' totalStress={props.mentalStressBoxes} takenStress={props.mentalStressTaken} />
      <StressTrack trackTitle='Social' totalStress={props.socialStressBoxes} takenStress={props.socialStressTaken} />
    </div>
  );
}

export default StressSection;