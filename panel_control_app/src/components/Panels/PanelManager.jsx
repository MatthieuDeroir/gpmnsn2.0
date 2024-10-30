// src/components/PanelManager.js
import React, { useState } from 'react';
import './PanelManager.css';
import websocketClient from '../../utils/websocketClient';
import PanelControl from './PanelControl';
import AllPanel from './AllPanel'; // Import remains the same
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="draggable-panel"
    >
      {props.children}
    </div>
  );
}

function PanelManager() {
  const [heartbeatTimer, setHeartbeatTimer] = useState(5);

  const [panels, setPanels] = useState([
    { id: 'indret', name: 'indret' },
    { id: 'aval', name: 'aval' },
    { id: 'amont', name: 'amont' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPanels((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={panels} strategy={rectSortingStrategy}>
          <div className="panel-controls">
            {panels.map((panel) => (
              <SortableItem key={panel.id} id={panel.id}>
                <PanelControl name={panel.name} heartbeatTimer={heartbeatTimer} />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="all-control">
        <AllPanel heartbeatTimer={heartbeatTimer} setHeartbeatTimer={setHeartbeatTimer} />
      </div>
    </>
  );
}

export default PanelManager;
