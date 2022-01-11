import { IInputs } from "../../generated/ManifestTypes";
import { Action, AttributeMaskValues, Entities } from "../helpers/Constants";
import { RetrieveAuditDetails } from "../helpers/WebApiHelper";

export interface IChangeHistory {
    auditId: string;
    action: string;
    entity: string;
    createdOn: string;
    createdBy: ComponentFramework.LookupValue;
    details: any;
    entityId: string;
}

export class auditService {
    context: ComponentFramework.Context<IInputs>;
    primaryEntity: string;
    primaryEntityId: string;

    constructor(context: ComponentFramework.Context<IInputs>, primaryEntity: string, primaryEntityId: string) {
        this.context = context;
        this.primaryEntity = primaryEntity;
        this.primaryEntityId = primaryEntityId;
    }

    async fetchRecordHistories(): Promise<IChangeHistory[]> {
        let changeHistories: IChangeHistory[] = [];
        let posts = await this.fetchPosts();
        let queueItemConditions = await this.fetchAddtoQueueAudits(posts);
        changeHistories = await this.fetchAuditHistories(queueItemConditions);
        if (changeHistories !== []) {
            return this.changeHistoryCleanup(changeHistories);
        }
        return changeHistories;
    }
    changeHistoryCleanup(histories: IChangeHistory[]): IChangeHistory[] {
        let unwantedQueueItems = histories.filter(history => {
            history.action === Action.addToQueue.name && history.details.AuditDetail.NewValue[Entities.Audit.attributes.objectIdValue] !== this.primaryEntityId
        })
        let unwantedQueueItemList = unwantedQueueItems.map(unwantenItem => unwantenItem.entityId);
        return histories.filter(history => !unwantedQueueItemList.includes(history.entityId));
    }

    async fetchAuditHistories(queueItemConditions: string): Promise<IChangeHistory[]> {
        let changeHistories: IChangeHistory[] = [];
        let auditFetch = `<fetch>
		<entity name="${Entities.Audit.logicalName}" >
		  <attribute name="${Entities.Audit.attributes.auditId}" />
		  <attribute name="${Entities.Audit.attributes.createdOn}" />
		  <attribute name="${Entities.Audit.attributes.userId}" />
		  <attribute name="${Entities.Audit.attributes.action}" />
		  <attribute name="${Entities.Audit.attributes.objectId}" />
		  <attribute name="${Entities.Audit.attributes.objectTypeCode}" />
          <attribute name="${Entities.Audit.attributes.attributeMask}" />
		  <filter type="or" >		  
		  <condition attribute="${Entities.Audit.attributes.objectId}" operator="eq" value="${this.primaryEntityId}" />
			${queueItemConditions}  </filter>
                </entity>
            </fetch>`
        let allAudits = await this.context.webAPI.retrieveMultipleRecords(Entities.Audit.logicalName, `?fetchXml=${encodeURIComponent(auditFetch)}`);
        let requests: any = [];
        allAudits.entities.forEach((audit, index) => {
            if (audit[Entities.Audit.attributes.objectTypeCode] === this.primaryEntity && audit[Entities.Audit.attributes.attributeMask].indexOf(AttributeMaskValues.stateCode) === -1) {
                return;
            }
            let entity: any = {};
            let changeHistory: IChangeHistory = {} as IChangeHistory;
            entity.entityType = Entities.Audit.logicalName;
            entity.id = audit[Entities.Audit.attributes.auditId];
            let request = new RetrieveAuditDetails(entity);
            requests.push(request);
            changeHistory.auditId = audit[Entities.Audit.attributes.auditId];
            changeHistory.action = audit[Entities.Audit.attributes.actionFormattedValue];
            changeHistory.entity = audit[Entities.Audit.attributes.objectTypeCode];
            changeHistory.createdOn = audit[Entities.Audit.attributes.createdOn];
            changeHistory.createdBy = { name: audit[Entities.Audit.attributes.userIdFormattedValue], id: audit[Entities.Audit.attributes.userIdValue], entityType: audit[Entities.Audit.attributes.userIdEntityType] }
            changeHistory.entityId = audit[Entities.Audit.attributes.objectIdValue];
            changeHistories.push(changeHistory);
        });
        //@ts-ignore
        let allChanges = requests.length >0 ? await this.context.webAPI.executeMultiple(requests) : [];
        allChanges.forEach(async (change: any, index: number) => {
            let record = await change.json();
            changeHistories[index].details = record;
        });
        return changeHistories;
    }

    async fetchAddtoQueueAudits(posts: ComponentFramework.WebApi.RetrieveMultipleResponse): Promise<string> {
        let queueItemDateConditions: string = "";
        let queueItemConditions: string = "";
        posts.entities.forEach(post => {
            let createdOn = new Date(post[Entities.Post.attributes.createdOn]);
            let lowerlimit = new Date(createdOn.getTime() - 1000);
            let upperlimit = new Date(createdOn.getTime() + 1000);
            queueItemDateConditions += `<filter type="and" >
			<condition attribute="${Entities.Audit.attributes.createdOn}" operator="gt" value="${lowerlimit.toISOString()}" />
			<condition attribute="${Entities.Audit.attributes.createdOn}" operator="lt" value="${upperlimit.toISOString()}" />	
			</filter>`;
        });
        queueItemDateConditions = queueItemDateConditions !== "" ? `
		<filter type="and"><condition attribute="${Entities.Audit.attributes.action}" operator="eq" value="${Action.addToQueue.value}"/><filter type="or">${queueItemDateConditions}</filter></filter>` : "";
        if (queueItemDateConditions != "") {
            let fetchXml = `<fetch>
		<entity name="${Entities.Audit.logicalName}" >
		  <attribute name="${Entities.Audit.attributes.auditId}" />
		  <attribute name="${Entities.Audit.attributes.objectId}" />
			${queueItemDateConditions}
		</entity>
	  </fetch>`;
            let addToQueueAudits = await this.context.webAPI.retrieveMultipleRecords(Entities.Audit.logicalName, `?fetchXml=${encodeURIComponent(fetchXml)}`) ?? [];
            addToQueueAudits.entities.forEach(addToQueueAudit => {
                queueItemConditions += `
			<condition attribute="${Entities.Audit.attributes.objectId}" operator="eq" value="${addToQueueAudit[Entities.Audit.attributes.objectIdValue]}" />`;
            });
        }
        return queueItemConditions;
    }

    async fetchPosts(): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> {
        return await this.context.webAPI.retrieveMultipleRecords(Entities.Post.logicalName, `?$select=${Entities.Post.attributes.text},${Entities.Post.attributes.createdOn}&$filter=(contains(${Entities.Post.attributes.text}, '%25AddToQueue%25') and contains(${Entities.Post.attributes.text}, '%25${this.primaryEntityId}%25'))`) ?? [];
    }
}