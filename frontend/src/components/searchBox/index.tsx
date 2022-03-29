import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function SearchBox() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();

    navigate(query ? `search/?query=${query}` : '/search');
  };
  return (
    <Form className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <Form.Control
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        />
        <Button
          type="submit"
          id="button-search"
          className="buttonsDefaultColors"
        >
          <i className="fas fa-search" />
        </Button>
      </InputGroup>
    </Form>
  );
}
