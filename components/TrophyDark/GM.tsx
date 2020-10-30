import * as React from 'react';
import Link from 'next/link';
import { Box, Heading, Text, Link as StyledLink, Flex } from 'rebass';
import hrStyles from './hr.module.css';

export default function GM({
  roomName,
}: {
  roomName: string;
}): React.ReactElement {
  return (
    <Box>
      <Heading variant="text.h2" mb={4}>
        Roll With Me: Trophy Dark
      </Heading>
      <hr className={hrStyles.hr} />
      <Heading variant="text.h3" mt={6} mb={4}>
        Notes for the GM
      </Heading>
      <Text variant="text.p" mb={2}>
        This app is made to help with conducting a great game of Trophy Dark. It
        includes features for the players to make characters, roll dice, and use
        safety tools.
      </Text>
      <Text variant="text.p" mb={2}>
        Data is synced across all connected users, so things can get jumbled if
        multiple people are trying to change the same part at the same time. If
        something glitches, it is recommended only one person try to correct it.
      </Text>
      <Text variant="text.p" mb={2}>
        The same principle applies to the Light and Dark dice. They are
        synchronized so only one person should attempt to roll at a time to
        avoid missing someone&apos;s results.
      </Text>
      <Heading variant="text.h3" mt={6} mb={4}>
        Links
      </Heading>
      <Flex flexDirection="column">
        <StyledLink href="#safety" variant="text.link" mt={3}>
          Safety
        </StyledLink>
        <StyledLink href="#SRD" variant="text.link" mt={3}>
          SRD
        </StyledLink>
        <StyledLink href="#characters" variant="text.link" mt={3}>
          Characters
        </StyledLink>
      </Flex>
      <Heading id="safety" variant="text.h2" mt={7} mb={4}>
        Safety
      </Heading>
      <hr className={hrStyles.hr} />
      <Heading variant="text.h3" mt={6} mb={4}>
        Lines and Veils
      </Heading>
      <Text variant="text.p">
        Use the{' '}
        <Link href={`/trophy-dark/${roomName}?tab=safety`}>
          <StyledLink variant="text.paragraphLink">Safety</StyledLink>
        </Link>{' '}
        tab to enter lines, veils, items of enthusiam, or items that should be
        asked about first. Notes can be entered for each and data is synced
        across users.
      </Text>
      <Heading id="SRD" variant="text.h2" mt={7} mb={4}>
        SRD
      </Heading>
      <hr className={hrStyles.hr} />
      <Heading variant="text.h3" mt={6} mb={4}>
        Risk Roll
      </Heading>
      <Text variant="text.p" mb={2}>
        When your character attempts a risky task, say what you hope will happen
        and ask the GM and the other players what could possibly go wrong. Then
        gather 6-sided dice. Take one light-colored die if the task is something
        your character would be able to do because of one of their Skills. Take
        another light die for accepting a Devil&apos;s Bargain from another
        player or the GM. Devil&apos;s Bargains are described in the following
        section. Add a dark-colored die if you are willing to risk your
        character&apos;s mind or body in order to succeed. You must include this
        die whenever your character performs a Ritual. Roll the dice. If your
        highest die is a:
      </Text>
      <Box
        sx={(styles) => ({
          display: 'grid',
          gridTemplate: '1fr / 50px 1fr',
          border: `1px solid ${styles.colors.muted}`,
        })}
        mb={2}
      >
        <Text p={3} width="100%" height="100%" variant="text.p">
          1-3
        </Text>
        <Text p={3} width="100%" height="100%" variant="text.p">
          Your character fails, and things get worse. The GM describes how. The
          GM may also allow your character to succeed, but things will get worse
          in some other way.
        </Text>
        <Text
          p={3}
          width="100%"
          height="100%"
          bg="secondaryText"
          color="background"
          variant="text.p"
        >
          4-5
        </Text>
        <Text
          p={3}
          width="100%"
          height="100%"
          bg="secondaryText"
          color="background"
          variant="text.p"
        >
          Your character succeeds, but there&apos;s some kind of complication.
          The GM describes the complication, then you describe how your
          character succeeds.
        </Text>
        <Text p={3} width="100%" height="100%" variant="text.p">
          6
        </Text>
        <Text p={3} width="100%" height="100%" variant="text.p">
          Your character succeeds. Describe how.
        </Text>
      </Box>
      <Text variant="text.p">
        If you included a dark die and it rolled equal to or higher than your
        highest light die, it counts as a Ruin Roll as described under Ruin
        Roll. If you are unhappy with your roll, you may add an additional dark
        die to your dice and re-roll. You can keep adding more dark dice and
        re-rolling. You cannot re-roll when a dark die is the highest die in
        your roll. If you use a Risk Roll to try to defeat a monster in
        hand-to-hand combat, you will die. Instead, roll to hide, roll to
        escape, or roll to use a Ritual against it. If you fight something that
        is not monstrous or if you fight a monster but not to defeat it (for
        example, to fight your way past it), be clear about what you want from
        the fight, then roll normally.
      </Text>
      <Heading variant="text.h3" mt={6} mb={4}>
        Devil&apos;s Bargains
      </Heading>
      <Text variant="text.p" mb={2}>
        The GM or any other player can offer you a bonus light die if you accept
        a Devil&apos;s Bargain. Common Devil&apos;s Bargains include:
      </Text>
      <Text variant="text.p">
        <ul>
          <li>Your character causes collateral damage or unintended harm.</li>
          <li>Your character gets lost or separated from their companions.</li>
          <li>Your character sacrifices an important item.</li>
          <li>Your character betrays a companion.</li>
          <li>Your character attracts unwanted attention.</li>
        </ul>
      </Text>
      <Text variant="text.p" mt={2}>
        The Devil&apos;s Bargain occurs regardless of the outcome of the roll.
        You make the deal, pay the price, and get the bonus die. The
        Devil&apos;s Bargain is always a free choice. If you don&apos;t like
        one, just reject it (or suggest how to alter it so you might consider
        taking it). You can always just risk your character&apos;s mind or body
        and take a dark die instead. Anyone may veto or suggest alterations to a
        proposed Devil&apos;s Bargain, especially if it would also impact their
        character.
      </Text>
      <Heading variant="text.h3" mt={6} mb={4}>
        Ruin Roll
      </Heading>
      <Text variant="text.p" mb={2}>
        Your Ruin shows how much physical and mental harm your character has
        suffered. It starts at 1. When your character witnesses or undergoes
        something disturbing, make a Ruin Roll by rolling one dark die. If
        you&apos;ve made a Risk Roll which includes a dark die, and that die is
        equal to or higher than your highest light die in that roll, your dark
        die is automatically considered a Ruin Roll. If your dark die rolled
        higher than your current Ruin, add 1 to your Ruin and work with the GM
        to describe the decline of your character&apos;s mind and body.
      </Text>

      <Heading variant="text.h3" mt={6} mb={4}>
        Reduction Roll
      </Heading>
      <Text variant="text.p">
        When your Ruin reaches 5, you may now reduce it when your character
        attempts subtle acts of sabotage against their companions. Each time
        your character does this, roll one light die. If you get less than your
        current Ruin, your character succeeds at their task and you decrease
        your Ruin by 1. You may continue reducing your Ruin in this way when
        your Ruin drops below 5.
      </Text>

      <Heading variant="text.h3" mt={6} mb={4}>
        Losing Your Character
      </Heading>
      <Text variant="text.p">
        When your Ruin reaches 6, your character is lost. This is an important
        moment: Everyone focuses on your character&apos;s last flashes of
        lucidity before they run away or turn against their companions. Hand
        your character over to the GM to control, and either create a new
        character or exit the game.
      </Text>
    </Box>
  );
}
