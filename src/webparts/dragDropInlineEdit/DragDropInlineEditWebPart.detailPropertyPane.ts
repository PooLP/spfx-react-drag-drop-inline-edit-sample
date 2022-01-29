// SPFX
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';

// PropertyPane
export class DragDropInlineEditDetailPropertyPane {

  public getDetailsPaneConfiguration(): IPropertyPaneConfiguration {

    console.log('do not return anything');

    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('Name', {
                  label: 'Name',
                  //value: this._properties.pnlAADTenantId
                }),
              ]
            }
          ]
        },        
      ]
    };
  }
}
