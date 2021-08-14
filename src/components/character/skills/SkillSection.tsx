import { FC, useEffect, useState } from 'react';
import styles from './SkillSection.module.scss';
import { SkillInfoType, SkillType } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useCharacterContext } from 'src/contexts/CharacterContext';
import clsx from 'clsx';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Close } from '@material-ui/icons';

type SkillMap = {
  1: SkillType[];
  2: SkillType[];
  3: SkillType[];
  4: SkillType[];
  5: SkillType[];
}

const SkillList: FC<{ skills: SkillType[] }> = (props) => {
  const { setCharacterVersionProperty } = useCharacterContext();
  const [allSkills, setAllSkills] = useState<SkillInfoType[]>();
  const [availableSkills, setAvailableSkills] = useState<SkillInfoType[]>();
  const [selectValue] = useState('');

  useEffect(() => {
    if (!allSkills) {
      fetch('https://localhost:44391/api/skill')
        .then(res => res.json())
        .then((res: SkillInfoType[]) => setAllSkills(res));
    }
  }, [allSkills]);

  useEffect(() => {
    if (allSkills) {
      const nextSkills = allSkills.filter(s => props.skills.findIndex(us => us.skillId === s.id) === -1);
      setAvailableSkills(nextSkills);
    }
  }, [props.skills, allSkills]);

  const onChange = (e: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
    e.preventDefault();
    const value = JSON.parse(e.target.value as string) as { id: number, name: string };

    setCharacterVersionProperty('skills', [...props.skills, { skillId: value.id, name: value.name, skillLevel: 1 }]);
  }

  return (
    <>
      {availableSkills && (
        <FormControl style={{width: '100%'}}>
          <InputLabel>Add Skill</InputLabel>
          <Select onChange={onChange} value={selectValue} disabled={availableSkills.length <= 0}>
            {availableSkills.map((s, i) => <MenuItem key={i} value={JSON.stringify({id: s.id, name: s.name})}>{s.name}</MenuItem>)}
          </Select>
        </FormControl>
      )}
    </>
  );
}

const SkillSection: FC<{ skills: SkillType[] }> = (props) => {
  const { isAddingVersion, setCharacterVersionProperty } = useCharacterContext();
  const [skillsMap, setSkillsMap] = useState<SkillMap>({ 1: [], 2: [], 3: [], 4: [], 5: [] });

  useEffect(() => {
    const newSkillMap = props.skills.reduce<SkillMap>((acc, s) => ({
      ...acc, 
      [s.skillLevel]: [ ...acc[s.skillLevel as keyof SkillMap], s ]
    })
    , { 1: [], 2: [], 3: [], 4: [], 5: [] });

    setSkillsMap(newSkillMap);
  }, [props.skills]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    if (!destination || destination.droppableId === source.droppableId) {
      return;
    }

    const newSkillArray = [ ...props.skills ];
    const skillIndex = newSkillArray.findIndex(s => s.skillId === parseInt(draggableId));
    
    if (skillIndex > -1) {
      newSkillArray[skillIndex].skillLevel = parseInt(destination.droppableId);
      newSkillArray.push(newSkillArray.splice(skillIndex, 1)[0]);
    }

    setCharacterVersionProperty('skills', newSkillArray);
  }

  const removeSkill = (id: number) => {
    const newSkillArray = [ ...props.skills ];
    const skillIndex = newSkillArray.findIndex(s => s.skillId === id);

    if (skillIndex > -1) {
      newSkillArray.splice(skillIndex, 1);
    }

    setCharacterVersionProperty('skills', newSkillArray);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='character-section'>
        <h4>Skills</h4>
        {Object.keys(skillsMap).reverse().map((k, i) => (
          <div key={i} className={styles['skill-section--row']}>
            <h5 className={styles['skill-section--row--title']}>{'+' + k}</h5>
            <Droppable droppableId={k} direction='horizontal'>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef}
                  className={clsx(
                    styles['skill-section--row--skill-container'], 
                    isAddingVersion && styles['skill-section--row--skill-container-edit'],
                    snapshot.isDraggingOver && styles['skill-section--row--skill-container-hover'],
                  )}
                >
                  {skillsMap[k as unknown as keyof SkillMap].map((s, ind) => 
                    <Draggable key={s.skillId} draggableId={s.skillId + ''} index={ind} isDragDisabled={!isAddingVersion}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef} 
                          className={clsx(
                            styles['skill-section--row--skill'],
                            isAddingVersion && styles['skill-section--row--skill-edit'],
                          )}
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps} 
                        >
                          {s.name}
                          {isAddingVersion && <Close className={styles['skill-section--row--remove']} fontSize='small' onClick={() => removeSkill(s.skillId)} />}
                        </div>
                      )}
                    </Draggable>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
        {isAddingVersion && <SkillList skills={props.skills} />}
      </div>
    </DragDropContext>
  );
}

export default SkillSection;