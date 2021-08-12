import { IconButton } from '@material-ui/core';
import { Remove, Add } from '@material-ui/icons';
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

const StressBox: FC<{ stressFlag: StressFlag, stressTaken: number, isTaken: boolean, isDisabled: boolean, updateStress: (taken: number) => void, isEditing: boolean }> = (props) => {
  const { isTaken, isDisabled, updateStress, stressTaken, stressFlag, isEditing } = props;

  const toggleStressBox = () => {
    if (!isEditing) {
      updateStress(isTaken ? stressTaken - stressFlag : stressTaken + stressFlag);
    }
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

const StressTrack: FC<{
  totalStress: number,
  stressTaken?: number,
  trackTitle: string,
  isEditing: boolean,
  updateStress: (taken: number) => void,
  updateStressTrack: (stress: number) => void
}> = (props) => {
  const { totalStress, stressTaken, trackTitle, isEditing, updateStress, updateStressTrack } = props;

  const minStressBoxes = 1;
  const maxStressBoxes = 255;

  const stressBoxes = useMemo(() =>
    [StressFlag.ONE, StressFlag.TWO, StressFlag.THREE, StressFlag.FOUR, StressFlag.FIVE, StressFlag.SIX, StressFlag.SEVEN, StressFlag.EIGHT]
      .map(f => ({
        stressFlag: f,
        stressTaken: stressTaken || 0,
        isTaken: (f & (stressTaken || 0)) !== 0,
        isDisabled: (f & totalStress) === 0,
        updateStress: updateStress,
        isEditing
      }))
    , [updateStress, stressTaken, totalStress, isEditing]);

  // find the first disabled (off) bit and toggle it on
  const addStressTrack = () => updateStressTrack(totalStress ^ (1 << (stressBoxes.findIndex(s => s.isDisabled))));

  // find the first disabled (off) bit and toggle it the previous bit off
  const removeStressTrack = () => {
    const index = stressBoxes.findIndex(s => s.isDisabled);
    // if no bits are disabled, turn off the final bit
    updateStressTrack(totalStress ^ (1 << (index > -1 ? index - 1 : 7)));
  }

  return (
    <div className={styles['stress-track']}>
      <h5 className={styles['stress-track--title']}>{trackTitle}</h5>
      <div className={styles['stress-track--row']}>
        <div className={styles['stress-track--boxes']}>
          {stressBoxes.map((s, i) => <StressBox key={i} {...s} />)}
        </div>
        {isEditing && (
          <div>
            <IconButton onClick={removeStressTrack} disabled={totalStress === minStressBoxes}>
              <Remove fontSize='small' />
            </IconButton>
            <IconButton onClick={addStressTrack} disabled={totalStress === maxStressBoxes}>
              <Add fontSize='small' />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}

const StressSection: FC<StressSectionProps> = (props) => {
  const { updateCharacter, setCharacterVersionProperty, isAddingVersion } = useCharacterContext();
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
  }, [updateCharacter, physicalStress, mentalStress, socialStress, props.physicalStressTaken, props.mentalStressTaken, props.socialStressTaken]);

  const updatePhysicalSressTrack = (stress: number) => setCharacterVersionProperty('physicalStressBoxes', stress);
  const updateMentalSressTrack = (stress: number) => setCharacterVersionProperty('mentalStressBoxes', stress);
  const updateSocialSressTrack = (stress: number) => setCharacterVersionProperty('socialStressBoxes', stress);

  return (
    <div className='character-section'>
      <h4 className='character-section--title'>Stress</h4>
      <StressTrack
        trackTitle='Physical'
        totalStress={props.physicalStressBoxes}
        stressTaken={physicalStress}
        updateStress={setPhysicalStress}
        isEditing={isAddingVersion}
        updateStressTrack={updatePhysicalSressTrack}
      />
      <StressTrack
        trackTitle='Mental'
        totalStress={props.mentalStressBoxes}
        stressTaken={mentalStress}
        updateStress={setMentalStress}
        isEditing={isAddingVersion}
        updateStressTrack={updateMentalSressTrack}
      />
      <StressTrack
        trackTitle='Social'
        totalStress={props.socialStressBoxes}
        stressTaken={socialStress}
        updateStress={setSocicalStress}
        isEditing={isAddingVersion}
        updateStressTrack={updateSocialSressTrack}
      />
    </div>
  );
}

export default StressSection;