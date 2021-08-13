import { FC, useEffect, useState } from 'react';
import styles from './SkillSection.module.scss';
import { SkillType } from '../types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useCharacterContext } from 'src/contexts/CharacterContext';
import clsx from 'clsx';

type SkillMap = {
  1: SkillType[];
  2: SkillType[];
  3: SkillType[];
  4: SkillType[];
  5: SkillType[];
}

const SkillSection: FC<{ skills: SkillType[] }> = (props) => {
  const { isAddingVersion, setCharacterVersionProperty } = useCharacterContext();
  const [skillsMap, setSkillsMap] = useState<SkillMap>({ 1: [], 2: [], 3: [], 4: [], 5: [] });

  useEffect(() => {
    const newSkillMap = props.skills.reduce<SkillMap>((acc, s) => ({
      ...acc, 
      [s.skillLevel]: [ ...acc[s.skillLevel  as keyof SkillMap], s ]
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
            <Droppable droppableId={k}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef} 
                  className={clsx(
                    styles['skill-section--row--skill-container'], 
                    isAddingVersion && styles['skill-section--row--skill-container-edit']
                  )}
                >
                  {skillsMap[k as unknown as keyof SkillMap].map((s, ind) => 
                    <Draggable key={s.skillId} draggableId={s.skillId + ''} index={ind} isDragDisabled={!isAddingVersion}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef} 
                          className={clsx(
                            styles['skill-section--row--skill'],
                            isAddingVersion && styles['skill-section--row--skill-edit']
                          )}
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps} 
                        >
                          {s.name}
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
      </div>
    </DragDropContext>
  );
}

export default SkillSection;