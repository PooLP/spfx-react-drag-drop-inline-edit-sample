import { DisplayMode } from '@microsoft/sp-core-library';
import { IItem } from './DragDropInlineEdit';

export interface IDragDropInlineEditProps {
  items : IItem[];
  displayMode: DisplayMode;
  onUpdateItems : (items : IItem[])=> void;
  openDetailsPropertyPane: (context?: any)=> void;
}
