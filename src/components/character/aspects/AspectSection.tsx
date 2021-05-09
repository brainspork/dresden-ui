import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { AspectEnum, AspectType, TemporaryAspectType } from '../types';
import styles from './AspectSection.module.scss';

type AspectBreakdown = {
  highConcept: AspectType[];
  trouble: AspectType[];
  otherAspect: AspectType[];
}

const AspectGroup: FC<{ aspects: AspectType[], title: string }> = (props) => (
  <div className={styles['aspect-group']}>
    <h5>{props.title}</h5>
    {!props.aspects.length && <p className={clsx(styles['aspect-group--none'], styles['aspect-group--item'])}>(none)</p>}
    {props.aspects.map((a, i) => <p key={i} className={styles['aspect-group--item']}>{a.name}</p>)}
  </div>
);

const AspectSection: FC<{ aspects: AspectType[], tempAspects: TemporaryAspectType[] }> = (props) => {
  const [aspectBreakdown, setAspectBreakdown] = useState<AspectBreakdown>({ highConcept: [], trouble: [], otherAspect: [] });

  useEffect(() => {
    setAspectBreakdown({
      highConcept: props.aspects.filter(a => a.aspectType === AspectEnum.HIGH_CONCEPT),
      trouble: props.aspects.filter(a => a.aspectType === AspectEnum.TROUBLE),
      otherAspect: props.aspects.filter(a => a.aspectType === AspectEnum.OTHER)
    });
  }, [props.aspects]);

  return (
    <div className='character-section'>
      <h4>Aspects</h4>
      <AspectGroup title='High Concept' aspects={aspectBreakdown.highConcept} />
      <AspectGroup title='Trouble' aspects={aspectBreakdown.trouble} />
      <AspectGroup title='Other Aspects' aspects={aspectBreakdown.otherAspect} />
      <AspectGroup title='Temporary Aspects' aspects={props.tempAspects.map(a => ({ name: a.name, aspectType: AspectEnum.OTHER }))} />
    </div>
  );
}

export default AspectSection;