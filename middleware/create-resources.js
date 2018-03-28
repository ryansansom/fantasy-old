import DataLoader from 'dataloader';
import { getEvents, getLeaguesClassic } from '../lib/fetch-data';
import { Resources } from '../lib/resources';

const newDataLoader = func => new DataLoader(keys => Promise.all([...keys.map(key => func(key))]));

export default (req, res, next) => {
  req.resources = new Resources({
    classicLeagueLoader: newDataLoader(getLeaguesClassic),
    eventsLoader: newDataLoader(getEvents),
  });

  next();
};
