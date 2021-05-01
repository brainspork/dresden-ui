import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useUserContext } from 'src/contexts/UserContext';

const Dashboard: FC = (_) => {
  const { user } = useUserContext();
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, [user, history]);

  return (
    <>
      {!user && <h2>Login to see dashboard</h2>}
      {user && (
        <>
          <h2>Characters</h2>
          <h2>Games</h2>
        </>
      )}
    </>
  );
}

export default Dashboard;