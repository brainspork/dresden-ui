import { createContext, FC, useContext, useEffect, useState } from 'react';
import { CharacterPatch, CharacterType } from 'src/components/character/types';
import { useUserContext } from './UserContext';

type CharacterContextType = {
  character?: CharacterType;
  characterId?: number;
  canEdit?: boolean;
  setCharacterId: (characterId?: number) => void;
  updateCharacter: (changedValues: Partial<CharacterPatch>) => void;
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
        setCharacterId,
        updateCharacter
      }}
    >
      {props.children}
    </CharacterContext.Provider>
  );
}

export default CharacterContextProvider;