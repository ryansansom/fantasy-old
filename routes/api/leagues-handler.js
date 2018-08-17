import { generateLeagues } from '../../helpers/league-list';
import { safeJsonParse } from '../../helpers/safe-json-parse';

export default (req, res) => res.json(generateLeagues(safeJsonParse(req.cookies.league_list)));
