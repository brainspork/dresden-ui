import { FC } from 'react';
import { StuntType } from '../types';
import styles from './StuntSection.module.scss';

const StuntSection: FC<{ stunts: StuntType[] }> = (props) => {

  return (
    <div className='character-section'>
      <h4 className='character-section--title'>Stunts &amp; Powers</h4>
      {props.stunts.map((s, i) =>
        <div key={i} className={styles['stunt-section--stunt']}>
          <div className={styles['stunt-section--stunt-name']}>{s.name}</div>
          <div>{s.description}</div>
          {s.notes &&
            <div className={styles['stunt-section--notes']}>
              <h6 className={styles['stunt-section--note-title']}>Notes</h6>
              <div>{s.notes}</div>
            </div>
          }
        </div>
      )}
    </div>
  );
}

export default StuntSection;