import { IconButton, Input, InputAdornment } from '@material-ui/core';
import { Add, Check } from '@material-ui/icons';
import clsx from 'clsx';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useCharacterContext } from 'src/contexts/CharacterContext';
import { ConsequenceType, StressCategory, StressEnum } from '../types';
import style from './ConsequenceSection.module.scss';

type Consequence = {
  id?: number;
  stressType: StressEnum
  stressCategory: StressCategory
  used: boolean;
  aspect?: string;
}

const ConsequenceSection: FC<{ consequences: ConsequenceType[] }> = (props) => {
  const { updateCharacter } = useCharacterContext();

  const [consequenceList, setConsequenceList] = useState<Consequence[]>([]);
  const [editConsequenceId, setEditConsequenceId] = useState<number>();
  const [aspect, setAspect] = useState<string>();

  useEffect(() => {
    const newConsequenceList = [
      { stressType: StressEnum.MILD, stressCategory: StressCategory.ANY, used: false },
      { stressType: StressEnum.MODERATE, stressCategory: StressCategory.ANY, used: false },
      { stressType: StressEnum.SEVERE, stressCategory: StressCategory.ANY, used: false },
      { stressType: StressEnum.EXTREME, stressCategory: StressCategory.ANY, used: false },
    ].map(cl => {
      const taken = props.consequences.filter(c => c.stressCategory === cl.stressCategory && c.stressType === cl.stressType)[0];

      if (taken) {
        return { ...cl, used: true, aspect: taken.aspect, id: taken.id }
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

  const toggleConsequece = (consequence: Consequence) => {
    if (consequence.used && consequence.id) {
      updateCharacter({ consequences: props.consequences.filter(c => c.id !== consequence.id) })
    } else {
      updateCharacter({ consequences: [ ...props.consequences, { stressCategory: consequence.stressCategory, stressType: consequence.stressType, aspect: consequence.aspect } ] })
    }
  }

  const beginAspectEdit = (id: number) => setEditConsequenceId(id);
  const completeAspectEdit = () => {
    updateCharacter({ consequences: props.consequences.map(c => {
      if (c.id === editConsequenceId) {
        c.aspect = aspect;
        c.id = undefined;
      }

      return c;
    })});

    setEditConsequenceId(undefined);
    setAspect(undefined);
  }

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setAspect(ev.target.value);
  }

  useEffect(() => {
    if (editConsequenceId) {
      setAspect(props.consequences.filter(c => c.id === editConsequenceId)[0]?.aspect);
    }
  }, [editConsequenceId, props.consequences]);

  return (
    <div className='character-section'>
      <h4>Consequences</h4>
      <div className={style['consequence-section--content-row']}>
        <h5 className={style['consequence-section--content-row-type']}>Type</h5>
        <h5>Used?</h5>
        <h5 className={style['consequence-section--content-row-aspect']}>Aspect</h5>
      </div>
      {consequenceList.map((c, i) =>
        <div key={i} className={style['consequence-section--content-row']}>
          <div className={style['consequence-section--content-row-type']}>{getStressTypeTitle(c.stressType)}</div>
          <div
            onClick={() => toggleConsequece(c)}
            className={clsx(
              style['consequence-section--content-row-taken'],
              c.used && style['consequence-taken']
            )}
          ></div>
          <div className={style['consequence-section--content-row-aspect']}>
            {!c.aspect && c.used && c.id && !(editConsequenceId === c.id) && <div onClick={() => beginAspectEdit(c.id!)}><Add /></div>}
            {!c.aspect && c.used && c.id && editConsequenceId === c.id && 
              <div>
                <Input 
                  placeholder='Aspect' 
                  value={aspect} 
                  onChange={onChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <div onClick={completeAspectEdit}>
                        <Check />
                      </div>
                    </InputAdornment>
                  }
                />
              </div>
            }
            {c.aspect}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsequenceSection;