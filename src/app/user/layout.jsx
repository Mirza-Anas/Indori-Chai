import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Your Account");

const layout = ({ children }) => {
  return <>{children}</>;
};

export default layout;
