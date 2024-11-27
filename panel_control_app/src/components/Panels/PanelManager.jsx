// src/components/PanelManager.js

import React from 'react';
import './PanelManager.css';
import PanelControl from './PanelControl';
import AllPanel from './AllPanel';
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
import { useSelector } from 'react-redux'; // Importer useSelector

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
    const [panels, setPanels] = React.useState([
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

    // Récupérer isAnyPanelInDysfunction depuis le store Redux
    const isAnyPanelInDysfunction = useSelector(
        (state) => state.websocket.isAnyPanelInDysfunction
    );

    // Déterminer la classe CSS en fonction de isAnyPanelInDysfunction
    const panelManagerClassName = isAnyPanelInDysfunction
        ? 'panel-manager dysfunction'
        : 'panel-manager';

    return (
        <div className={panelManagerClassName}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={panels} strategy={rectSortingStrategy}>
                    <div className="panel-controls">
                        {panels.map((panel) => (
                            <SortableItem key={panel.id} id={panel.id}>
                                <PanelControl name={panel.name} />
                            </SortableItem>
                        ))}
                    </div>
                    <div className="all-control">
                        <AllPanel />
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

export default PanelManager;
