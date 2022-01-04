import { Label } from "@fluentui/react/lib/components/Label";
import { IPersonaSharedProps, Persona, PersonaSize } from "@fluentui/react/lib/components/Persona";
import { Stack } from "@fluentui/react/lib/components/Stack";
import * as React from "react";
import { ClassNames } from "./ClassNames";
import { HoverCard, HoverCardType, IHoverCardProps } from "@fluentui/react/lib/components/HoverCard";
import { DefaultPalette } from "@fluentui/style-utilities/lib/styles/DefaultPalette";
import { IInputs } from "../generated/ManifestTypes";
import {PersonaHoverCard} from "./PersonaHoverCard";


export interface IFlowCard {
  transitionReason: string|undefined;
  modifiedBy: ComponentFramework.LookupValue|undefined;
  modifiedOn: string;
  action: string|undefined;
  workedBy:ComponentFramework.LookupValue|undefined|null;
  queue:ComponentFramework.LookupValue|undefined|null;
  pcfContext:ComponentFramework.Context<IInputs>;
  entityName:string
}

DefaultPalette.themeSecondary
export const FlowCard = (props: IFlowCard) => {
  const _onRenderPlainCard=()=>{
    return(
      <Stack tokens={{childrenGap:5,padding:5}} styles={{root:{
        border: `1px solid ${DefaultPalette.themeSecondary}`
      }}}>
        <Stack.Item>
          <PersonaHoverCard item={props.workedBy} label="Worked By : " pcfContext={props.pcfContext} />
        </Stack.Item>
        <Stack.Item>
        <PersonaHoverCard item={props.queue} label="Queue : " pcfContext={props.pcfContext} />
        </Stack.Item>
      </Stack>
      )
  }
  const hoverCardProps: IHoverCardProps = {
    type: HoverCardType.plain,
    plainCardProps: {
      onRenderPlainCard: _onRenderPlainCard
    
    }
  }
  return (
    <div>
      <Stack horizontal>
        <Stack.Item>
          <Stack>
            <Stack.Item align="center">
              <div>{props.action}</div>
            </Stack.Item>
            <Stack.Item>
              <Stack horizontal>
                <div className={ClassNames.arrowTail}></div>
                <div className={ClassNames.arrowHead}></div>
              </Stack>
            </Stack.Item>
            <Stack.Item align="center">
              {props.modifiedBy&&<Persona text={props.modifiedBy.name} size={PersonaSize.size24} />}
            </Stack.Item>
            <Stack.Item align="center">
              <Label>{props.modifiedOn}</Label>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack.Item className={ClassNames.TransitionLabel}>
            <Stack.Item align="center">
              <HoverCard {...hoverCardProps}>
              <Label className={ClassNames.State}>{props.transitionReason}</Label>
              </HoverCard>
            </Stack.Item>
        </Stack.Item>
      </Stack>
    </div>
  );
};
