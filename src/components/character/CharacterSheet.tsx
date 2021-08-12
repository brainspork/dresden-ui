import { Grid } from '@material-ui/core';
import { FC, useEffect } from 'react';
import { useCharacterContext } from 'src/contexts/CharacterContext';
import AspectSection from './aspects/AspectSection';
import styles from './CharacterSheet.module.scss';
import ConsequenceSection from './consequences/ConsequenceSection';
import HeaderSection from './header/HeaderSection';
import SkillSection from './skills/SkillSection';
import StressSection from './stress/StressSection';
import StuntSection from './stunts/StuntSection';

const CharacterSheet: FC = (_) => {
  const { character, characterVersionChanges, setCharacterId } = useCharacterContext();

  useEffect(() => {
    setCharacterId(1);
  }, [setCharacterId]);

  return (
    <>
      {character &&
        <div className={styles['character']}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <HeaderSection name={character.name} baseRefresh={character.baseRefresh} refreshUsed={character.refreshUsed} stunts={character.stunts} />
            </Grid>
            <Grid item xs={4}>
              <SkillSection skills={character.skills} />
            </Grid>
            <Grid item xs={4}>
              <StressSection
                physicalStressBoxes={characterVersionChanges?.physicalStressBoxes || character.physicalStressBoxes}
                physicalStressTaken={character.physicalStressTaken}
                mentalStressBoxes={characterVersionChanges?.mentalStressBoxes || character.mentalStressBoxes}
                mentalStressTaken={character.mentalStressTaken}
                socialStressBoxes={characterVersionChanges?.socialStressBoxes || character.socialStressBoxes}
                socialStressTaken={character.socialStressTaken}
              />
            </Grid>
            <Grid item xs={4}>
              <ConsequenceSection consequences={character.consequences} />
            </Grid>
            <Grid item xs={5}>
              <StuntSection stunts={character.stunts} />
            </Grid>
            <Grid item xs={3}>
              <AspectSection aspects={character.aspects} tempAspects={character.temporaryAspects} />
            </Grid>
            <Grid item xs={4}>
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