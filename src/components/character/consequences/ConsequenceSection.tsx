import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { ConsequenceType, StressCategory, StressEnum } from '../types';
import style from './ConsequenceSection.module.scss';

type Consequence = {
  stressType: StressEnum
  stressCategory: StressCategory
  used: boolean;
  aspect?: string;
}

const ConsequenceSection: FC<{ consequences: ConsequenceType[] }> = (props) => {
  const [consequenceList, setConsequenceList] = useState<Consequence[]>([]);

  useEffect(() => {
    const newConsequenceList = [
      { stressType: StressEnum.MILD, stressCategory: StressCategory.ANY, used: false },
      { stressType: StressEnum.MODERATE, stressCategory: StressCategory.ANY, used: false },
      { stressType: StressEnum.SEVERE, stressCategory: StressCategory.ANY, used: false },
      { stressType: StressEnum.EXTREME, stressCategory: StressCategory.ANY, used: false },
    ].map(cl => {
      const taken = props.consequences.filter(c => c.stressCategory === cl.stressCategory && c.stressType === cl.stressType)[0];

      if (taken) {
        return { ...cl, used: true, aspect: taken.aspect }
      } else {
        return cl;
      }
    });

    setConsequenceList(newConsequenceList.sort((a, b) => a.stressType - b.stressType));
  }, [props.consequences]);

  const getStressTypeTitle = (stressType: StressEnum): string => {
    switch (stressType) {
      case StressEnum.MILD:
        return 'Mild';
      case StressEnum.MODERATE:
        return 'Moderate';
      case StressEnum.SEVERE:
        return 'Severe';
      case StressEnum.EXTREME:
        return 'Extreme';
      default:
        return 'Mild';
    }
  }

  return (
    <div className={style['consequence-section']}>
      <h5 className={style['consequence-section--title']}>Consequences</h5>
      <div className={style['consequence-section--content-row']}>
        <div className={clsx(
          style['consequence-section--content-row-type'],
          style['consequence-section--content-row-title'],
        )}>Type</div>
        <div className={style['consequence-section--content-row-title']}>Used?</div>
        <div className={clsx(
          style['consequence-section--content-row-aspect'],
          style['consequence-section--content-row-title']
        )}>Aspect</div>
      </div>
      {consequenceList.map((c, i) =>
        <div key={i} className={style['consequence-section--content-row']}>
          <div className={style['consequence-section--content-row-type']}>{getStressTypeTitle(c.stressType)}</div>
          <div className={clsx(
            style['consequence-section--content-row-taken'],
            c.used && style['consequence-taken']
          )}></div>
          <div className={style['consequence-section--content-row-aspect']}>{c.aspect}</div>
        </div>
      )}
    </div>
  );
}

export default ConsequenceSection;