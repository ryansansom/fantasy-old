import DataLoader from 'dataloader';
import { getEntryPicks, getEvents, getLeaguesClassic, getElements, getEventLive, getDraftLeague, getDraftPicks } from '../lib/fetch-data';
import { Resources } from '../lib/resources';

const entryPicksWrapper = (stringifiedKeys) => {
  const { id, week } = JSON.parse(stringifiedKeys);

  return getEntryPicks(id, week);
};

const draftPicksWrapper = (stringifiedKeys) => {
  const { id, week } = JSON.parse(stringifiedKeys);

  return getDraftPicks(id, week);
};

const newDataLoader = func => new DataLoader(keys => Promise.all(keys.map(key => func(key))));

export default (req, res, next) => {
  req.resources = new Resources({
    classicLeagueLoader: newDataLoader(getLeaguesClassic),
    draftEntryPicksLoader: newDataLoader(draftPicksWrapper),
    draftLeagueLoader: newDataLoader(getDraftLeague),
    eventsLoader: newDataLoader(getEvents),
    eventLiveLoader: newDataLoader(getEventLive),
    entryPicksLoader: newDataLoader(entryPicksWrapper),
    elementsLoader: newDataLoader(getElements),
  });

  next();
};
