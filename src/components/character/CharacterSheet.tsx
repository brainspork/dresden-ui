import { Grid } from '@material-ui/core';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import styles from './CharacterSheet.module.scss';
import ConsequenceSection from './consequences/ConsequenceSection';
import SkillSection from './skills/SkillSection';
import StressSection from './stress/StressSection';
import StuntSection from './stunts/StuntSection';
import { CharacterType } from './types';

const CharacterSheet: FC = (_) => {
  const [character, setCharacter] = useState<CharacterType>();

  useEffect(() => {
    fetch('https://localhost:44391/api/character/1')
      .then(res => res.json())
      .then(res => setCharacter(res));
  }, []);

  return (
    <>
      {character &&
        <div className={styles['character']}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className={clsx('character-section', styles['character--header'])}>
                <div className={styles['character--header-group']}>
                  <span className={styles['character--header-label']}>Character:</span>
                  <p>{character.name}</p>
                </div>
                <div className={styles['character--header-group']}>
                  <span className={styles['character--header-label']}>FP:</span>
                  <p>{character.baseRefresh + character.stunts.map(s => s.cost).reduce((a, b) => a + b)}</p>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <SkillSection skills={character.skills} />
            </Grid>
            <Grid item xs={4}>
              <StressSection
                physicalStressBoxes={character.physicalStressBoxes}
                physicalStressTaken={character.physicalStressTaken}
                mentalStressBoxes={character.mentalStressBoxes}
                mentalStressTaken={character.mentalStressTaken}
                socialStressBoxes={character.socialStressBoxes}
                socialStressTaken={character.socialStressTaken}
              />
            </Grid>
            <Grid item xs={4}>
              <ConsequenceSection consequences={character.consequences} />
            </Grid>
            <Grid item xs={6}>
              <StuntSection stunts={character.stunts} />
            </Grid>
            <Grid item xs={6}>
              <div className='character-section'>
                <h4>Notes</h4>
                <p>{character.notes}</p>
              </div>
            </Grid>
          </Grid>
        </div>
      }
    </>
  );
}

export default CharacterSheet;