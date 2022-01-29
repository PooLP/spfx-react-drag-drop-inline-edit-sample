// SPFX
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,

} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, } from '@microsoft/sp-webpart-base';
import { IDragDropInlineEditWebPartProps } from './IDragDropInlineEditWebPartProps';

// PropertyPane
export class DragDropInlineEditPropertyPane {

  private webpartContext: BaseClientSideWebPart<IDragDropInlineEditWebPartProps>;
  private _properties: IDragDropInlineEditWebPartProps;

  public constructor(
    webpartContext: BaseClientSideWebPart<IDragDropInlineEditWebPartProps>,
    _properties: IDragDropInlineEditWebPartProps,
   
  ) {
    this.webpartContext = webpartContext;
    this._properties = _properties;
  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
              ]
            }
          ]
        },        
      ]
    };
  }
}
