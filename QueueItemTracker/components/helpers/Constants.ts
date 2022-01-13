export const ResourceKeys = {
    ERROR_AUDIT_DISABLED: "ERROR_AUDIT_DISABLED",
    ERROR_AUTOPOST_NOTFOUND: "ERROR_AUTOPOST_NOTFOUND",
    ERROR_AUDIT_ACCESS_MISSING: "ERROR_AUDIT_ACCESS_MISSING",
    INFO_AUDIT_RECORDS_NOT_FOUND: "INFO_AUDIT_RECORDS_NOT_FOUND",
    CASE_AUDIT_TOGGLE_LABEL: "CASE_AUDIT_TOGGLE_LABEL",
    PROGRESS_BAR_LABEL: "PROGRESS_BAR_LABEL",
    PROGRESS_BAR_DESC: "PROGRESS_BAR_DESC",
    QUEUEITEM_AUDIT_TOGGLE_LABEL: "QUEUEITEM_AUDIT_TOGGLE_LABEL",
    BUTTON_TEXT: "BUTTON_TEXT",
    BUTTON_TEXT_RENDER: "BUTTON_TEXT_RENDER",
    ERROR_GENERIC: "ERROR_GENERIC",
    RECORD_NOT_CREATED:"RECORD_NOT_CREATED",
    ERROR_AUDIT_DISABLED_SYS:"ERROR_AUDIT_DISABLED_SYS",
    ERROR_POST_ACCESS_MISSING:"ERROR_POST_ACCESS_MISSING",
    ACTION_NEW:"ACTION_NEW",
    ACTION_STATUS_CHANGED:"ACTION_STATUS_CHANGED",
    ACTION_REMOVED:"ACTION_REMOVED",
    ACTION_TRANSFERRED_USER:"ACTION_TRANSFERRED_USER",
    ACTION_TRANSFERRED_QUEUE:"ACTION_TRANSFERRED_QUEUE",
    ACTION_PICKED:"ACTION_PICKED",
    ACTION_RELEASED:"ACTION_RELEASED",
    TRANSITION_STATUS_CHANGED:"TRANSITION_STATUS_CHANGED",
    HOVERCARD_WORKEDBY_LABEL:"HOVERCARD_WORKEDBY_LABEL",
    HOVERCARD_QUEUE_LABEL:"HOVERCARD_QUEUE_LABEL"
} as const

export const Entities = {
    Organization:{
        logicalName:"organization",
        attributes:{
           isAuditEnabled :"isauditenabled"
        }
    },
    Post: {
        logicalName: "post",
        attributes: {
            text: "text",
            createdOn: "createdon"
        }
    },
    Privilege:{
        logicalName:"privilege",
        attribute:{
            privilegeId:"privilegeid",
            name:"name"
        }
    },
    RolePrivilege:{
        logicalName:"roleprivileges",
        attribute:{
            roleId:"roleid"
        }
    },
    QueueItem: {
        logicalName: "queueitem"
    },
    Audit: {
        logicalName: "audit",
        attributes: {
            auditId: "auditid",
            objectId: "objectid",
            objectIdValue: "_objectid_value",
            action: "action",
            actionFormattedValue: "action@OData.Community.Display.V1.FormattedValue",
            createdOn: "createdon",
            userId: "userid",
            userIdFormattedValue: "_userid_value@OData.Community.Display.V1.FormattedValue",
            userIdValue: "_userid_value",
            userIdEntityType: "_userid_value@Microsoft.Dynamics.CRM.lookuplogicalname",
            objectTypeCode: "objecttypecode",
            attributeMask: "attributemask",

        }
    },
    PostRuleConfig: {
        logicalName: "msdyn_postruleconfig",
        attributes: {
            postRuleConfigId: "msdyn_postruleconfigid",
            ruleId: "msdyn_ruleid",
            stateCode: "statecode"
        }
    }
} as const

export const Action = {
    addToQueue: {
        name: "Add To Queue",
        value: 52
    },
    create: {
        name: "Create",
        value:1
    },
    update: {
        name: "Update",
        value :2
    },
    delete: {
        name: "Delete",
        value:3

    }
} as const


export const AttributeMaskValues = {
    stateCode: "10086"
} as const

export const AuditDetails = {
    workerId: "workerid",
    workerIdValue: "_workerid_value",
    queueId: "queueid",
    queueIdValue: "_queueid_value",
    stateCode: "statecode",
    stateCodeFormattedValue: "statecode@OData.Community.Display.V1.FormattedValue",
    statusCodeFormattedValue: "statuscode@OData.Community.Display.V1.FormattedValue"

} as const

export const Status = {
    Active: "0"
}