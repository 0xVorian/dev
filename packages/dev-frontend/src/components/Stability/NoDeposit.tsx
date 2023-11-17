import React, { useCallback } from "react";
import { Card, Heading, Box, Flex, Button, Text } from "theme-ui";
import { InfoMessage } from "../InfoMessage";
import { useStabilityView } from "./context/StabilityViewContext";
import { RemainingLQTY } from "./RemainingLQTY";
import { Yield } from "./Yield";
import { useTransactionFunction } from "../Transaction";
import { useLiquity } from "./../../hooks/LiquityContext";


export const UnlockButton: React.FC = props => {
  const { liquity } = useLiquity();
  const [sendTransaction] = useTransactionFunction(
    "bamm-unlock",
    liquity.send.bammUnlock.bind(liquity.send)
  );

  return (
    <Text 
      onClick={sendTransaction} 
      sx={{ 
        fontWeight: "bold", 
        whiteSpace: "nowrap", 
        cursor: "pointer", 
        textDecoration: "underline" }}>
          {props.children}
    </Text>
  )
}

export const NoDeposit: React.FC = () => {
  const { dispatchEvent } = useStabilityView();

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("DEPOSIT_PRESSED");
  }, [dispatchEvent]);

  return (
    <Card>
      <Heading>
        Stability Pool
        <Flex sx={{ justifyContent: "flex-end" }}>
          <RemainingLQTY />
        </Flex>
      </Heading>
      <Box sx={{ p: [2, 3] }}>
        <InfoMessage title="You have no LUSD in the Stability Pool.">
          You can earn LUSD and LQTY rewards by depositing LUSD.
        </InfoMessage>

        <Flex variant="layout.actions">
          <Flex sx={{ justifyContent: "flex-start", flex: 1, alignItems: "center" }}>
            <Yield />
          </Flex>
            <Button onClick={handleOpenTrove}>Deposit</Button>
        </Flex>
      </Box>
    </Card>
  );
};
