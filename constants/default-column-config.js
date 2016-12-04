import * as classicTableConfig from '../lib/table-config/classic-table';
import * as playerListConfig from '../lib/table-config/player-list';

export const playerCols = [
  playerListConfig.position,
  playerListConfig.playerName,
  playerListConfig.playerPoints,
  playerListConfig.bonusPoints
];

export const tableCols = [
  classicTableConfig.position,
  classicTableConfig.playerName,
  classicTableConfig.prevTotal,
  classicTableConfig.currPoints,
  classicTableConfig.projPoints,
  classicTableConfig.currTotal,
  classicTableConfig.projTotal
];
