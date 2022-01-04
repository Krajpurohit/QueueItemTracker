import { IInputs } from "../../generated/ManifestTypes";
import { Entities, Status } from "../helpers/Constants";

export class permissionService {
  context: ComponentFramework.Context<IInputs>;
  primaryEntity: string
  constructor(context: ComponentFramework.Context<IInputs>, primaryEntity: string) {
    this.context = context;
    this.primaryEntity = primaryEntity;
  }

  async hasMiscellaneousPrivilege(privilege: string) {
    let roles = this.context.userSettings.securityRoles;
    let conditions = "";
    roles.forEach((role, index) => {
      conditions += `<value>${role}</value>`
    });
    if (conditions !== "") {
      let fetchXml = `<fetch>
            <entity name="${Entities.Privilege.logicalName}" >
              <attribute name="${Entities.Privilege.attribute.privilegeId}" />
              <filter>
                <condition attribute="${Entities.Privilege.attribute.name}" operator="eq" value="${privilege}" />
              </filter>
              <link-entity name="${Entities.RolePrivilege.logicalName}" from="${Entities.Privilege.attribute.privilegeId}" to="${Entities.Privilege.attribute.privilegeId}" intersect="true" >
                <filter>
                  <condition attribute="${Entities.RolePrivilege.attribute.roleId}" operator="in" >
                    ${conditions}
                  </condition>
                </filter>
              </link-entity>
            </entity>
          </fetch>`
      let privileges = await this.context.webAPI.retrieveMultipleRecords(Entities.Privilege.logicalName, `?fetchXml=${fetchXml}`)
      return privileges.entities.length > 0;
    }
    else
      return false;
  }
  async checkActivityFeedRule() {
    let rules = await this.context.webAPI.retrieveMultipleRecords(Entities.PostRuleConfig.logicalName, `?$select=${Entities.PostRuleConfig.attributes.postRuleConfigId},${Entities.PostRuleConfig.attributes.ruleId}&$filter=(${Entities.PostRuleConfig.attributes.ruleId} eq 'AddToQueue.Rule' and ${Entities.PostRuleConfig.attributes.stateCode} eq ${Status.Active})`);
    return rules.entities.length > 0
  }
  async isAuditEnabled() {
    //@ts-ignore
    let orgSettings = await this.context.webAPI.retrieveRecord(Entities.Organization.logicalName, this.context.orgSettings.attributes.organizationid, `?$select=${Entities.Organization.attributes.isAuditEnabled}`)
    return orgSettings[Entities.Organization.attributes.isAuditEnabled];
  }


  async checkMetadata() {
    let primaryEntityMetadata = await this.context.utils.getEntityMetadata(this.primaryEntity);
    let queueItemMetadata = await this.context.utils.getEntityMetadata(Entities.QueueItem.logicalName);
    let systemAuditStatus = await this.isAuditEnabled();
    return systemAuditStatus && primaryEntityMetadata._entityDescriptor.IsAuditEnabled.Value && queueItemMetadata._entityDescriptor.IsAuditEnabled.Value;
  }
}