import api from "./api-call";

function createComic(comic) {
    return api({
        url: "/v1/comics",
        method: "POST",
        data: comic,
    });
}

function getAllComic() {
    return api({
        url: "/v1/comics",
        method: "GET",
    });
}

function updateBookTag(id, keyword) {
    return api({
        url: `/v1/comics/tags/${id}`,
        method: "PUT",
        data: {
            keyword,
        },
    });
}

function deleteBookTag(id) {
    return api({
        url: `/v1/comics/tags/${id}`,
        method: "DELETE",
    });
}

export { createComic, getAllComic, updateBookTag, deleteBookTag };
