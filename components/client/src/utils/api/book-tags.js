import api from './api-call';

function createBookTag(keyword) {
  return api({
    url: '/v1/comics/tags',
    method: 'POST',
    data: {
      keyword,
    },
  });
}

function getAllBookTag() {
  return api({
    url: '/v1/comics/tags',
    method: 'GET',
  });
}

function updateBookTag(id, keyword) {
  return api({
    url: `/v1/comics/tags/${id}`,
    method: 'PUT',
    data: {
      keyword,
    },
  });
}

function deleteBookTag(id) {
  return api({
    url: `/v1/comics/tags/${id}`,
    method: 'DELETE',
  });
}

export { createBookTag, getAllBookTag, updateBookTag, deleteBookTag };
