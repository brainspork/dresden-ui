import clsx from 'clsx';
import { FC, useEffect, useMemo, useState } from 'react';
import { useCharacterContext } from 'src/contexts/CharacterContext';
import styles from './StressSection.module.scss';

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

type StressSectionProps = {
  physicalStressBoxes: number,
  physicalStressTaken?: number,
  mentalStressBoxes: number,
  mentalStressTaken?: number,
  socialStressBoxes: number,
  socialStressTaken?: number
};

const StressBox: FC<{ stressFlag: StressFlag, stressTaken: number, isTaken: boolean, isDisabled: boolean, updateStress: (taken: number) => void }> = (props) => {
  const { isTaken, isDisabled, updateStress, stressTaken, stressFlag } = props;

  const toggleStressBox = () => {
    updateStress(isTaken ? stressTaken - stressFlag : stressTaken + stressFlag);
  }
  return (
    <div
      onClick={toggleStressBox}
      className={clsx(
        styles['stress-box'],
        isDisabled && styles['stress-box--disabled'],
        isTaken && styles['stress-box--taken']
      )}
    ></div>
  )
}

const StressTrack: FC<{ totalStress: number, stressTaken?: number, trackTitle: string, updateStress: (taken: number) => void }> = (props) => {
  const { totalStress, stressTaken, trackTitle, updateStress } = props;

  const stressBoxes = useMemo(() =>
    [StressFlag.ONE, StressFlag.TWO, StressFlag.THREE, StressFlag.FOUR, StressFlag.FIVE, StressFlag.SIX, StressFlag.SEVEN, StressFlag.EIGHT]
      .map(f => ({ 
        stressFlag: f,
        stressTaken: stressTaken || 0,
        isTaken: (f & (stressTaken || 0)) !== 0, 
        isDisabled: (f & totalStress) === 0, 
        updateStress: updateStress 
      }))
    , [stressTaken, totalStress]);

  return (
    <div className={styles['stress-track']}>
      <h5 className={styles['stress-track--title']}>{trackTitle}</h5>
      <div className={styles['stress-track--boxes']}>
        {stressBoxes.map((s, i) => <StressBox key={i} {...s} />)}
      </div>
    </div>
  );
}

const StressSection: FC<StressSectionProps> = (props) => {
  const { updateCharacter } = useCharacterContext();
  const [physicalStress, setPhysicalStress] = useState(props.physicalStressTaken);
  const [mentalStress, setMentalStress] = useState(props.mentalStressTaken);
  const [socialStress, setSocicalStress] = useState(props.socialStressTaken);

  useEffect(() => {
    if (
      props.physicalStressTaken !== physicalStress
      || props.mentalStressTaken !== mentalStress
      || props.socialStressTaken !== socialStress
    ) {
      updateCharacter({
        physicalStressTaken: physicalStress,
        mentalStressTaken: mentalStress,
        socialStressTaken: socialStress
      });
    }
  }, [physicalStress, mentalStress, socialStress, props.physicalStressTaken, props.mentalStressTaken, props.socialStressTaken]);

  return (
    <div className='character-section'>
      <h4 className='character-section--title'>Stress</h4>
      <StressTrack trackTitle='Physical' totalStress={props.physicalStressBoxes} stressTaken={physicalStress} updateStress={setPhysicalStress} />
      <StressTrack trackTitle='Mental' totalStress={props.mentalStressBoxes} stressTaken={mentalStress} updateStress={setMentalStress} />
      <StressTrack trackTitle='Social' totalStress={props.socialStressBoxes} stressTaken={socialStress} updateStress={setSocicalStress} />
    </div>
  );
}

export default StressSection;