import { createContext, FC, useContext, useEffect, useState } from 'react';
import { CharacterType } from 'src/components/character/types';
import { useUserContext } from './UserContext';

type CharacterContextType = {
  character?: CharacterType;
  characterId?: number;
  canEdit?: boolean;
  setCharacterId: (characterId?: number) => void;
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

  useEffect(() => {
    if (characterId) {
      fetch('https://localhost:44391/api/character/' + characterId)
        .then(res => res.json())
        .then((res: CharacterType) => {
          setCanEdit(res.userId === user?.userId)
          setCharacter(res);
        });
    }
  }, [characterId]);

  return (
    <CharacterContext.Provider
      value={{
        character,
        characterId,
        canEdit,
        setCharacterId
      }}
    >
      {props.children}
    </CharacterContext.Provider>
  );
}

export default CharacterContextProvider;