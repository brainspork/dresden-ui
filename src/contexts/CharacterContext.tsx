import { createContext, FC, useContext, useEffect, useState } from 'react';
import { CharacterPatch, CharacterType, CharacterVersion } from 'src/components/character/types';
import { useUserContext } from './UserContext';

type CharacterContextType = {
  character?: CharacterType;
  characterId?: number;
  canEdit?: boolean;
  isAddingVersion: boolean;
  beginVersionAdd: () => void;
  setCharacterId: (characterId?: number) => void;
  updateCharacter: (changedValues: Partial<CharacterPatch>) => void;
  addCharacterVersion: (changedValues:  Partial<CharacterVersion>) => void;
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

  const getCharacter = (id: number) => {
    fetch('https://localhost:44391/api/character/' + id)
      .then(res => res.json())
      .then((res: CharacterType) => {
        setCanEdit(res.userId === user?.userId)
        setCharacter(res);
      });
  }

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

  const beginVersionAdd = () => setIsAddingVersion(true);

  const addCharacterVersion = (changedValues: Partial<CharacterVersion>) => {
    if (character) {
      let characterVersion: CharacterVersion = {
        aspects: character.aspects,
        baseRefresh: character.baseRefresh,
        mentalStressBoxes: character.mentalStressBoxes,
        physicalStressBoxes: character.physicalStressBoxes,
        skills: character.skills,
        socialStressBoxes: character.socialStressBoxes,
        stunts: character.stunts
      }

      characterVersion = { ...characterVersion, ...changedValues }

      let headers = new Headers();

      headers.set('content-type', 'application/json');
  
      fetch('https://localhost:44391/api/character/' + character.characterId, { method: 'PUT', body: JSON.stringify(characterVersion), headers })
        .then(() => getCharacter(character.characterId));
    }
  }

  useEffect(() => {
    if (characterId) {
      getCharacter(characterId);
    }
  }, [characterId]);

  return (
    <CharacterContext.Provider
      value={{
        character,
        characterId,
        canEdit,
        isAddingVersion,
        setCharacterId,
        updateCharacter,
        addCharacterVersion,
        beginVersionAdd
      }}
    >
      {props.children}
    </CharacterContext.Provider>
  );
}

export default CharacterContextProvider;