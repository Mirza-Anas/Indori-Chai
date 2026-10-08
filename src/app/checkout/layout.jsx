import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Checkout");

const layout = ({ children }) => {
  return <>{children}</>;
};

export default layout;
