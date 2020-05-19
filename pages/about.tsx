import * as React from 'react';
import { Box, Flex, Heading, Text } from 'rebass';

const About = () => {
  return (
    <Flex flexDirection="column" flex="1" alignItems="center" p={3}>
      <Box width="100%" maxWidth="960px">
        <Heading as="h1" fontSize={5}>
          About Roll Dice With Me
        </Heading>
        <Text>
          Roll Dice With Me is a collaborative online dice roller. You can use
          it to simulate rolling dice for various games. The results of each
          roll are shared to every person connected to the room and will be
          viewed in real time. Each user is also able to view each roll made
          since they joined the room.
        </Text>
        <Heading id="setting-up-a-room" as="h2" mt={3} fontSize={4}>
          Setting up a room
        </Heading>
        <Text>
          To create a new room, go to the homepage and click the "Create a new
          room" button. You will be redirected to a new page with a new address.
          Copy this address and send it to whoever you would like to join.
        </Text>
        <Heading id="room-layout" as="h2" mt={3} fontSize={4}>
          Features of a room
        </Heading>
        <Text>The room is made of three parts.</Text>
        <ol>
          <li>The dice selection area</li>
          <li>Current roll results</li>
          <li>History of rolls since joining</li>
        </ol>
        <Heading id="dice-selection" as="h3" mt={2} fontSize={3}>
          Dice selection
        </Heading>
        <Text>
          A powerful feature of Roll Dice With Me is being able to set up your
          rolls for quick access. This is available in the "Your Configured
          Rolls" area. To add a roll, click "Add a Roll" and complete the form
          that appears. You can name the roll, such as after the stat or move it
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
        <Heading id="current-roll-results" as="h3" mt={2} fontSize={3}>
          Current roll results
        </Heading>
        <Text>
          This area displays all of the dice and any modifiers that were part of
          the most recent roll. It will display the sum of each die type (d6,
          d8, d10, etc) and the total of all dice plus any static modifiers.
        </Text>
        <Heading id="historical-roll-results" as="h3" mt={2} fontSize={3}>
          History of rolls since joining
        </Heading>
        <Text>
          This area displays all of the rolls made since you joined the room. It
          says who rolled it, if it was named, and what the total was. To view
          information on all of the die values in that roll, you can click on
          the roll and a popup will display detailed info of each die involved
          in that roll.
        </Text>
      </Box>
    </Flex>
  );
};

export default About;
