export const LOAD_STORIES = "hive/stories/LOAD";
export const LOAD_STORIES_SUCCESS = "hive/stories/LOAD_SUCCESS";
export const LOAD_STORIES_FAILURE = "hive/stories/LOAD_FAILURE";

export default function HiveReducer(
  state = { stories: [], offset: 0, refreshing: false, searchValue: null },
  action
) {
  switch (action.type) {
    case LOAD_STORIES:
      return {
        ...state,
        offset: action.payload.offset,
        refreshing: action.payload.refreshing,
        searchValue: action.payload.searchValue
      };
    case LOAD_STORIES_SUCCESS:
      return {
        ...state,
        stories:
          state.offset > 0
            ? [...state.stories, ...action.payload.data]
            : action.payload.data,
        refreshing: false
      };
    case LOAD_STORIES_FAILURE:
      return {
        ...state,
        offset: 0,
        stories: [],
        refreshing: false
      };
    default:
      return state;
  }
}

export function getStories({ refreshing = false, searchValue, offset = 0 }) {
  const params = {
    content_type: "story",
    "_sort[0]": "timestamp_modified:desc",
    "_sort[1]": "timestamp_created:desc",
    _offset: offset,
    sites: "dnews|ldschurchnews"
  };
  if (typeof searchValue !== "undefined") {
    params.q = searchValue;
  }
  const paramString = Object.keys(params)
    .map(key => {
      return `${key}=${params[key]}`;
    })
    .join("&");
  const url = `/api/contentprofiles/search?${paramString}`;
  return {
    type: LOAD_STORIES,
    payload: {
      request: {
        url
      },
      offset,
      searchValue,
      refreshing
    }
  };
}
