import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { IProcessFlow, ProcessFlow } from "./components/ProcessFlow";
import { Entities, Status } from "./components/helpers/Constants";
export class QueueItemTracker implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private container: HTMLElement;
	private context: ComponentFramework.Context<IInputs>;
	private entityId:string;
	private entityTypeName:string;
	constructor() {

	}
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
		this.container = container;
		this.context = context;
		this.entityId=context.mode.contextInfo.entityId;
		this.entityTypeName=context.mode.contextInfo.entityTypeName;
	}
	public updateView(context: ComponentFramework.Context<IInputs>) {
		this.context = context;
		this.container = this.container;
		this.entityId=context.mode.contextInfo.entityId;
		this.entityTypeName=context.mode.contextInfo.entityTypeName;
		let props: IProcessFlow = {} as IProcessFlow;
		props.primaryEntityId = this.entityId;
		props.primaryEntity = this.entityTypeName;
		props.pcfContext = this.context;
				ReactDOM.render(
			React.createElement(ProcessFlow, props)
			, this.container
		);
	}

	public getOutputs(): IOutputs {
		return {};
	}

	public destroy(): void {
		ReactDOM.unmountComponentAtNode(this.container);
	}
}
