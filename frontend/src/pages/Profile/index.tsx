import { FormEvent, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

import { useStoreContext } from '../../contexts/storeContext';
import { getError } from '../../utils/getError';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { api } from '../../services/api';

type State = {
  loadingUpdate: boolean;
  updatedUser: User;
};

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type Action =
  | {
      type: 'update_request';
    }
  | {
      type: 'update_success';
      updatedUser: User;
    }
  | {
      type: 'update_fail';
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'update_request':
      return { ...state, loadingUpdate: true };
    case 'update_success':
      return {
        ...state,
        loadingUpdate: false,
        updatedUser: action.updatedUser,
      };
    case 'update_fail':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const { state: storeState, dispatch: storeDispatch } = useStoreContext();
  const { userInfo } = storeState;

  const [{ loadingUpdate }, updateUserdispatch] = useReducer(reducer, {
    loadingUpdate: false,
    updatedUser: {} as User,
  });

  if (!userInfo) {
    navigate('/signin');
  }

  const [name, setName] = useState<string>(userInfo!.name);
  const [email, setEmail] = useState<string>(userInfo!.email);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await api.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo!.token}` },
        }
      );
      updateUserdispatch({ type: 'update_success', updatedUser: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (error: any) {
      updateUserdispatch({ type: 'update_fail' });
      toast.error(getError(error));
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-50">
        <Helmet>
          <title>User Profile</title>
        </Helmet>
        <h1>User Profile</h1>
        <form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit" className="buttonsDefaultColors">
              Update user data
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
