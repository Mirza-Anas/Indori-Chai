import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Your Cart");

const layout = ({ children }) => {
  return <>{children}</>;
};

export default layout;
