export class RetrieveAuditDetails{
    entity

    constructor(entity:{}){
        this.entity=entity
    }
    getMetadata(){
        let metadata={
            boundParameter: "entity",
			parameterTypes: {
				entity: { typeName: "mscrm.audit", structuralProperty: 5 }
			},
			operationType: 1, operationName: "RetrieveAuditDetails"
        }
        return metadata;
    }
}