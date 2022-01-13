import { PersonaSize } from "@fluentui/react/lib/components/Persona/Persona.types";
import { IInputs } from "../generated/ManifestTypes";
import { ClassNames } from "./ClassNames";
import * as React from "react";
import { Stack } from "@fluentui/react/lib/components/Stack";
import { Label } from "@fluentui/react/lib/components/Label";
import { Persona } from "@fluentui/react/lib/Persona";

export interface IPersonaHoverCard {
    item: ComponentFramework.LookupValue | undefined | null;
    pcfContext: ComponentFramework.Context<IInputs>;
    label: string
}

export const PersonaHoverCard = (props: IPersonaHoverCard) => {
    const openRecord = () => {
        if (props.item && props.item !== null) {
            let options: ComponentFramework.NavigationApi.EntityFormOptions = {
                entityName: props.item.entityType,
                entityId: props.item.id,
                openInNewWindow: true
            };
            props.pcfContext.navigation.openForm(options);
        }
    }
    return (
        <Stack horizontal tokens={{childrenGap:10}}>
            <Stack.Item>
                <Label>{props.label}</Label>
            </Stack.Item>
            {props.item && <Stack.Item className={ClassNames.personaAsButton} onClick={openRecord}>
                <Persona text={props.item.name} size={PersonaSize.size24} />
            </Stack.Item>}
        </Stack>
    )
}