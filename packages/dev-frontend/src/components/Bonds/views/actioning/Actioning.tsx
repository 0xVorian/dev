/** @jsxImportSource theme-ui */
import React from "react";
import { Flex, Heading, Grid, Close, Box } from "theme-ui";
import { Decimal } from "@liquity/lib-base";
import { Record } from "../../Record";
import { useBondView } from "../../context/BondViewContext";
import { HorizontalTimeline, Label, SubLabel } from "../../../HorizontalTimeline";
import type { EventType } from "../../../HorizontalTimeline";
import * as l from "../../lexicon";
import { stub } from "../../context/BondViewProvider";
import { Cancel } from "./actions/cancel/Cancel";
import { Claim } from "./actions/claim/Claim";
import { Warning } from "../../../Warning";
import { ReactModal } from "../../../ReactModal";

const getCurrentReturn = (accrued: Decimal, deposit: Decimal, marketPrice: Decimal): string => {
  const accruedLusdValue = accrued.mul(marketPrice);
  if (accruedLusdValue.lt(deposit)) {
    return (parseFloat(accruedLusdValue.toString()) - parseFloat(deposit.toString())).toFixed(2);
  }
  return accruedLusdValue.sub(deposit).prettify(2);
};

export const Actioning: React.FC = () => {
  const { dispatchEvent, view, selectedBond: bond, protocolInfo } = useBondView();

  const handleDismiss = () => {
    dispatchEvent("ABORT_PRESSED");
  };

  if (bond === undefined) return null;

  const bondStartTimeSeconds = bond.startTime * 1000;
  const currentReturn =
    protocolInfo && getCurrentReturn(bond.accrued, bond.deposit, protocolInfo.marketPrice);

  let Actions;
  switch (view) {
    case "CANCELLING": {
      Actions = <Cancel />;
      break;
    }
    case "CLAIMING": {
      Actions = <Claim />;
      break;
    }
  }

  const events: EventType[] = [
    {
      date: new Date(bondStartTimeSeconds),
      label: (
        <>
          <Label>{l.BOND_CREATED.term}</Label>
          <SubLabel>{`0 bLUSD`}</SubLabel>
        </>
      )
    },
    {
      date: new Date(bond.breakEvenTime * 1000),
      label: (
        <>
          <Label>{l.BREAK_EVEN_TIME.term}</Label>
          <SubLabel>{`${bond.breakEvenAccrual.prettify()} bLUSD`}</SubLabel>
        </>
      )
    },
    {
      date: new Date(bond.rebondTime * 1000),
      label: (
        <>
          <Label>{l.OPTIMUM_REBOND_TIME.term}</Label>
          <SubLabel>{`${bond.rebondAccrual.prettify()} bLUSD`}</SubLabel>
        </>
      )
    },
    {
      date: new Date(Date.now()),
      label: (
        <>
          <Label
            description="Number of bLUSD this bond has accrued so far."
            style={{ fontWeight: 500 }}
          >
            Accrued
          </Label>
          <SubLabel>{`${bond.accrued.prettify(4)} bLUSD`}</SubLabel>
        </>
      ),
      isSelected: bond.status === "PENDING"
    }
  ];

  return (
    <ReactModal onDismiss={handleDismiss}>
      <Heading as="h2" sx={{ pt: 2, pb: 3, px: 2 }}>
        <Flex sx={{ justifyContent: "center" }}>
          {view === "CANCELLING" ? l.CANCEL_BOND.term : l.CLAIM_BOND.term}
        </Flex>
        <Close
          onClick={handleDismiss}
          sx={{
            position: "absolute",
            right: "24px",
            top: "24px"
          }}
        />
      </Heading>
      <Flex m={4} sx={{ justifyContent: "center" }}>
        <HorizontalTimeline events={events} />
      </Flex>
      <Grid gap="12px" columns={3} sx={{ my: 4, justifyItems: "center" }}>
        <Record
          name={l.BOND_DEPOSIT.term}
          value={bond.deposit.prettify(2)}
          type="LUSD"
          description={l.BOND_DEPOSIT.description}
        />

        <Record
          name={l.MARKET_VALUE.term}
          value={bond.marketValue.prettify(2)}
          type="LUSD"
          description={l.MARKET_VALUE.description}
        />

        <Record
          name={l.BOND_RETURN.term}
          value={currentReturn}
          type="LUSD"
          description={l.BOND_RETURN.description}
        />
      </Grid>
      <details>
        <summary sx={{ pl: 2, mt: 4, cursor: "pointer" }}>Rebond estimations</summary>
        <Grid gap="20px" columns={3} sx={{ my: 2, justifyItems: "center" }}>
          <Record
            name={l.REBOND_RETURN.term}
            value={bond.rebondReturn.prettify(2)}
            type="LUSD"
            description={l.REBOND_RETURN.description}
          />

          <Record
            name={l.REBOND_TIME_ROI.term}
            value={stub.roi}
            type=""
            description={l.REBOND_TIME_ROI.description}
          />

          <Record
            name={l.OPTIMUM_APY.term}
            value={stub.apy}
            type=""
            description={l.OPTIMUM_APY.description}
          />
        </Grid>
      </details>
      <Box mt={3} />
      {view === "CLAIMING" && currentReturn && parseFloat(currentReturn) < 0 && (
        <Warning>You are claiming a bond which currently has a negative return</Warning>
      )}
      {view === "CLAIMING" && bond.accrued.gte(bond.rebondAccrual) && (
        <Warning>Your bond is ready to rebond - you've accrued more bLUSD than required</Warning>
      )}
      {view === "CANCELLING" && bond.accrued.gte(bond.breakEvenAccrual) && (
        <Warning>Your are cancelling a bond which has accrued a positive return</Warning>
      )}
      {Actions}
    </ReactModal>
  );
};
