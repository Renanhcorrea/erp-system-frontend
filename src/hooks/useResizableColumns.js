import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_MIN_WIDTH = 80;

export default function useResizableColumns(initialWidths, minWidth = DEFAULT_MIN_WIDTH) {
    const [columnWidths, setColumnWidths] = useState(initialWidths);
    const resizeStateRef = useRef(null);

    const handleMouseMove = useCallback(
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
        window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [handleMouseMove, stopResizing]);

    const getColumnStyle = useCallback(
        (columnKey) => {
            const width = columnWidths[columnKey];

            if (!width) {
                return { minWidth };
            }

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
            onMouseDown: (event) => {
                event.preventDefault();
                event.stopPropagation();

                const th = event.currentTarget.closest("th");
                const startWidth = columnWidths[columnKey] || th?.offsetWidth || minWidth;

                resizeStateRef.current = {
                    columnKey,
                    startX: event.clientX,
                    startWidth
                };

                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", stopResizing, { once: true });
            },
            role: "separator",
            "aria-orientation": "vertical",
            "aria-label": `Resize ${columnKey} column`
        }),
        [columnWidths, handleMouseMove, minWidth, stopResizing]
    );

    return {
        columnWidths,
        getColumnStyle,
        getResizeHandleProps
    };
}
