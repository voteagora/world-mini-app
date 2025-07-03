import { Page } from "@/components/PageLayout";
import { Typography } from "@worldcoin/mini-apps-ui-kit-react";

export default function About() {
  return (
    <>
      <Page.Main className="flex flex-col items-start justify-start gap-4 mb-16 px-4 overflow-y-auto">
        <div className="bg-[#F3F2F0] flex items-center justify-center w-full h-52 shrink-0">
          <div className="flex gap-4 items-center justify-center">
            <img src="/world-logo.svg" alt="World" className="w-24 h-24" />
            <div className="h-6 w-px bg-gray-900"></div>
            <img src="/agora-logo.svg" alt="Agora" className="w-24 h-24" />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-4 mt-4">
          <Typography variant="body" level={2} color="default">
            The World Vote Mini App is an experiment in onchain governance
            developed by World Foundation in partnership with Agora. Founded in
            2022 to steward the World network, the World Foundation has teamed
            up with Agora, a leading platform for onchain governance to explore
            potential ways the World community can vote on operational decisions
            affecting the network.
          </Typography>
          <Typography variant="body" level={2} color="default">
            World is a network of real humans, built on privacy-preserving
            proof-of-human technology, and powered by a globally inclusive
            financial network that enables the free flow of digital assets for
            all. It is built to connect, empower, and be owned by everyone.
          </Typography>
          <Typography variant="body" level={2} color="default">
            The World Foundation is launching a series of proposals to
            practically explore and demonstrate the potential of
            one-person-one-vote coordination. Each proposal will focus on a
            unique topic ranging from community value alignment to helping the
            Foundation shape priorities all while supporting a novel method of
            engaging with the World community. Every verified user will receive
            exactly one vote, backed by proof-of-human with World ID.
          </Typography>
          <Typography variant="body" level={2} color="default">
            Leveraging first-class governance technology powered by Agora and
            World ID, an anonymous proof-of-human mechanism, it ensures every
            vote on World proposals is cast by a verified human, providing
            sybil-resistant participation.
          </Typography>
        </div>
      </Page.Main>
    </>
  );
}
