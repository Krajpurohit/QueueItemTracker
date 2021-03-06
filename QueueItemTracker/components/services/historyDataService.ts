import { IInputs } from "../../generated/ManifestTypes";
import { IFlowCard } from "../FlowCard";
import { Action, AuditDetails, Entities, ResourceKeys } from "../helpers/Constants";
import { IChangeHistory } from "./auditService";

export class historyDataService {
    changeHistories: IChangeHistory[];
    context: ComponentFramework.Context<IInputs>;
    primaryEntity: string;
    constructor(changeHistories: IChangeHistory[], context: ComponentFramework.Context<IInputs>, primaryEntity: string) {
        this.changeHistories = this.sortByCreatedOn(changeHistories);
        this.context = context;
        this.primaryEntity = primaryEntity;

    }
    sortByCreatedOn(changeHistories: IChangeHistory[]): IChangeHistory[] {
        return changeHistories !== [] ? changeHistories.sort(function (current: any, previous: any) {
            return (new Date(current.createdOn).getTime() - new Date(previous.createdOn).getTime());
        }) : []
    }
    prepareData(): IFlowCard[] {
        let flowCards: IFlowCard[] = [];
        this.changeHistories.forEach((changeHistory, index) => {
            let flowCard: IFlowCard = {
                action: this.fetchAction(changeHistory),
                modifiedBy: changeHistory.createdBy,
                transitionReason: this.fetchTransitionStageLabel(changeHistory),
                modifiedOn: this.formatDate(changeHistory.createdOn),
                workedBy: this.fetchWorkedBy(changeHistory, index, flowCards, AuditDetails.workerId),
                queue: this.fetchWorkedBy(changeHistory, index, flowCards, AuditDetails.queueId),
                pcfContext: this.context,
                entityName: changeHistory.entity
            }
            flowCards.push(flowCard);
        });
        return flowCards.length > 0 ? flowCards.filter(card=>card.action).map(flowCard => ({ ...flowCard, action: flowCard.action?.replace(" To Another Queue", "").replace(" To Another User", "") })) : [];
    }
    stringFormat(text: string, ...args: string[]): string {
        return text.replace(/{(\d+)}/g, (match, num) => {
          return typeof args[num] !== 'undefined' ? args[num] : match;
        });
      }
    formatDate(date: string): string {
        let dateValue: any = new Date(date);
        let dateFormatting = this.context.userSettings.dateFormattingInfo;
        return `${dateValue.format(dateFormatting.shortDatePattern)} ${dateValue.format(dateFormatting.shortTimePattern)}`;
    }
    fetchTransitionStageLabel(history: IChangeHistory): string | undefined {
        let action = this.fetchAction(history);
        if (action !== this.context.resources.getString(ResourceKeys.ACTION_STATUS_CHANGED)) {
            return action;
        }
        else {
            if (Object.keys(history.details.AuditDetail.NewValue).indexOf(AuditDetails.stateCode) !== -1) {
                return history.details.AuditDetail.NewValue[AuditDetails.stateCodeFormattedValue];
            }
            else {
                return this.stringFormat(this.context.resources.getString(ResourceKeys.TRANSITION_STATUS_CHANGED),history.details.AuditDetail.NewValue[AuditDetails.statusCodeFormattedValue]);
            }
        }
    }
    fetchWorkedBy(history: IChangeHistory, index: number, flowCards: IFlowCard[], attribute: string): ComponentFramework.LookupValue | null | undefined {
        if (history.entity === Entities.QueueItem.logicalName) {
            if (Object.keys(history.details.AuditDetail.NewValue).indexOf(`_${attribute}_value`) !== -1) {
                return { name: history.details.AuditDetail.NewValue[`_${attribute}_value@OData.Community.Display.V1.FormattedValue`], id: history.details.AuditDetail.NewValue[`_${attribute}_value`], entityType: history.details.AuditDetail.NewValue[`_${attribute}_value@Microsoft.Dynamics.CRM.lookuplogicalname`] }
            }
            else {
                if (history.action === Action.delete.name || index === 0)
                    return null;
                else {
                    if (Object.keys(history.details.AuditDetail.OldValue).indexOf(`_${attribute}_value`) === -1)
                        return attribute === AuditDetails.workerId ? flowCards[index - 1].workedBy : flowCards[index - 1].queue;
                    else return null;
                }
            }
        }
        else {
            if (index === 0) {
                return null;
            }
            else {
                return attribute === AuditDetails.workerId ? flowCards[index - 1].workedBy : flowCards[index - 1].queue;
            }
        }
    }
    fetchAction(history: IChangeHistory): string | undefined {
        switch (history.actionValue) {
            case Action.create.value: {
                return this.context.resources.getString(ResourceKeys.ACTION_NEW);
                break;
            }
            case Action.addToQueue.value: {
                return history.action;
                break;
            }
            case Action.update.value: {
                if (history.entity === this.primaryEntity) {
                    return this.context.resources.getString(ResourceKeys.ACTION_STATUS_CHANGED);
                }
                else {
                    if (Object.keys(history.details.AuditDetail.NewValue).indexOf(AuditDetails.workerIdValue) !== -1 && Object.keys(history.details.AuditDetail.OldValue).indexOf(AuditDetails.workerIdValue) === -1) {
                        return this.context.resources.getString(ResourceKeys.ACTION_PICKED);
                    }
                    else if (Object.keys(history.details.AuditDetail.NewValue).indexOf(AuditDetails.workerIdValue) !== -1 && Object.keys(history.details.AuditDetail.OldValue).indexOf(AuditDetails.workerIdValue) !== -1) {
                        return this.context.resources.getString(ResourceKeys.ACTION_TRANSFERRED_USER);
                    }
                    else if (Object.keys(history.details.AuditDetail.NewValue).indexOf(AuditDetails.queueIdValue) !== -1 && Object.keys(history.details.AuditDetail.OldValue).indexOf(AuditDetails.queueIdValue) !== -1) {
                        return this.context.resources.getString(ResourceKeys.ACTION_TRANSFERRED_QUEUE);
                    }
                    if (Object.keys(history.details.AuditDetail.NewValue).indexOf(AuditDetails.workerIdValue) === -1 && Object.keys(history.details.AuditDetail.OldValue).indexOf(AuditDetails.workerIdValue) !== -1) {
                        return this.context.resources.getString(ResourceKeys.ACTION_RELEASED);
                    }
                }
                break;
            }
            case Action.delete.value: {
                if (history.entity === Entities.QueueItem.logicalName) {
                    return this.context.resources.getString(ResourceKeys.ACTION_REMOVED);
                    break
                }
            }
            default:
                return "";

        }
    }

}