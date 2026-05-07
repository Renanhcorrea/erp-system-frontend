/**
 * @typedef {Object} Stock
 * @property {number} productId
 * @property {number} availableQuantity
 * @property {number} reservedQuantity
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} StockMovement
 * @property {number|string} id
 * @property {number} productId
 * @property {string} action
 * @property {number} quantity
 * @property {string|null} [referenceId]
 * @property {string} [createdAt]
 */

/**
 * @typedef {Object} StockActionRequest
 * @property {number} quantity
 * @property {string} [referenceId]
 */

export const STOCK_ACTIONS = Object.freeze({
    ADD: "addStock",
    REMOVE: "removeStock",
    RESERVE: "reserveStock",
    CONSUME_RESERVED: "consumeReservedStock",
    RELEASE_RESERVATION: "releaseReservation"
});

export const STOCK_ACTION_LABELS = Object.freeze({
    [STOCK_ACTIONS.ADD]: "Add Stock",
    [STOCK_ACTIONS.REMOVE]: "Remove Stock",
    [STOCK_ACTIONS.RESERVE]: "Reserve",
    [STOCK_ACTIONS.CONSUME_RESERVED]: "Consume Reserved",
    [STOCK_ACTIONS.RELEASE_RESERVATION]: "Release Reservation"
});
