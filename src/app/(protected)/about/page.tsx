import { Page } from "@/components/PageLayout";
import { Typography } from "@worldcoin/mini-apps-ui-kit-react";
import Link from "next/link";

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
            World Vote Mini App is an experiment in digital governance developed
            by World Foundation in partnership with Agora. The World Foundation
            has teamed up with Agora, a leading platform for onchain governance
            to explore new ways to engage the community, collect feedback, and
            demonstrate World ID&apos;s potential for digital governance.
          </Typography>
          <Typography variant="body" level={2} color="default">
            World is a network of real humans, built on privacy-preserving
            proof-of-human technology, and powered by a globally inclusive
            financial network that enables the free flow of digital assets for
            all. It is built to connect, empower, and be owned by everyone.
          </Typography>
          <Typography variant="body" level={2} color="default">
            The World Foundation is launching a series of proposals to test and
            explore the potential of one person, one vote coordination. Each
            proposal will focus on a unique topic and will be put to a community
            vote. This enables verified humans to signal their preferences to
            help us explore new models of community coordination. Every verified
            user will receive exactly one vote, backed by proof-of-human with
            World ID.
          </Typography>
          <Typography variant="body" level={2} color="default">
            Leveraging first-class governance technology powered by Agora and
            World ID, an anonymous proof-of-human mechanism, it ensures every
            vote on World proposals is cast by a verified human, providing
            sybil-resistant participation.
          </Typography>
          <Link href="https://world.org/pt-br/worldvote">
            <span className="underline font-bold">Learn more</span>
          </Link>
        </div>
      </Page.Main>
    </>
  );
}
