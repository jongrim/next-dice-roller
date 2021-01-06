import * as React from 'react';
import { Text, Box } from 'rebass';

const WhyV2 = () => {
  return (
    <Box px="16px" pt="32px" maxWidth="960px" ml="auto" mr="auto">
      <Text fontSize="24px" mb="8px">
        V2 is coming...
      </Text>
      <Text mb="32px" fontWeight="200">
        Here's what's coming
      </Text>

      <Text lineHeight="1.75" mt="16px">
        When I started Roll With Me, it was a whim and a curiousity about how a
        dice web app might work. Most of the ones I'd tried either had bugs or
        were just weren't that pleasing to look at and use. There were a couple
        things I wanted to try and learn and I managed those. To my surprise,
        people seemed to like the output and so I kept adding to it. Fast
        forward a few months and some of the choices I made on a whim were now
        severly limiting. Things like not having storage or accounts meant I was
        limited in the things I could do and offer.
        <br />
        After some thought and testing, I decided I wanted to do a full rebuild.
        I'd learned a lot in the first pass and had a lot of things I wanted to
        do better in addition to choosing a better set of technologies that
        would allow for a wider variety of content on the site.
      </Text>
      <Text lineHeight="1.75" mt="16px">
        So here are some things the new version will offer that the current one
        couldn't do:
        <ul>
          <li>Create an account to save data and access it from any device</li>
          <li>
            Preserve room data when no one is online — this means you can use
            the same room multiple times and you'll never lose your progress
          </li>
          <li>
            Along the same lines, better handle if someone isn't connected or
            joins late
          </li>
        </ul>
      </Text>
      <Text lineHeight="1.75" mt="16px">
        You can try out the{' '}
        <a href="https://main.d1y92bo115vf7n.amplifyapp.com/">new version</a>{' '}
        right now. At the time of this writing only the base text room is
        created. It's got most of the features of the first, as well as some
        really exciting new things like:
        <ul>
          <li>
            Quick rolls using just your keyboard and standard dice terms (2d6+1)
          </li>
          <li>
            Safety tools in place so you can use the x-card and lines and veils
            easily with your rolling
          </li>
          <li>
            A spiffy new design that I <i>think</i> is a big improvement — (I am
            not a designer. If you are and have ideas I'd love to hear them!)
          </li>
        </ul>
      </Text>
      <Text lineHeight="1.75" mt="16px">
        I'm going to be working on redoing the Trophy Dark app next, and the
        interactive rooms after (when I'll also finally stop calling them "beta"
        too 😅). After that I'll update the web addressing so that when you
        visit https://rollwithme.xyz you arrive at the new application. All in
        all, depending on how well I manage my energy, I expect this will take
        the next couple of months to fully complete.
      </Text>
      <Text lineHeight="1.75" mt="16px">
        Thank you for using the site, and thank you for reading my rambling. I
        hope you find the new version as exciting as I do, and as always, I
        welcome your feedback!
      </Text>
      <Box mb="64px">
        <span role="img" aria-label="heart">
          ❤️ — Jon
        </span>
      </Box>
    </Box>
  );
};

export default WhyV2;
