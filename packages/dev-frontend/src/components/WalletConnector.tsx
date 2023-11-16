import { ConnectKitButton } from "connectkit";
import { Box, Button } from "theme-ui";
import { Icon } from "./Icon";
import { ConnectPage } from "./ConnectPage";

type WalletConnectorProps = {
  loader?: React.ReactNode;
};

export const WalletConnector: React.FC<WalletConnectorProps> = ({ children }) => {
  return (
    <ConnectKitButton.Custom>
      {connectKit =>
        connectKit.isConnected ? (
          children
        ) : (
          <ConnectPage>
            <Button onClick={connectKit.show}>
              <Icon name="plug" size="lg" />
              <Box sx={{ ml: 2 }}>Connect wallet</Box>
            </Button>
          </ConnectPage>
        )
      }
    </ConnectKitButton.Custom>
  );
};
