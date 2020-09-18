import React, { useState, useEffect } from 'react';
import './App.css';
import Menu from './Menu'
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input, Paper, Tabs, Tab } from '@material-ui/core'
import ImageUpload from './ImageUpload'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [menus, setMenus] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState('coffee');

  useEffect(() => {
    setMenu(menu);
    db.collection(menu).onSnapshot(snapshot => {
      setMenus(snapshot.docs.map(doc => ({
        id: doc.id,
        menu: doc.data()
      })));
    })
  }, [menu]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        setUser(authUser);
      }
      else {
        // user has logged out...
        setUser(null);
      }
    });
    
    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => alert(error.message))

    setOpenSignUp(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    
    setOpenSignIn(false);
  }

  const handleMenu = (event, newMenu) => {
    setMenu(newMenu);
  };

  return (
    <div className="app">
      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ) : (
        <h3>sorry you need to login</h3>
      )}
      <Modal
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
                <img
                  className="app__headerImage"
                  src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s150x150/108314708_1693365067470714_4963373471663023440_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=mYzoOh8CTo4AX8r443x&oh=3985abe3b401d4e6ef80f7826d19fc68&oe=5F67A2E0"
                  alt=""
                />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>회원가입</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signin">
            <center>
                <img
                  className="app__headerImage"
                  src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s150x150/108314708_1693365067470714_4963373471663023440_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=mYzoOh8CTo4AX8r443x&oh=3985abe3b401d4e6ef80f7826d19fc68&oe=5F67A2E0"
                  alt=""
                />
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>로그인</Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s150x150/108314708_1693365067470714_4963373471663023440_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=mYzoOh8CTo4AX8r443x&oh=3985abe3b401d4e6ef80f7826d19fc68&oe=5F67A2E0"
          alt=""
        />
        {user ? (
          <div className="app__logoutConatiner">
            <p className="app__displayName">{user.displayName}님, 안녕하세요.</p>
            <Button onClick={() => auth.signOut()}>로그아웃</Button>
          </div>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>로그인</Button>
            <Button onClick={() => setOpenSignUp(true)}>회원가입</Button>
          </div>
        )}
      </div>
      <div className="app__menus__tabs">
        <Paper className={ makeStyles({root: { flexGrow: 1, }, }).root }>
          <Tabs
            value={menu}
            onChange={handleMenu}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="coffee" value="coffee"/>
            <Tab label="non-coffee" value="non-coffee"/>
            <Tab label="tea" value="tea"/>
            <Tab label="dessert" value="dessert"/>
          </Tabs>
        </Paper>
      </div>

      <div className="app__menus">
        {
          menus.map(({id, menu}) => (
            <Menu key={id} imgUrl={menu.imgUrl} name={menu.name} price={menu.price} text={menu.text} />
          ))
        }
      </div>
      
    </div>
  );
}

export default App;
