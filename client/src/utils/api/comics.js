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

function getComicByUrl(url) {
    return api({
        url: `/v1/comics/${url}`,
        method: "GET",
    });
}

function updateComic(id, comic) {
    return api({
        url: `/v1/comics/${id}`,
        method: "PUT",
        data: comic,
    });
}

function deleteComic(id) {
    return api({
        url: `/v1/comics/${id}`,
        method: "DELETE",
    });
}

export { createComic, getAllComic, getComicByUrl, updateComic, deleteComic };
