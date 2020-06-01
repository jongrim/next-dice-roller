import * as React from 'react';
import { Box, Flex, Heading, Image, Text } from 'rebass';

const About = () => {
  return (
    <Flex flexDirection="column" flex="1" alignItems="center" p={3}>
      <Box width="100%" maxWidth="960px">
        <Heading as="h1" fontSize={5}>
          About Roll With Me
        </Heading>
        <Text>
          Roll With Me is a collaborative online dice roller. You can use it to
          simulate rolling dice for various games. The results of each roll are
          shared to every person connected to the room and will be viewed in
          real time. Each user is also able to view each roll made since they
          joined the room.
        </Text>
        <Text mt={2}>
          Note that rooms are not permanent. Once everyone disconects the room
          is destroyed on the server. Create a new room when you return and use
          the configured rolls feature to save and quickly load rolls when you
          return.
        </Text>
        <Box as="section" mt={3}>
          <Heading as="h2">Help Topics</Heading>
          <ul>
            <li>
              <a href="#creating-a-room">Creating a room</a>
            </li>
            <li>
              <a href="#room-layout">Features of a room</a>
            </li>
            <li>
              <a href="#code-and-issues">Source code and issues</a>
            </li>
          </ul>
        </Box>
        <Heading id="creating-a-room" as="h2" mt={5} fontSize={4}>
          Creating a room
        </Heading>
        <Text>
          From the homepage, you can create a new room by clicking the "Create a
          new room" button. You will be redirected to a new page with a new
          address. Copy this address and send it to whoever you would like to
          join.
          <br />
          You can also create a new room directly from an old room's URL if you
          notice you are not connected anymore. Click the disconnected icon and
          it will create a room and redirect you to it.
        </Text>
        <Heading id="room-layout" as="h2" mt={5} fontSize={4}>
          Features of a room
        </Heading>
        <Text>The room is made of four parts.</Text>
        <ol>
          <li>The dice selection area</li>
          <li>Current roll results</li>
          <li>History of rolls since joining</li>
          <li>The menu bar</li>
        </ol>
        <Heading id="dice-selection" as="h3" mt={4} fontSize={3}>
          Dice selection
        </Heading>
        <Text>
          A powerful feature of Roll With Me is being able to set up your rolls
          for quick access. This is available in the "Your Configured Rolls"
          area. To add a roll, click "Add a Roll" and complete the form that
          appears. You can name the roll, such as after the stat or move it
          represents, select the type of dice that roll uses, and add any static
          modifiers that apply to the roll. When finished, click "Done". Your
          configured roll is now available on the main screen. You can roll it
          by clicking the "Roll" button beside the roll name.
        </Text>
        <Text mt={2}>
          You can also roll assorted dice using the various dice types available
          under "Assorted Dice". After you enter the quantity you would like to
          roll of each dice type, click "Roll dice".
        </Text>
        <Heading id="current-roll-results" as="h3" mt={4} fontSize={3}>
          Current roll results
        </Heading>
        <Text>
          This area displays all of the dice and any modifiers that were part of
          the most recent roll. It will display the sum of each die type (d6,
          d8, d10, etc) and the total of all dice plus any static modifiers.
        </Text>
        <Text>
          You can also toggle the view of the results by clicking the gear icon
          next to "Results". If you do not want to see the dice added together,
          you can select list view which will display the individual dice
          values.
        </Text>
        <Heading id="historical-roll-results" as="h3" mt={4} fontSize={3}>
          History of rolls since joining
        </Heading>
        <Text>
          This area displays all of the rolls made since you joined the room. It
          says who rolled it, the name of the roll, and what the total was. To
          view information on all of the die values in that roll, you can click
          on the roll and a popup will display detailed info of each die
          involved in that roll.
        </Text>
        <Heading id="menu-bar" as="h3" mt={4} fontSize={3}>
          The menu bar
        </Heading>
        <Image src="/menu-bar.png" alt="menu bar screenshot" />
        <Text>
          The menu bar includes buttons to take you to home, copy the room URL,
          see who's connected to the room - or create a new room if you're
          disconnected, and get to this about page.
        </Text>
        <Flex
          flexDirection="column"
          mx="auto"
          maxWidth={['100%', '80%', '67%']}
        >
          <Flex
            mt={2}
            pb={1}
            sx={(styles) => ({
              borderBottom: `1px ${styles.colors.primary} solid`,
            })}
          >
            <Text fontWeight="bold" width="35%">
              Home
            </Text>
            <Text width="65%">take you to the home page</Text>
          </Flex>
          <Flex
            mt={2}
            pb={1}
            sx={(styles) => ({
              borderBottom: `1px ${styles.colors.primary} solid`,
            })}
          >
            <Text fontWeight="bold" width="35%">
              Copy room URL
            </Text>
            <Text width="65%">click to copy the current room URL</Text>
          </Flex>
          <Flex
            mt={2}
            pb={1}
            sx={(styles) => ({
              borderBottom: `1px ${styles.colors.primary} solid`,
            })}
          >
            <Text fontWeight="bold" width="35%">
              Connectivity status
            </Text>
            <Text width="65%">
              if connected, displays the names of those currently connected. If
              disconnected, click to quickly create a new room and go to it.
            </Text>
          </Flex>
          <Flex
            mt={2}
            pb={1}
            sx={(styles) => ({
              borderBottom: `1px ${styles.colors.primary} solid`,
            })}
          >
            <Text fontWeight="bold" width="35%">
              Help
            </Text>
            <Text width="65%">leads to this "About" page</Text>
          </Flex>
        </Flex>
        <Heading id="code-and-issues" as="h2" mt={5} fontSize={4}>
          Code and issues
        </Heading>
        <Text mt={3}>
          You can find the source code for Roll With Me on{' '}
          <a href="https://github.com/jongrim/next-dice-roller">GitHub</a>.
        </Text>
        <Text mt={2}>
          If you encounter any issues using this software, you are welcome to
          report it on GitHub using the "issues" feature, or send me a message
          on <a href="https://twitter.com/jonjongrim">Twitter</a>.
        </Text>
      </Box>
    </Flex>
  );
};

export default About;
