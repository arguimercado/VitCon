import { StreamClientProvider } from "@/providers/StreamClientProvider";
import React, { ReactNode } from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const RootLayout = ({ children }: { children: ReactNode }) => {
   return (
      <main>
         <StreamClientProvider>{children}</StreamClientProvider>
      </main>
   );
};

export default RootLayout;
