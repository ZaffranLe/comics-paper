import api from "./api-call";

function uploadImages(images) {
    const formData = new FormData();

    for (let _img of images) {
        formData.append("files", _img);
    }

    return api({
        url: "/v1/resources",
        method: "POST",
        data: formData,
    });
}

function getImageInfo(id) {
    return api({
        url: `/v1/resources/metadata/${id}`,
        method: "GET",
    });
}

export { uploadImages, getImageInfo };
