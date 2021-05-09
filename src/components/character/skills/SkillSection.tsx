import { FC, useEffect, useState } from 'react';
import styles from './SkillSection.module.scss';
import { SkillType } from '../types';

type SkillMap = {
  1: SkillType[];
  2: SkillType[];
  3: SkillType[];
  4: SkillType[];
  5: SkillType[];
}

const SkillBoxRow: FC<{ title: string, skills: SkillType[]}> = (props) => (
  <div className={styles['skill-section--row']}>
    <h5 className={styles['skill-section--row--title']}>{props.title}:</h5>
    <div className={styles['skill-section--row--skill-container']}>
      {props.skills.map((s, i) => (
        <p key={i} className={styles['skill-section--row--skill']}>
          {s.name}
        </p>
      ))}
    </div>
  </div>
);

const SkillSection: FC<{ skills: SkillType[] }> = (props) => {
  const [skillsMap, setSkillsMap] = useState<SkillMap>({ 1: [], 2: [], 3: [], 4: [], 5: [] });

  useEffect(() => {
    const map: SkillMap = { 1: [], 2: [], 3: [], 4: [], 5: [] };

    props.skills.forEach(s => map[s.skillLevel as keyof SkillMap].push(s));

    setSkillsMap(map);
  }, [props.skills]);

  return (
    <div className='character-section'>
      <h4>Skills</h4>
      <SkillBoxRow title="+5" skills={skillsMap[5]} />
      <SkillBoxRow title="+4" skills={skillsMap[4]} />
      <SkillBoxRow title="+3" skills={skillsMap[3]} />
      <SkillBoxRow title="+2" skills={skillsMap[2]} />
      <SkillBoxRow title="+1" skills={skillsMap[1]} />
    </div>
  );
}

export default SkillSection;