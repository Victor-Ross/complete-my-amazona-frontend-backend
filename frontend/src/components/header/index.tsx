import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { useStoreContext } from '../../contexts/storeContext';
import { api } from '../../services/api';
import { getError } from '../../utils/getError';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import './styles.css';
import SearchBox from '../searchBox';

type Category = {
  category: string;
};

export function Header() {
  const { state, signOutHandler } = useStoreContext();
  const { cart, userInfo } = state;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchCategories = async () => {
      try {
        const { data } = await api.get(`/api/products/categories`);
        setCategories(data);
      } catch (error: any) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div
      className={
        sidebarIsOpen
          ? 'd-flex flex-column activeContainer'
          : 'd-flex flex-column'
      }
    >
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Button
              variant="dark"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <i className="fas fa-bars" />
            </Button>
            <Nav.Link as={Link} to="/">
              <Navbar.Brand>amazona</Navbar.Brand>
            </Nav.Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox />
              <Nav className="me-auto w-100 justify-content-end">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce(
                        (total, cartItem) => total + cartItem.quantity,
                        0
                      )}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/profile">
                      User Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/orderhistory">
                      Order History
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <Link
                      to="#signout"
                      className="dropdown-item"
                      onClick={signOutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="admin" id="admin-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/productlist">
                      Products
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orderlist">
                      Orders
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/userlist">
                      Users
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <div
        className={
          sidebarIsOpen
            ? 'activeNav sideNavbar d-flex justify-content-between flex-wrap flex-column'
            : 'sideNavbar d-flex justify-content-between flex-wrap flex-column'
        }
      >
        <Nav className="flex-column text-white w-100 p-2">
          <Nav.Item>
            <strong>Categories</strong>
          </Nav.Item>
          {categories.map((category) => (
            <Nav.Item key={category.category}>
              <Nav.Link
                as={Link}
                to={`/search?category=${category.category}`}
                onClick={() => setSidebarIsOpen(false)}
              >
                {category.category}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
    </div>
  );
}
