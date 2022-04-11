import api from "./api-call";

function createComic(comic) {
    return api({
        url: "/v1/comics",
        method: "POST",
        data: comic,
    });
}

function createComicChapter(comicId, chapter) {
    return api({
        url: `/v1/comics/${comicId}/chapters`,
        method: "POST",
        data: chapter,
    });
}

function updateComicChapter(comicId, chapter) {
    return api({
        url: `/v1/comics/${comicId}/chapters/${chapter.id}`,
        method: "PUT",
        data: chapter,
    });
}

function deleteComicChapter(comicId, chapterId) {
    return api({
        url: `/v1/comics/${comicId}/chapters/${chapterId}`,
        method: "DELETE",
    });
}

function getComicChapter(comicId, chapterId) {
    return api({
        url: `/v1/comics/${comicId}/chapters/${chapterId}`,
        method: "GET",
    });
}

function getNewestChapters() {
    return api({
        url: "/v1/comics/chapters/newest",
        method: "GET",
    });
}

function getAllComic(query) {
    return api({
        url: "/v1/comics",
        method: "GET",
        params: query,
    });
}

function getAllComicTrending(query) {
    return api({
        url: "/v1/comics/trending",
        method: "GET",
        params: query,
    });
}

function getComicByUrl(url) {
    return api({
        url: `/v1/comics/${url}`,
        method: "GET",
    });
}

function getAllComicChapters(comicId) {
    return api({
        url: `/v1/comics/${comicId}/chapters`,
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

function getReviewsByComic(id) {
    return api({
        url: `/v1/reviews/comic/${id}`,
        method: "GET",
    });
}

function createReview(review) {
    return api({
        url: `/v1/reviews`,
        method: "POST",
        data: review,
    });
}
function getAllComment(chapterId) {
    return api({
        url: `/v1/comments/chapter/${chapterId}`,
        method: "GET",
    });
}

function createComment(chapterId, comment) {
    return api({
        url: `/v1/comments/${chapterId}/comments`,
        method: "POST",
        data: comment,
    });
}

export {
    createComic,
    getAllComic,
    getAllComicTrending,
    getComicByUrl,
    getAllComicChapters,
    getComicChapter,
    getNewestChapters,
    updateComic,
    deleteComic,
    createComicChapter,
    updateComicChapter,
    deleteComicChapter,
    getReviewsByComic,
    createReview,
    getAllComment,
    createComment,
};
