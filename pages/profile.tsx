import * as React from 'react';
import { Auth, withSSRContext, Hub } from 'aws-amplify';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import { Button } from 'rebass';

function Profile({ authenticated, username }): React.ReactElement {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then((userData) => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log('Not signed in'));
  }

  return user ? (
    <div className="App">
      <div>Hello, {user.username}</div>
      <AmplifySignOut />
    </div>
  ) : (
    <>
      <Button variant="primary" onClick={() => Auth.federatedSignIn()}>
        Sign in to continue
      </Button>
    </>
  );
}

export async function getServerSideProps(context) {
  const { Auth } = withSSRContext(context);
  try {
    const user = await Auth.currentAuthenticatedUser();
    return {
      props: {
        authenticated: true,
        username: user.username,
      },
    };
  } catch (err) {
    return {
      props: {
        authenticated: false,
      },
    };
  }
}

export default Profile;
