// React
import * as React from 'react';
import { FC, useState } from 'react';

// Styles
import styles from './DragDropInlineEdit.module.scss';

// SPFx
import { DisplayMode, Guid } from '@microsoft/sp-core-library';

// third party
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd';

// Fluent UI
import { useBoolean } from '@fluentui/react-hooks';
import { Panel } from 'office-ui-fabric-react/lib/Panel';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IconButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Text } from 'office-ui-fabric-react/lib/Text';

// Models
import { IDragDropInlineEditProps } from './IDragDropInlineEditProps';

export type IItem = {
  id: string;
  name: string;
};

export enum EnumEditType {
  create = 'create',
  update = 'update'
}

const DragDropInlineEdit: FC<IDragDropInlineEditProps> = (_props) => {

  const [charactersState, setCharactersState] = useState<IItem[]>(_props.items);
  const [currentCharacters, setCurrentCharacters] = useState<IItem>();
  const [editTypeState, setEditTypeState] = useState<EnumEditType>();
  const [messageBarState, setMessageBarState] = useState<string>();

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [showAlert, { toggle: toggleShowAlert }] = useBoolean(false);

  function handleOnDragEnd(result: DropResult, provided: ResponderProvided) {
    if (!result.destination) return;

    const items = Array.from(charactersState);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCharactersState(items);
    _props.onUpdateItems(items);
  }

  console.log(charactersState);

  return (
    <div className={styles.dragDropInlineEdit}>
      <>
        {_props.displayMode === DisplayMode.Edit &&
          <PrimaryButton
            onClick={() => {
              setEditTypeState(EnumEditType.create);
              setCurrentCharacters({ id: Guid.newGuid().toString(), name: '' });
              openPanel();

              // For non documented 'getDetailsPaneConfiguration'
              //_props.openDetailsPropertyPane(Guid.newGuid().toString()) 
            }}
          >
            Add item
          </PrimaryButton>
        }
      </>
      <>
        {charactersState.length > 0 &&
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='characters'>
              {(provided) => (
                <ul className='characters' {...provided.droppableProps} ref={provided.innerRef}>
                  {charactersState.map(({ id, name }, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index} isDragDisabled={_props.displayMode === DisplayMode.Read} >
                        {(providedDraggable) => (
                          <li ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps}>
                            {_props.displayMode === DisplayMode.Edit &&
                              <>
                                <IconButton
                                  iconProps={{ iconName: 'Edit' }}
                                  onClick={() => {
                                    setEditTypeState(EnumEditType.update);
                                    setCurrentCharacters(charactersState[index]);
                                    openPanel();

                                    // For non documented 'getDetailsPaneConfiguration'
                                    //_props.openDetailsPropertyPane(Guid.newGuid().toString()) 
                                  }} />
                                <IconButton
                                  iconProps={{ iconName: 'Delete' }}
                                  onClick={() => {
                                    const newCharacters = charactersState.filter(f => f.id !== id);
                                    setCharactersState(newCharacters);
                                    _props.onUpdateItems(newCharacters);

                                    // For non documented 'getDetailsPaneConfiguration'
                                    //_props.openDetailsPropertyPane(Guid.newGuid().toString()) 
                                  }} />
                              </>
                            }
                            <Text>
                              {name}
                            </Text>
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

        }
      </>
      <>
        {isOpen &&
          <Panel
            headerText='Config item'
            isOpen={isOpen}
            onDismiss={dismissPanel}
          >
            <Stack tokens={{ childrenGap: 16 }}>
              {showAlert && (
                <MessageBar
                  messageBarType={MessageBarType.error}
                >
                  {messageBarState}
                </MessageBar>
              )}
              <input type='hidden' name='id' value={currentCharacters.id} />
              <TextField
                label='Name'
                name='name'
                required={true}
                defaultValue={currentCharacters.name}
                onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => setCurrentCharacters({ ...currentCharacters, name: newValue })} /
              >
              <PrimaryButton type='submit' onClick={() => {
                const newCharaters = editTypeState === EnumEditType.create ? [...charactersState, currentCharacters] : [...charactersState.filter(f => f.id !== currentCharacters.id), currentCharacters];
                setCharactersState(newCharaters);
                _props.onUpdateItems(newCharaters);
                dismissPanel();
              }}
              >
                {editTypeState === EnumEditType.create ? 'Add item' : 'update item'}
              </PrimaryButton>
            </Stack>
          </Panel>
        }
      </>
    </div>
  );
};

export default DragDropInlineEdit;