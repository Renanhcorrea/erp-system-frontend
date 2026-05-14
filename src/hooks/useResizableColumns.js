import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_MIN_WIDTH = 60;
const DEFAULT_MAX_WIDTH = 200;

export default function useResizableColumns(initialWidths, minWidth = DEFAULT_MIN_WIDTH) {
    const [columnWidths, setColumnWidths] = useState(initialWidths);
    const resizeStateRef = useRef(null);

    const handlePointerMove = useCallback(
        (event) => {
            const state = resizeStateRef.current;
            if (!state) return;

            const deltaX = event.clientX - state.startX;
            const nextWidth = Math.max(minWidth, state.startWidth + deltaX);

            setColumnWidths((prev) => ({
                ...prev,
                [state.columnKey]: nextWidth
            }));
        },
        [minWidth]
    );

    const stopResizing = useCallback(() => {
        resizeStateRef.current = null;
        window.removeEventListener("pointermove", handlePointerMove);
    }, [handlePointerMove]);

    useEffect(() => {
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stopResizing);
            window.removeEventListener("pointercancel", stopResizing);
        };
    }, [handlePointerMove, stopResizing]);

    const getColumnStyle = useCallback(
        (columnKey) => {
            const width = columnWidths[columnKey] ?? minWidth;

            return {
                width,
                minWidth
            };
        },
        [columnWidths, minWidth]
    );

    const getResizeHandleProps = useCallback(
        (columnKey) => ({
            className: "resizable-column-handle",
            onPointerDown: (event) => {
                event.preventDefault();
                event.stopPropagation();

                const th = event.currentTarget.closest("th");
                const startWidth = columnWidths[columnKey] || th?.offsetWidth || minWidth;

                resizeStateRef.current = {
                    columnKey,
                    startX: event.clientX,
                    startWidth
                };

                event.currentTarget.setPointerCapture?.(event.pointerId);

                window.addEventListener("pointermove", handlePointerMove);
                window.addEventListener("pointerup", stopResizing, { once: true });
                window.addEventListener("pointercancel", stopResizing, { once: true });
            },
            role: "separator",
            "aria-orientation": "vertical",
            "aria-label": `Resize ${columnKey} column`
        }),
        [columnWidths, handlePointerMove, minWidth, stopResizing]
    );

    return {
        columnWidths,
        getColumnStyle,
        getResizeHandleProps
    };
}   