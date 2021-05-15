import clsx from 'clsx';
import { FC, useEffect, useMemo, useState } from 'react';
import { useCharacterContext } from 'src/contexts/CharacterContext';
import { StuntType } from '../types';
import { Add, Remove } from '@material-ui/icons';
import styles from './HeaderSection.module.scss';
import { IconButton } from '@material-ui/core';

type HeaderSectionProps = {
  name: string;
  stunts: StuntType[];
  baseRefresh: number;
  refreshUsed?: number;
};

const HeaderSection: FC<HeaderSectionProps> = (props) => {
  const { updateCharacter } = useCharacterContext();
  const [refreshUsed, setRefreshUsed] = useState<number>(props.refreshUsed || 0);
  const stuntRefreshCost = useMemo(() => props.stunts.map(s => s.cost).reduce((a, b) => a + b), [props.stunts, props.baseRefresh]);

  useEffect(() => {
    if (refreshUsed !== props.refreshUsed) {
      updateCharacter({
        refreshUsed: refreshUsed
      });
    }
  }, [refreshUsed, props.refreshUsed]);

  const addPoint = () => setRefreshUsed(refreshUsed - 1);
  const removePoint = () => setRefreshUsed(refreshUsed + 1);

  return (
    <div className={clsx('character-section', styles['character--header'])}>
      <h3>{props.name}</h3>
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
  );
};

export default HeaderSection;