import { ConnectKitButton } from "connectkit";
import { Box, Button, Flex } from "theme-ui";
import { ConnectPage, device } from "./ConnectPage";

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
            <Flex sx={{ justifyContent: "center", alignItems: "flex-start", flexDirection: "column",
        [`@media screen and (min-width: ${device.mobile}px)`]: {
          width: "319px",
        },
        [`@media screen and (min-width: ${device.laptop}px)`]: {
          width: "219px",
        },
        [`@media screen and (min-width: ${device.desktop}px)`]: {
          width: "242px",
        },
      }}>
            <Button sx={{ 
              fontFamily: `"NeueHaasGroteskDisp Pro Md", sans-serif`,
              backgroundColor: "#12c164",
              border: "none",
              letterSpacing: "0.75px",
              whiteSpace: "nowrap",
              width: "100%",
              [`@media screen and (min-width: ${device.mobile}px)`]: {
                fontSize: "20px",
                height: "59px"
              },
              [`@media screen and (min-width: ${device.laptop}px)`]: {
                fontSize: "14px",
                height: "49px"
              },
              [`@media screen and (min-width: ${device.desktop}px)`]: {
                fontSize: "15px",
                height: "54px"
              },
            }}
            onClick={connectKit.show}>
              <Box>CONNECT</Box>
            </Button>
            <Box sx={{ ml:2, mt: 15, width: "100%" }}>
        <a style={{ 
            color: "#647686",
            textDecoration: "none",
            lineHeight: "normal",
            letterSpacing: "0.6px",
            fontFamily: `"NeueHaasGroteskDisp Pro Md", sans-serif`,
            fontSize: "12px"
          }} href="https://app.bprotocol.org/terms" target="_top">
            By using B.Protocol, you agree to the <span style={{textDecoration: "underline"}}>Terms and Conditions</span>
        </a>
        </Box>
        </Flex>
          </ConnectPage>
        )
      }
    </ConnectKitButton.Custom>
  );
};
