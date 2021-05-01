import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useUserContext } from 'src/contexts/UserContext';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

const Login: FC = (props) => {
  const { user, setUserContext } = useUserContext();
  const history = useHistory();

  const [ userId, setUserId ] = useState<string>();
  
  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user, history]);

  const handleSubmit = () => {
    fetch('https://localhost:44391/api/user/' + userId)
      .then(res => res.json())
      .then(res => setUserContext({
        firstName: res.firstName,
        lastName: res.lastName,
        username: res.username,
        email: res.email,
        userId: res.userId
      }));
  }

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setUserId(ev.target.value);
  }

  return (
    <>
      <TextField label="Username" onChange={handleChange} />
      <Button color="inherit" onClick={handleSubmit}>Submit</Button>
    </>
  )
}

export default Login;