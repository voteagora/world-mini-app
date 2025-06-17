import { Page } from "@/components/PageLayout";
import { TopBar, Typography } from "@worldcoin/mini-apps-ui-kit-react";

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
            Lorem ipsum dolor sit amet consectetur. Feugiat varius accumsan non
            pretium posuere urna arcu arcu. Viverra sed eget sodales nibh
            pulvinar justo volutpat. Tincidunt congue dignissim pellentesque
            integer sagittis. Nisl semper eu id nulla adipiscing pellentesque
            sem nibh. Ipsum tempor sagittis volutpat fermentum sit eget nisl
            sed. Enim eu mauris amet tellus tempor volutpat sagittis. Mi libero
            commodo vitae et eget tellus. Nibh cursus nibh feugiat netus. Urna
            egestas amet aliquam faucibus eget magna purus donec. Lorem ipsum
            dolor sit amet consectetur. Feugiat varius accumsan non pretium
            posuere urna arcu arcu. Viverra sed eget sodales nibh pulvinar justo
            volutpat. Tincidunt congue dignissim pellentesque integer sagittis.
            Nisl semper eu id nulla adipiscing pellentesque sem nibh. Ipsum
            tempor sagittis volutpat fermentum sit eget nisl sed. Enim eu mauris
            amet tellus tempor volutpat sagittis. Mi libero commodo vitae et
            eget tellus. Nibh cursus nibh feugiat netus. Urna egestas amet
            aliquam faucibus eget magna purus donec.
          </Typography>
        </div>
      </Page.Main>
    </>
  );
}
