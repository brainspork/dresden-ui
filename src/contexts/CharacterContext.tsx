import { useCallback } from 'react';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { CharacterPatch, CharacterType, CharacterVersion } from 'src/components/character/types';
import { useUserContext } from './UserContext';

type CharacterContextType = {
  character?: CharacterType;
  characterId?: number;
  canEdit?: boolean;
  characterVersionChanges?: CharacterVersion;
  isAddingVersion: boolean;
  beginVersionAdd: () => void;
  setCharacterId: (characterId?: number) => void;
  updateCharacter: (changedValues: Partial<CharacterPatch>) => void;
  setCharacterVersionProperty: <T extends keyof CharacterVersion>(property: T, value: CharacterVersion[T]) => void;
  cancelVersionAdd: () => void;
  saveVersionChanges: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const useCharacterContext = () => {
  const ctx = useContext(CharacterContext);

  if (!ctx) {
    throw new Error('app must be wrapped in a CharacterContextProvider');
  }

  return ctx;
}

const CharacterContextProvider: FC = (props) => {
  const { user } = useUserContext();
  const [characterId, setCharacterId] = useState<number>();
  const [character, setCharacter] = useState<CharacterType>();
  const [canEdit, setCanEdit] = useState<boolean>();
  const [isAddingVersion, setIsAddingVersion] = useState<boolean>(false);
  const [characterVersionChanges, setCharacterVersionChanges] = useState<CharacterVersion>();

  const getCharacter = useCallback((id: number) => {
    fetch('https://localhost:44391/api/character/' + id)
      .then(res => res.json())
      .then((res: CharacterType) => {
        setCanEdit(res.userId === user?.userId)
        setCharacter(res);
      });
  }, [user]);

  const updateCharacter = (changedValues: Partial<CharacterPatch>) => {
    if (character) {
      let characterPatch: CharacterPatch = {
        name: character.name,
        notes: character.notes,
        physicalStressTaken: character.physicalStressTaken,
        mentalStressTaken: character.mentalStressTaken,
        socialStressTaken: character.socialStressTaken,
        consequences: character.consequences,
        temporaryAspects: character.temporaryAspects
      }
      
      characterPatch = { ...characterPatch, ...changedValues };

      let headers = new Headers();

      headers.set('content-type', 'application/json');

      fetch('https://localhost:44391/api/character/' + character.characterId, { method: 'PATCH', body: JSON.stringify(characterPatch), headers })
        .then(() => getCharacter(character.characterId));
    }
  }

  const beginVersionAdd = () => {
    if (character) {
      setIsAddingVersion(true);
      setCharacterVersionChanges({
        aspects: character.aspects,
        baseRefresh: character.baseRefresh,
        mentalStressBoxes: character.mentalStressBoxes,
        physicalStressBoxes: character.physicalStressBoxes,
        skills: character.skills,
        socialStressBoxes: character.socialStressBoxes,
        stunts: character.stunts
      });
    }
  };

  const cancelVersionAdd = () => {
    setIsAddingVersion(false);
    setCharacterVersionChanges(undefined);
  }

  const saveVersionChanges = () => {
    if (character) {
      let headers = new Headers();

      headers.set('content-type', 'application/json');
  
      fetch('https://localhost:44391/api/character/' + character.characterId, { method: 'PUT', body: JSON.stringify(characterVersionChanges), headers })
        .then(cancelVersionAdd)
        .then(() => getCharacter(character.characterId));
    }
  }

  const setCharacterVersionProperty = <T extends keyof CharacterVersion>(property: T, value: CharacterVersion[T]) => {
    if (characterVersionChanges) {
      setCharacterVersionChanges({...characterVersionChanges, [property]: value})
    }
  }

  useEffect(() => {
    if (characterId) {
      getCharacter(characterId);
    }
  }, [getCharacter, characterId]);

  return (
    <CharacterContext.Provider
      value={{
        character,
        characterId,
        canEdit,
        isAddingVersion,
        characterVersionChanges,
        setCharacterId,
        updateCharacter,
        setCharacterVersionProperty,
        beginVersionAdd,
        saveVersionChanges,
        cancelVersionAdd
      }}
    >
      {props.children}
    </CharacterContext.Provider>
  );
}

export default CharacterContextProvider;