import { FlowCard, IFlowCard } from "./FlowCard";
import { ClassNames } from "./ClassNames";
import { Stack } from "@fluentui/react/lib/components/Stack";
import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { auditService, IChangeHistory } from "./services/auditService";
import { historyDataService } from "./services/historyDataService";
import { MessageBar } from "@fluentui/react/lib/components/MessageBar/MessageBar";
import { DefaultButton } from "@fluentui/react/lib/components/Button/DefaultButton/DefaultButton";
import { ProgressIndicator } from "@fluentui/react/lib/components/ProgressIndicator/ProgressIndicator";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { Toggle } from "@fluentui/react/lib/components/Toggle";
import { Entities, ResourceKeys } from "./helpers/Constants";
import { permissionService } from "./services/permissionService";

export interface IProcessFlow {
  pcfContext: ComponentFramework.Context<IInputs>,
  primaryEntity: string,
  primaryEntityId: string
}

export const ProcessFlow = (props: IProcessFlow) => {
  initializeIcons();
  const [cards, setCards] = React.useState<IFlowCard[]>([]);
  const [allcards, setAllCards] = React.useState<IFlowCard[]>([]);
  const [isInProgress, setIsInProgress] = React.useState(false);
  const [showFlow, setIsShowFlow] = React.useState(false);
  const [isMessageBarVisible, setIsMessageBarVisisble] = React.useState(false);
  const [messageBarText, setMessageBarText] = React.useState("");
  const [buttonText, setButtonText] = React.useState(props.pcfContext.resources.getString(ResourceKeys.BUTTON_TEXT));
  const [isCaseChangesHidden, setIsCaseChangesHidden] = React.useState(false);
  const [isQueueItemChangesHidden, setIsQueueItemChangesHidden] = React.useState(false);
  const [buttonhidden, hideButton] = React.useState(false);
  const toggleChanges = (ev: React.MouseEvent<HTMLElement, MouseEvent>, entityName: string, checked?: boolean) => {
    if (checked) {
      setCards(allcards.filter(card => card.entityName !== entityName));
      if (entityName === props.primaryEntity) {
        setIsCaseChangesHidden(true);
      }
      else {
        setIsQueueItemChangesHidden(true);
      }
    }
    else {
      setCards(allcards);
      if (entityName === props.primaryEntity) {
        setIsCaseChangesHidden(false);
      }
      else {
        setIsQueueItemChangesHidden(false);
      }

    }
  }
  const generateFlow = async () => {
    let permissionSvc = new permissionService(props.pcfContext, props.primaryEntity);
    let error = `${props.pcfContext.resources.getString(ResourceKeys.ERROR_GENERIC)} \n`;;
    if (!await permissionSvc.isAuditEnabled()) {
      error += `${props.pcfContext.resources.getString(ResourceKeys.ERROR_AUDIT_DISABLED_SYS)} \n`;
    }
    if (!await permissionSvc.hasMiscellaneousPrivilege("prvReadAuditSummary")) {
      error += `${props.pcfContext.resources.getString(ResourceKeys.ERROR_AUDIT_ACCESS_MISSING)} \n`;
    }
    if (!await permissionSvc.checkActivityFeedRule()) {
      error += `${props.pcfContext.resources.getString(ResourceKeys.ERROR_AUTOPOST_NOTFOUND)} \n`;
    }
    if (!props.pcfContext.utils.hasEntityPrivilege(Entities.Post.logicalName, 2, 2)) {
      error += `${props.pcfContext.resources.getString(ResourceKeys.ERROR_POST_ACCESS_MISSING)}`;
    }
    if (error !== `${props.pcfContext.resources.getString(ResourceKeys.ERROR_GENERIC)} \n`) {
      setIsMessageBarVisisble(true);
      setMessageBarText(error);
    }
    else {
      setIsInProgress(true);
      let auditSvc = new auditService(props.pcfContext, props.primaryEntity, props.primaryEntityId);
      let changeHistories: IChangeHistory[] = await auditSvc.fetchRecordHistories();
      let historyDataSvc = new historyDataService(changeHistories, props.pcfContext, props.primaryEntity);
      let cards: IFlowCard[] = await historyDataSvc.prepareData();

      setIsInProgress(false);
      if (cards.length > 0) {
        setButtonText(props.pcfContext.resources.getString(ResourceKeys.BUTTON_TEXT_RENDER));
        setCards(cards);
        setAllCards(cards);
        setIsShowFlow(true);
        setMessageBarText("");
        setIsMessageBarVisisble(false);
      }
      else {
        setMessageBarText(props.pcfContext.resources.getString(ResourceKeys.INFO_AUDIT_RECORDS_NOT_FOUND));
        setIsMessageBarVisisble(true);
      }
    }
  }

  React.useEffect(() => {
    if (!props.primaryEntityId) {
      setIsMessageBarVisisble(true);
      setMessageBarText(props.pcfContext.resources.getString(ResourceKeys.RECORD_NOT_CREATED));
      hideButton(true);
    }
    else {
      setIsMessageBarVisisble(false);
      setMessageBarText("");
      hideButton(false);
    }
  }, [props.primaryEntityId]);
  return (
    <div className={ClassNames.Wrapper}>
      <Stack tokens={{ childrenGap: 5, padding: 5 }}>{isMessageBarVisible &&
        <Stack.Item>
          <MessageBar isMultiline={true}>
            {messageBarText}
          </MessageBar>
        </Stack.Item>}
        <Stack.Item>
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            {!buttonhidden && <DefaultButton
              name={buttonText}
              text={buttonText}
              onClick={generateFlow}
              iconProps={{ iconName: 'Processing' }}
            />}
            {showFlow && <Toggle label={props.pcfContext.resources.getString(ResourceKeys.CASE_AUDIT_TOGGLE_LABEL)} inlineLabel disabled={isQueueItemChangesHidden} checked={isCaseChangesHidden} onChange={(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) => toggleChanges(ev, props.primaryEntity, checked)} />}
            {showFlow && <Toggle label={props.pcfContext.resources.getString(ResourceKeys.QUEUEITEM_AUDIT_TOGGLE_LABEL)} inlineLabel disabled={isCaseChangesHidden} checked={isQueueItemChangesHidden} onChange={(ev: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) => toggleChanges(ev, "queueitem", checked)} />}
          </Stack>
        </Stack.Item>
        <Stack.Item>
          {isInProgress && <ProgressIndicator label={props.pcfContext.resources.getString(ResourceKeys.PROGRESS_BAR_LABEL)} description={props.pcfContext.resources.getString(ResourceKeys.PROGRESS_BAR_DESC)}></ProgressIndicator>}
        </Stack.Item>
      </Stack>
      {showFlow &&
        <Stack horizontal>{cards.map(((card, item) => {
          return <FlowCard key={item} {...card} />;
        }))}</Stack>}
    </div>
  );
};
