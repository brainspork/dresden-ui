import { Grid } from '@material-ui/core';
import { FC, useEffect, useState } from 'react';
import styles from './Character.module.scss';
import SkillBox from './skills/SkillBox';
import { CharacterType } from './types';

const Character: FC = (props) => {
  const [character, setCharacter] = useState<CharacterType>();

  useEffect(() => {
    fetch('https://localhost:44391/api/character/1')
      .then(res => res.json())
      .then(res => setCharacter(res));
  }, []);

  return (
    <>
      {character &&
        (
          <div className={styles.character}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <div className={styles['character--header']}>
                  <div>
                    <span className={styles['character--header-label']}>Character</span>
                    <p>{character.name}</p>
                  </div>
                  <div>
                    <span className={styles['character--header-label']}>FP</span>
                    <p>{character.baseRefresh + character.stunts.map(s => s.cost).reduce((a, b) => a + b)}</p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <SkillBox skills={character.skills} />
              </Grid>
            </Grid>
          </div>
        )
      }
    </>
  );
}

export default Character;