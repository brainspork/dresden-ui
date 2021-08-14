import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';
import { useCharacterContext } from 'src/contexts/CharacterContext';
import { StuntType } from '../types';
import { Add, Cancel, Done, Edit, Remove } from '@material-ui/icons';
import styles from './HeaderSection.module.scss';
import { IconButton } from '@material-ui/core';

type HeaderSectionProps = {
  name: string;
  stunts: StuntType[];
  baseRefresh: number;
  refreshUsed?: number;
};

const HeaderSection: FC<HeaderSectionProps> = (props) => {
  const { isAddingVersion, updateCharacter, beginVersionAdd, cancelVersionAdd, saveVersionChanges, setCharacterVersionProperty } = useCharacterContext();
  const [refreshUsed] = useState<number>(props.refreshUsed || 0);
  const stuntRefreshCost = useMemo(() => props.stunts.map(s => s.cost).reduce((a, b) => a + b, 0), [props.stunts]);

  const addPoint = () => updateCharacter({ refreshUsed: refreshUsed + 1 });
  const removePoint = () => updateCharacter({ refreshUsed: refreshUsed - 1 });

  const addBasePoint = () => setCharacterVersionProperty('baseRefresh', props.baseRefresh + 1)
  const removeBasePoint = () => setCharacterVersionProperty('baseRefresh', props.baseRefresh - 1)

  return (
    <div className={clsx('character-section', styles['character--header'])}>
      <div className={styles['character--header-info']}>
        <h3>{props.name}</h3>
        <div className={styles['character--header-group']}>
          <span className={styles['character--header-label']}>BR:</span>
          {isAddingVersion ? (
            <>
              <IconButton onClick={removeBasePoint}>
                <Remove fontSize='small' />
              </IconButton>
              <p>{props.baseRefresh}</p>
              <IconButton onClick={addBasePoint}>
                <Add fontSize='small' />
              </IconButton>
            </>
          ) : (
            <p>{props.baseRefresh}</p>
          )}
        </div>
        <div className={styles['character--header-group']}>
          <span className={styles['character--header-label']}>RA:</span>
          <p>{stuntRefreshCost}</p>
        </div>
        <div className={styles['character--header-group']}>
          <span className={styles['character--header-label']}>AR:</span>
          <p>{props.baseRefresh + stuntRefreshCost}</p>
        </div>
        <div className={styles['character--header-group']}>
          <span className={styles['character--header-label']}>FP:</span>
          <IconButton onClick={removePoint} disabled={refreshUsed >= props.baseRefresh + stuntRefreshCost}>
            <Remove fontSize='small' />
          </IconButton>
          <p>{props.baseRefresh - refreshUsed + stuntRefreshCost}</p>
          <IconButton onClick={addPoint} disabled={refreshUsed <= 0}>
            <Add fontSize='small' />
          </IconButton>
        </div>

      </div>
      <div className={styles['character--header-actions']}>
        {!isAddingVersion ? (
          <IconButton onClick={beginVersionAdd}>
            <Edit />
          </IconButton>
        ) : (
          <>
            <IconButton onClick={cancelVersionAdd}>
              <Cancel />
            </IconButton>
            <IconButton onClick={saveVersionChanges}>
              <Done />
            </IconButton>
          </>
        )}

      </div>
    </div>
  );
};

export default HeaderSection;