import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DragDropInlineEditWebPartStrings';
import DragDropInlineEdit, { IItem } from './components/DragDropInlineEdit';
import { IDragDropInlineEditProps } from './components/IDragDropInlineEditProps';
import { IDragDropInlineEditWebPartProps } from './IDragDropInlineEditWebPartProps';
import { DragDropInlineEditPropertyPane } from './DragDropInlineEditWebPart.propertyPane';
import { DragDropInlineEditDetailPropertyPane } from './DragDropInlineEditWebPart.detailPropertyPane';

export default class DragDropInlineEditWebPart extends BaseClientSideWebPart<IDragDropInlineEditWebPartProps> {

  private _deferredPropertyPane: DragDropInlineEditPropertyPane | undefined;
  private _deferredDetailPropertyPane: DragDropInlineEditDetailPropertyPane | undefined;

  protected async onInit(): Promise<void> {
    await super.onInit();

    this.properties.items = this.properties.items ? this.properties.items : [];

  }

  public render(): void {
    const element: React.ReactElement<IDragDropInlineEditProps> = React.createElement(
      DragDropInlineEdit,
      {
        items: this.properties.items,
        displayMode: this.displayMode,
        onUpdateItems: (items: IItem[]) => {
          this.properties.items = items;
        },
        openDetailsPropertyPane: this.context.propertyPane.openDetails
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * Property pane
   */
  protected async loadPropertyPaneResources(): Promise<void> {
    const propertyPane = await import(
      /* webpackChunkName: 'drag-drop-inline-edit-property-pane'*/
      './DragDropInlineEditWebPart.propertyPane'
    );
    this._deferredPropertyPane = new propertyPane.DragDropInlineEditPropertyPane(
      this,
      this.properties,
    );

    // For non documented "getDetailsPaneConfiguration"
    //const detailPropertyPane = await import(
      /* webpackChunkName: 'drag-drop-inline-edit-detail-property-pane'*/
      //'./DragDropInlineEditWebPart.detailPropertyPane'
    //);
    //this._deferredDetailPropertyPane = new detailPropertyPane.DragDropInlineEditDetailPropertyPane();

  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }

  // For non documented "getDetailsPaneConfiguration"
  /*
  protected getDetailsPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredDetailPropertyPane!.getDetailsPaneConfiguration();
  }
  */

}
